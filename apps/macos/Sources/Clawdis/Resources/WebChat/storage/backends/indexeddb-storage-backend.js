/**
 * IndexedDB implementation of StorageBackend.
 * Provides multi-store key-value storage with transactions and quota management.
 */
export class IndexedDBStorageBackend {
    constructor(config) {
        this.config = config;
        this.dbPromise = null;
    }
    async getDB() {
        if (!this.dbPromise) {
            this.dbPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(this.config.dbName, this.config.version);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                request.onupgradeneeded = (_event) => {
                    const db = request.result;
                    // Create object stores from config
                    for (const storeConfig of this.config.stores) {
                        if (!db.objectStoreNames.contains(storeConfig.name)) {
                            const store = db.createObjectStore(storeConfig.name, {
                                keyPath: storeConfig.keyPath,
                                autoIncrement: storeConfig.autoIncrement,
                            });
                            // Create indices
                            if (storeConfig.indices) {
                                for (const indexConfig of storeConfig.indices) {
                                    store.createIndex(indexConfig.name, indexConfig.keyPath, {
                                        unique: indexConfig.unique,
                                    });
                                }
                            }
                        }
                    }
                };
            });
        }
        return this.dbPromise;
    }
    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    async get(storeName, key) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const result = await this.promisifyRequest(store.get(key));
        return result ?? null;
    }
    async set(storeName, key, value) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        // If store has keyPath, only pass value (in-line key)
        // Otherwise pass both value and key (out-of-line key)
        if (store.keyPath) {
            await this.promisifyRequest(store.put(value));
        }
        else {
            await this.promisifyRequest(store.put(value, key));
        }
    }
    async delete(storeName, key) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        await this.promisifyRequest(store.delete(key));
    }
    async keys(storeName, prefix) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        if (prefix) {
            // Use IDBKeyRange for efficient prefix filtering
            const range = IDBKeyRange.bound(prefix, prefix + "\uffff", false, false);
            const keys = await this.promisifyRequest(store.getAllKeys(range));
            return keys.map((k) => String(k));
        }
        else {
            const keys = await this.promisifyRequest(store.getAllKeys());
            return keys.map((k) => String(k));
        }
    }
    async getAllFromIndex(storeName, indexName, direction = "asc") {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const results = [];
            const request = index.openCursor(null, direction === "desc" ? "prev" : "next");
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
    async clear(storeName) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        await this.promisifyRequest(store.clear());
    }
    async has(storeName, key) {
        const db = await this.getDB();
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const result = await this.promisifyRequest(store.getKey(key));
        return result !== undefined;
    }
    async transaction(storeNames, mode, operation) {
        const db = await this.getDB();
        const idbTx = db.transaction(storeNames, mode);
        const storageTx = {
            get: async (storeName, key) => {
                const store = idbTx.objectStore(storeName);
                const result = await this.promisifyRequest(store.get(key));
                return (result ?? null);
            },
            set: async (storeName, key, value) => {
                const store = idbTx.objectStore(storeName);
                // If store has keyPath, only pass value (in-line key)
                // Otherwise pass both value and key (out-of-line key)
                if (store.keyPath) {
                    await this.promisifyRequest(store.put(value));
                }
                else {
                    await this.promisifyRequest(store.put(value, key));
                }
            },
            delete: async (storeName, key) => {
                const store = idbTx.objectStore(storeName);
                await this.promisifyRequest(store.delete(key));
            },
        };
        return operation(storageTx);
    }
    async getQuotaInfo() {
        if (navigator.storage?.estimate) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage || 0,
                quota: estimate.quota || 0,
                percent: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
            };
        }
        return { usage: 0, quota: 0, percent: 0 };
    }
    async requestPersistence() {
        if (navigator.storage?.persist) {
            return await navigator.storage.persist();
        }
        return false;
    }
}
//# sourceMappingURL=indexeddb-storage-backend.js.map