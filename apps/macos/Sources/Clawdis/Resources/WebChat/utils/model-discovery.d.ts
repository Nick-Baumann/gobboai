import type { Model } from "@mariozechner/pi-ai";
/**
 * Discover models from an Ollama server.
 * @param baseUrl - Base URL of the Ollama server (e.g., "http://localhost:11434")
 * @param apiKey - Optional API key (currently unused by Ollama)
 * @returns Array of discovered models
 */
export declare function discoverOllamaModels(baseUrl: string, _apiKey?: string): Promise<Model<any>[]>;
/**
 * Discover models from a llama.cpp server via OpenAI-compatible /v1/models endpoint.
 * @param baseUrl - Base URL of the llama.cpp server (e.g., "http://localhost:8080")
 * @param apiKey - Optional API key
 * @returns Array of discovered models
 */
export declare function discoverLlamaCppModels(baseUrl: string, apiKey?: string): Promise<Model<any>[]>;
/**
 * Discover models from a vLLM server via OpenAI-compatible /v1/models endpoint.
 * @param baseUrl - Base URL of the vLLM server (e.g., "http://localhost:8000")
 * @param apiKey - Optional API key
 * @returns Array of discovered models
 */
export declare function discoverVLLMModels(baseUrl: string, apiKey?: string): Promise<Model<any>[]>;
/**
 * Discover models from an LM Studio server using the LM Studio SDK.
 * @param baseUrl - Base URL of the LM Studio server (e.g., "http://localhost:1234")
 * @param apiKey - Optional API key (unused for LM Studio SDK)
 * @returns Array of discovered models
 */
export declare function discoverLMStudioModels(baseUrl: string, _apiKey?: string): Promise<Model<any>[]>;
/**
 * Convenience function to discover models based on provider type.
 * @param type - Provider type
 * @param baseUrl - Base URL of the server
 * @param apiKey - Optional API key
 * @returns Array of discovered models
 */
export declare function discoverModels(type: "ollama" | "llama.cpp" | "vllm" | "lmstudio", baseUrl: string, apiKey?: string): Promise<Model<any>[]>;
//# sourceMappingURL=model-discovery.d.ts.map