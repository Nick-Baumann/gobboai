import type { Api, Model } from "@mariozechner/pi-ai";
/**
 * Centralized proxy decision logic.
 *
 * Determines whether to use a CORS proxy for LLM API requests based on:
 * - Provider name
 * - API key pattern (for providers where it matters)
 */
/**
 * Check if a provider/API key combination requires a CORS proxy.
 *
 * @param provider - Provider name (e.g., "anthropic", "openai", "zai")
 * @param apiKey - API key for the provider
 * @returns true if proxy is required, false otherwise
 */
export declare function shouldUseProxyForProvider(provider: string, apiKey: string): boolean;
/**
 * Apply CORS proxy to a model's baseUrl if needed.
 *
 * @param model - The model to potentially proxy
 * @param apiKey - API key for the provider
 * @param proxyUrl - CORS proxy URL (e.g., "https://proxy.mariozechner.at/proxy")
 * @returns Model with modified baseUrl if proxy is needed, otherwise original model
 */
export declare function applyProxyIfNeeded<T extends Api>(model: Model<T>, apiKey: string, proxyUrl?: string): Model<T>;
/**
 * Check if an error is likely a CORS error.
 *
 * CORS errors in browsers typically manifest as:
 * - TypeError with message "Failed to fetch"
 * - NetworkError
 *
 * @param error - The error to check
 * @returns true if error is likely a CORS error
 */
export declare function isCorsError(error: unknown): boolean;
//# sourceMappingURL=proxy-utils.d.ts.map