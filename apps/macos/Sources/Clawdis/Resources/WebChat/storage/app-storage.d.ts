import type { CustomProvidersStore } from "./stores/custom-providers-store.js";
import type { ProviderKeysStore } from "./stores/provider-keys-store.js";
import type { SessionsStore } from "./stores/sessions-store.js";
import type { SettingsStore } from "./stores/settings-store.js";
import type { StorageBackend } from "./types.js";
/**
 * High-level storage API providing access to all storage operations.
 * Subclasses can extend this to add domain-specific stores.
 */
export declare class AppStorage {
    readonly backend: StorageBackend;
    readonly settings: SettingsStore;
    readonly providerKeys: ProviderKeysStore;
    readonly sessions: SessionsStore;
    readonly customProviders: CustomProvidersStore;
    constructor(settings: SettingsStore, providerKeys: ProviderKeysStore, sessions: SessionsStore, customProviders: CustomProvidersStore, backend: StorageBackend);
    getQuotaInfo(): Promise<{
        usage: number;
        quota: number;
        percent: number;
    }>;
    requestPersistence(): Promise<boolean>;
}
/**
 * Get the global AppStorage instance.
 * Throws if not initialized.
 */
export declare function getAppStorage(): AppStorage;
/**
 * Set the global AppStorage instance.
 */
export declare function setAppStorage(storage: AppStorage): void;
//# sourceMappingURL=app-storage.d.ts.map