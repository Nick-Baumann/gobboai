import type { SandboxRuntimeProvider } from "./SandboxRuntimeProvider.js";
export interface ConsoleLog {
    type: "log" | "warn" | "error" | "info";
    text: string;
    args?: unknown[];
}
/**
 * Console Runtime Provider
 *
 * REQUIRED provider that should always be included first.
 * Provides console capture, error handling, and execution lifecycle management.
 * Collects console output for retrieval by caller.
 */
export declare class ConsoleRuntimeProvider implements SandboxRuntimeProvider {
    private logs;
    private completionError;
    private completed;
    getData(): Record<string, any>;
    getDescription(): string;
    getRuntime(): (sandboxId: string) => void;
    handleMessage(message: any, respond: (response: any) => void): Promise<void>;
    /**
     * Get collected console logs
     */
    getLogs(): ConsoleLog[];
    /**
     * Get completion status
     */
    isCompleted(): boolean;
    /**
     * Get completion error if any
     */
    getCompletionError(): {
        message: string;
        stack: string;
    } | null;
    /**
     * Reset state for reuse
     */
    reset(): void;
}
//# sourceMappingURL=ConsoleRuntimeProvider.d.ts.map