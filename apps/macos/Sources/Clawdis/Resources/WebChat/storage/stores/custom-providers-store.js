import { Store } from "../store.js";
/**
 * Store for custom LLM providers (auto-discovery servers + manual providers).
 */
export class CustomProvidersStore extends Store {
    getConfig() {
        return {
            name: "custom-providers",
        };
    }
    async get(id) {
        return this.getBackend().get("custom-providers", id);
    }
    async set(provider) {
        await this.getBackend().set("custom-providers", provider.id, provider);
    }
    async delete(id) {
        await this.getBackend().delete("custom-providers", id);
    }
    async getAll() {
        const keys = await this.getBackend().keys("custom-providers");
        const providers = [];
        for (const key of keys) {
            const provider = await this.get(key);
            if (provider) {
                providers.push(provider);
            }
        }
        return providers;
    }
    async has(id) {
        return this.getBackend().has("custom-providers", id);
    }
}
//# sourceMappingURL=custom-providers-store.js.map