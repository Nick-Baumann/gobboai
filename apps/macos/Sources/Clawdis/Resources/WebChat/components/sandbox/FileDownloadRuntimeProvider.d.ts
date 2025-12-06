import type { SandboxRuntimeProvider } from "./SandboxRuntimeProvider.js";
export interface DownloadableFile {
    fileName: string;
    content: string | Uint8Array;
    mimeType: string;
}
/**
 * File Download Runtime Provider
 *
 * Provides returnDownloadableFile() for creating user downloads.
 * Files returned this way are NOT accessible to the LLM later (one-time download).
 * Works both online (sends to extension) and offline (triggers browser download directly).
 * Collects files for retrieval by caller.
 */
export declare class FileDownloadRuntimeProvider implements SandboxRuntimeProvider {
    private files;
    getData(): Record<string, any>;
    getRuntime(): (sandboxId: string) => void;
    handleMessage(message: any, respond: (response: any) => void): Promise<void>;
    /**
     * Get collected files
     */
    getFiles(): DownloadableFile[];
    /**
     * Reset state for reuse
     */
    reset(): void;
    getDescription(): string;
}
//# sourceMappingURL=FileDownloadRuntimeProvider.d.ts.map