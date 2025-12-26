import { HEARTBEAT_TOKEN } from "./tokens.js";

export const HEARTBEAT_PROMPT = "HEARTBEAT";

export function stripHeartbeatToken(raw?: string) {
  if (!raw) return { shouldSkip: true, text: "" };
  const trimmed = raw.trim();
  if (!trimmed) return { shouldSkip: true, text: "" };
  if (trimmed === HEARTBEAT_TOKEN) return { shouldSkip: true, text: "" };
  const hadToken = trimmed.includes(HEARTBEAT_TOKEN);
  let withoutToken = trimmed.replaceAll(HEARTBEAT_TOKEN, "").trim();
  if (hadToken && withoutToken) {
    // LLMs sometimes echo malformed HEARTBEAT_OK_OK... tails; strip trailing OK runs to avoid spam.
    withoutToken = withoutToken.replace(/[\s_]*OK(?:[\s_]*OK)*$/gi, "").trim();
  }
  const shouldSkip = withoutToken.length === 0;
  return {
    shouldSkip,
    text: shouldSkip ? "" : withoutToken || trimmed,
  };
}
