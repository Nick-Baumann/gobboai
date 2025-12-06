import { Store } from "../store.js";
/**
 * Store for application settings (theme, proxy config, etc.).
 */
export class SettingsStore extends Store {
    getConfig() {
        return {
            name: "settings",
            // No keyPath - uses out-of-line keys
        };
    }
    async get(key) {
        return this.getBackend().get("settings", key);
    }
    async set(key, value) {
        await this.getBackend().set("settings", key, value);
    }
    async delete(key) {
        await this.getBackend().delete("settings", key);
    }
    async list() {
        return this.getBackend().keys("settings");
    }
    async clear() {
        await this.getBackend().clear("settings");
    }
}
//# sourceMappingURL=settings-store.js.map