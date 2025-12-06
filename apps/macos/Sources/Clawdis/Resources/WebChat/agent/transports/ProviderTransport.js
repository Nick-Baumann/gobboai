import { agentLoop, } from "@mariozechner/pi-ai";
import { getAppStorage } from "../../storage/app-storage.js";
import { applyProxyIfNeeded } from "../../utils/proxy-utils.js";
/**
 * Transport that calls LLM providers directly.
 * Uses CORS proxy only for providers that require it (Anthropic OAuth, Z-AI).
 */
export class ProviderTransport {
    async *run(messages, userMessage, cfg, signal) {
        // Get API key from storage
        const apiKey = await getAppStorage().providerKeys.get(cfg.model.provider);
        if (!apiKey) {
            throw new Error("no-api-key");
        }
        // Get proxy URL from settings (if available)
        const proxyEnabled = await getAppStorage().settings.get("proxy.enabled");
        const proxyUrl = await getAppStorage().settings.get("proxy.url");
        // Apply proxy only if this provider/key combination requires it
        const model = applyProxyIfNeeded(cfg.model, apiKey, proxyEnabled ? proxyUrl || undefined : undefined);
        // Messages are already LLM-compatible (filtered by Agent)
        const context = {
            systemPrompt: cfg.systemPrompt,
            messages,
            tools: cfg.tools,
        };
        const pc = {
            model,
            reasoning: cfg.reasoning,
            apiKey,
            getQueuedMessages: cfg.getQueuedMessages,
        };
        // Yield events from agentLoop
        for await (const ev of agentLoop(userMessage, context, pc, signal)) {
            yield ev;
        }
    }
}
//# sourceMappingURL=ProviderTransport.js.map