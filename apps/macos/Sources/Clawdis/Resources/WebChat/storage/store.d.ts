import type { StorageBackend, StoreConfig } from "./types.js";
/**
 * Base class for all storage stores.
 * Each store defines its IndexedDB schema and provides domain-specific methods.
 */
export declare abstract class Store {
    private backend;
    /**
     * Returns the IndexedDB configuration for this store.
     * Defines store name, key path, and indices.
     */
    abstract getConfig(): StoreConfig;
    /**
     * Sets the storage backend. Called by AppStorage after backend creation.
     */
    setBackend(backend: StorageBackend): void;
    /**
     * Gets the storage backend. Throws if backend not set.
     * Concrete stores must use this to access the backend.
     */
    protected getBackend(): StorageBackend;
}
//# sourceMappingURL=store.d.ts.map