import { Store } from "../store.js";
import type { StoreConfig } from "../types.js";
/**
 * Store for application settings (theme, proxy config, etc.).
 */
export declare class SettingsStore extends Store {
    getConfig(): StoreConfig;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    list(): Promise<string[]>;
    clear(): Promise<void>;
}
//# sourceMappingURL=settings-store.d.ts.map