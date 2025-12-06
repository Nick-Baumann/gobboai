import type { IndexedDBConfig, StorageBackend, StorageTransaction } from "../types.js";
/**
 * IndexedDB implementation of StorageBackend.
 * Provides multi-store key-value storage with transactions and quota management.
 */
export declare class IndexedDBStorageBackend implements StorageBackend {
    private config;
    private dbPromise;
    constructor(config: IndexedDBConfig);
    private getDB;
    private promisifyRequest;
    get<T = unknown>(storeName: string, key: string): Promise<T | null>;
    set<T = unknown>(storeName: string, key: string, value: T): Promise<void>;
    delete(storeName: string, key: string): Promise<void>;
    keys(storeName: string, prefix?: string): Promise<string[]>;
    getAllFromIndex<T = unknown>(storeName: string, indexName: string, direction?: "asc" | "desc"): Promise<T[]>;
    clear(storeName: string): Promise<void>;
    has(storeName: string, key: string): Promise<boolean>;
    transaction<T>(storeNames: string[], mode: "readonly" | "readwrite", operation: (tx: StorageTransaction) => Promise<T>): Promise<T>;
    getQuotaInfo(): Promise<{
        usage: number;
        quota: number;
        percent: number;
    }>;
    requestPersistence(): Promise<boolean>;
}
//# sourceMappingURL=indexeddb-storage-backend.d.ts.map