# Web Chat (macOS app)

The macOS menu bar app ships a bundled web UI (pi-web-ui) rendered inside WKWebView. It reuses the **primary Clawd session** (`main` by default, configurable via `inbound.reply.session.mainKey`) and never opens a local HTTP port.

## Launch & debugging
- Manual: Lobster menu → “Open Chat”.
- Auto-open for testing: run `dist/Clawdis.app/Contents/MacOS/Clawdis --webchat` (or pass `--webchat` to the binary launched by launchd). The window opens on startup.
- Inspect: right-click the web view → “Inspect Element” (developerExtras enabled). Console logs go to the Swift logger (subsystem `com.steipete.clawdis`, category `WebChat`). The HTML boot script also writes status text into the `#app` div until the panel mounts.
- WK logs: navigation lifecycle, readyState, js location, and JS errors/unhandled rejections are mirrored to OSLog for easier diagnosis.

## How it’s wired
- Assets: `apps/macos/Sources/Clawdis/Resources/WebChat/` contains the `pi-web-ui` dist plus a local import map pointing at bundled vendor modules and a tiny `pi-ai` stub. Everything loads from the app bundle (file URLs, no network).
- Bridge: `WKScriptMessageHandler` named `clawdis` in `WebChatWindow.swift`. JS posts `{type:"chat", payload:{text, sessionKey}}`; Swift shells `pnpm clawdis agent --to <sessionKey> --message <text> --json`, returns the first payload text, and hydrates the UI with prior messages from `~/.clawdis/sessions/<SessionId>.jsonl`.
- Session: always primary; multiple transports (WhatsApp/Telegram/Desktop) share the same session key so context is unified.

## Security / surface area
- No local server is started; everything is `file://` within the app bundle.
- CSP is set to `default-src 'self' 'unsafe-inline' data: blob:` to keep module imports bundle-local.
- Web Inspector is opt-in via right-click; otherwise WKWebView stays in the app sandbox.

## Known limitations
- Text-only, single-turn (no streaming); tools/attachments not yet plumbed.
- Uses a stubbed pi-ai for model metadata; model selection is fixed to the primary Clawd backend.

## Updating the bundle
1) Ensure `../pi-mono` is present and built (`pnpm install` + `pnpm build` inside `packages/web-ui`).
2) Copy vendor deps into `Resources/WebChat/vendor` (currently synced from `../pi-mono/node_modules`).
3) Rebuild/restart the mac app with `./scripts/restart-mac.sh` so the new assets land in the bundle.
