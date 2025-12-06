import { Store } from "../store.js";
/**
 * Store for LLM provider API keys (Anthropic, OpenAI, etc.).
 */
export class ProviderKeysStore extends Store {
    getConfig() {
        return {
            name: "provider-keys",
        };
    }
    async get(provider) {
        return this.getBackend().get("provider-keys", provider);
    }
    async set(provider, key) {
        await this.getBackend().set("provider-keys", provider, key);
    }
    async delete(provider) {
        await this.getBackend().delete("provider-keys", provider);
    }
    async list() {
        return this.getBackend().keys("provider-keys");
    }
    async has(provider) {
        return this.getBackend().has("provider-keys", provider);
    }
}
//# sourceMappingURL=provider-keys-store.js.map