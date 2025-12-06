import type { Message } from "@mariozechner/pi-ai";
import type { AgentRunConfig, AgentTransport } from "./types.js";
/**
 * Transport that uses an app server with user authentication tokens.
 * The server manages user accounts and proxies requests to LLM providers.
 */
export declare class AppTransport implements AgentTransport {
    private readonly proxyUrl;
    run(messages: Message[], userMessage: Message, cfg: AgentRunConfig, signal?: AbortSignal): AsyncGenerator<import("@mariozechner/pi-ai").AgentEvent, void, unknown>;
}
//# sourceMappingURL=AppTransport.d.ts.map