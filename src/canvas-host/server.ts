import fs from "node:fs/promises";
import http, { type Server } from "node:http";
import os from "node:os";
import path from "node:path";

import chokidar from "chokidar";
import express from "express";
import { type WebSocket, WebSocketServer } from "ws";
import type { BridgeBindMode } from "../config/config.js";
import { pickPrimaryTailnetIPv4 } from "../infra/tailnet.js";
import { detectMime } from "../media/mime.js";
import type { RuntimeEnv } from "../runtime.js";
import { ensureDir, resolveUserPath } from "../utils.js";

export type CanvasHostOpts = {
  runtime: RuntimeEnv;
  rootDir?: string;
  port?: number;
  bind?: BridgeBindMode;
  allowInTests?: boolean;
};

export type CanvasHostServer = {
  port: number;
  rootDir: string;
  close: () => Promise<void>;
};

const WS_PATH = "/__clawdis/ws";

export function injectCanvasLiveReload(html: string): string {
  const snippet = `
<script>
(() => {
  try {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(proto + "://" + location.host + ${JSON.stringify(WS_PATH)});
    ws.onmessage = (ev) => {
      if (String(ev.data || "") === "reload") location.reload();
    };
  } catch {}
})();
</script>
`.trim();

  const idx = html.toLowerCase().lastIndexOf("</body>");
  if (idx >= 0) {
    return `${html.slice(0, idx)}\n${snippet}\n${html.slice(idx)}`;
  }
  return `${html}\n${snippet}\n`;
}

function normalizeUrlPath(rawPath: string): string {
  const decoded = decodeURIComponent(rawPath || "/");
  const normalized = path.posix.normalize(decoded);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

async function resolveFilePath(rootReal: string, urlPath: string) {
  const normalized = normalizeUrlPath(urlPath);
  const rel = normalized.replace(/^\/+/, "");
  if (rel.split("/").some((p) => p === "..")) return null;

  let candidate = path.join(rootReal, rel);
  if (normalized.endsWith("/")) {
    candidate = path.join(candidate, "index.html");
  }

  try {
    const st = await fs.stat(candidate);
    if (st.isDirectory()) {
      candidate = path.join(candidate, "index.html");
    }
  } catch {
    // ignore
  }

  const rootPrefix = rootReal.endsWith(path.sep)
    ? rootReal
    : `${rootReal}${path.sep}`;
  try {
    const lstat = await fs.lstat(candidate);
    if (lstat.isSymbolicLink()) return null;
    const real = await fs.realpath(candidate);
    if (!real.startsWith(rootPrefix)) return null;
    return real;
  } catch {
    return null;
  }
}

function resolveBindHost(bind: BridgeBindMode | undefined): string | null {
  const mode = bind ?? "lan";
  if (mode === "loopback") return "127.0.0.1";
  if (mode === "lan") return "0.0.0.0";
  if (mode === "auto") return "0.0.0.0";
  if (mode === "tailnet") return pickPrimaryTailnetIPv4() ?? null;
  return "0.0.0.0";
}

function isDisabledByEnv() {
  if (process.env.CLAWDIS_SKIP_CANVAS_HOST === "1") return true;
  if (process.env.NODE_ENV === "test") return true;
  if (process.env.VITEST) return true;
  return false;
}

export async function startCanvasHost(
  opts: CanvasHostOpts,
): Promise<CanvasHostServer> {
  if (isDisabledByEnv() && opts.allowInTests !== true) {
    return { port: 0, rootDir: "", close: async () => {} };
  }

  const rootDir = resolveUserPath(
    opts.rootDir ?? path.join(os.homedir(), "clawd", "canvas"),
  );
  await ensureDir(rootDir);
  const rootReal = await fs.realpath(rootDir);

  const bindHost = resolveBindHost(opts.bind);
  if (!bindHost) {
    throw new Error(
      "canvasHost.bind is tailnet, but no tailnet interface was found; refusing to start canvas host",
    );
  }

  const app = express();
  app.disable("x-powered-by");

  app.get(/.*/, async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (url.pathname === WS_PATH) {
        res.status(426).send("upgrade required");
        return;
      }

      const filePath = await resolveFilePath(rootReal, url.pathname);
      if (!filePath) {
        if (url.pathname === "/" || url.pathname.endsWith("/")) {
          res
            .status(404)
            .type("text/html")
            .send(
              `<!doctype html><meta charset="utf-8" /><title>Clawdis Canvas</title><pre>Missing file.\nCreate ${rootDir}/index.html</pre>`,
            );
          return;
        }
        res.status(404).send("not found");
        return;
      }

      const lower = filePath.toLowerCase();
      const mime =
        lower.endsWith(".html") || lower.endsWith(".htm")
          ? "text/html"
          : (detectMime({ filePath }) ?? "application/octet-stream");

      res.setHeader("Cache-Control", "no-store");
      if (mime === "text/html") {
        const html = await fs.readFile(filePath, "utf8");
        res.type("text/html; charset=utf-8").send(injectCanvasLiveReload(html));
        return;
      }

      res.type(mime).send(await fs.readFile(filePath));
    } catch (err) {
      opts.runtime.error(`canvasHost request failed: ${String(err)}`);
      res.status(500).send("error");
    }
  });

  const server: Server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: WS_PATH });
  const sockets = new Set<WebSocket>();
  wss.on("connection", (ws) => {
    sockets.add(ws);
    ws.on("close", () => sockets.delete(ws));
  });

  let debounce: NodeJS.Timeout | null = null;
  const broadcastReload = () => {
    for (const ws of sockets) {
      try {
        ws.send("reload");
      } catch {
        // ignore
      }
    }
  };
  const scheduleReload = () => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      debounce = null;
      broadcastReload();
    }, 75);
    debounce.unref?.();
  };

  const watcher = chokidar.watch(rootReal, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 75, pollInterval: 10 },
    ignored: [
      /(^|[\\/])\../, // dotfiles
      /(^|[\\/])node_modules([\\/]|$)/,
    ],
  });
  watcher.on("all", () => scheduleReload());

  const listenPort =
    typeof opts.port === "number" && Number.isFinite(opts.port) && opts.port > 0
      ? opts.port
      : 0;
  await new Promise<void>((resolve, reject) => {
    const onError = (err: NodeJS.ErrnoException) => {
      server.off("listening", onListening);
      reject(err);
    };
    const onListening = () => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(listenPort, bindHost);
  });

  const addr = server.address();
  const boundPort = typeof addr === "object" && addr ? addr.port : 0;
  opts.runtime.log(
    `canvas host listening on http://${bindHost}:${boundPort} (root ${rootDir})`,
  );

  return {
    port: boundPort,
    rootDir,
    close: async () => {
      if (debounce) clearTimeout(debounce);
      await watcher.close().catch(() => {});
      await new Promise<void>((resolve) => wss.close(() => resolve()));
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      );
    },
  };
}
