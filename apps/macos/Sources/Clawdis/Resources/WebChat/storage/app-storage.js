/**
 * High-level storage API providing access to all storage operations.
 * Subclasses can extend this to add domain-specific stores.
 */
export class AppStorage {
    constructor(settings, providerKeys, sessions, customProviders, backend) {
        this.settings = settings;
        this.providerKeys = providerKeys;
        this.sessions = sessions;
        this.customProviders = customProviders;
        this.backend = backend;
    }
    async getQuotaInfo() {
        return this.backend.getQuotaInfo();
    }
    async requestPersistence() {
        return this.backend.requestPersistence();
    }
}
// Global instance management
let globalAppStorage = null;
/**
 * Get the global AppStorage instance.
 * Throws if not initialized.
 */
export function getAppStorage() {
    if (!globalAppStorage) {
        throw new Error("AppStorage not initialized. Call setAppStorage() first.");
    }
    return globalAppStorage;
}
/**
 * Set the global AppStorage instance.
 */
export function setAppStorage(storage) {
    globalAppStorage = storage;
}
//# sourceMappingURL=app-storage.js.map