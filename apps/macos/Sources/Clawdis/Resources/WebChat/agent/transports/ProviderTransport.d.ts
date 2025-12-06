import { type Message } from "@mariozechner/pi-ai";
import type { AgentRunConfig, AgentTransport } from "./types.js";
/**
 * Transport that calls LLM providers directly.
 * Uses CORS proxy only for providers that require it (Anthropic OAuth, Z-AI).
 */
export declare class ProviderTransport implements AgentTransport {
    run(messages: Message[], userMessage: Message, cfg: AgentRunConfig, signal?: AbortSignal): AsyncGenerator<import("@mariozechner/pi-ai").AgentEvent, void, unknown>;
}
//# sourceMappingURL=ProviderTransport.d.ts.map