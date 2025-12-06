/**
 * Base class for all storage stores.
 * Each store defines its IndexedDB schema and provides domain-specific methods.
 */
export class Store {
    constructor() {
        this.backend = null;
    }
    /**
     * Sets the storage backend. Called by AppStorage after backend creation.
     */
    setBackend(backend) {
        this.backend = backend;
    }
    /**
     * Gets the storage backend. Throws if backend not set.
     * Concrete stores must use this to access the backend.
     */
    getBackend() {
        if (!this.backend) {
            throw new Error(`Backend not set on ${this.constructor.name}`);
        }
        return this.backend;
    }
}
//# sourceMappingURL=store.js.map