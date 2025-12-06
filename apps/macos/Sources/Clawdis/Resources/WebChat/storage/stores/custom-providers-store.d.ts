import type { Model } from "@mariozechner/pi-ai";
import { Store } from "../store.js";
import type { StoreConfig } from "../types.js";
export type AutoDiscoveryProviderType = "ollama" | "llama.cpp" | "vllm" | "lmstudio";
export type CustomProviderType = AutoDiscoveryProviderType | "openai-completions" | "openai-responses" | "anthropic-messages";
export interface CustomProvider {
    id: string;
    name: string;
    type: CustomProviderType;
    baseUrl: string;
    apiKey?: string;
    models?: Model<any>[];
}
/**
 * Store for custom LLM providers (auto-discovery servers + manual providers).
 */
export declare class CustomProvidersStore extends Store {
    getConfig(): StoreConfig;
    get(id: string): Promise<CustomProvider | null>;
    set(provider: CustomProvider): Promise<void>;
    delete(id: string): Promise<void>;
    getAll(): Promise<CustomProvider[]>;
    has(id: string): Promise<boolean>;
}
//# sourceMappingURL=custom-providers-store.d.ts.map