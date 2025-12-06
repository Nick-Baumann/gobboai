import { Store } from "../store.js";
import type { StoreConfig } from "../types.js";
/**
 * Store for LLM provider API keys (Anthropic, OpenAI, etc.).
 */
export declare class ProviderKeysStore extends Store {
    getConfig(): StoreConfig;
    get(provider: string): Promise<string | null>;
    set(provider: string, key: string): Promise<void>;
    delete(provider: string): Promise<void>;
    list(): Promise<string[]>;
    has(provider: string): Promise<boolean>;
}
//# sourceMappingURL=provider-keys-store.d.ts.map