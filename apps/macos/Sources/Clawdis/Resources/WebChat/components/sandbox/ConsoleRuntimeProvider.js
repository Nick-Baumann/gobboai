/**
 * Console Runtime Provider
 *
 * REQUIRED provider that should always be included first.
 * Provides console capture, error handling, and execution lifecycle management.
 * Collects console output for retrieval by caller.
 */
export class ConsoleRuntimeProvider {
    constructor() {
        this.logs = [];
        this.completionError = null;
        this.completed = false;
    }
    getData() {
        // No data needed
        return {};
    }
    getDescription() {
        return "";
    }
    getRuntime() {
        return (_sandboxId) => {
            // Store truly original console methods on first wrap only
            // This prevents accumulation of wrapper functions across multiple executions
            if (!window.__originalConsole) {
                window.__originalConsole = {
                    log: console.log.bind(console),
                    error: console.error.bind(console),
                    warn: console.warn.bind(console),
                    info: console.info.bind(console),
                };
            }
            // Always use the truly original console, not the current (possibly wrapped) one
            const originalConsole = window.__originalConsole;
            // Track pending send promises to wait for them in onCompleted
            const pendingSends = [];
            ["log", "error", "warn", "info"].forEach((method) => {
                console[method] = (...args) => {
                    const text = args
                        .map((arg) => {
                        try {
                            return typeof arg === "object" ? JSON.stringify(arg) : String(arg);
                        }
                        catch {
                            return String(arg);
                        }
                    })
                        .join(" ");
                    // Always log locally too (using truly original console)
                    originalConsole[method].apply(console, args);
                    // Send immediately and track the promise (only in extension context)
                    if (window.sendRuntimeMessage) {
                        const sendPromise = window
                            .sendRuntimeMessage({
                            type: "console",
                            method,
                            text,
                            args,
                        })
                            .catch(() => { });
                        pendingSends.push(sendPromise);
                    }
                };
            });
            // Register completion callback to wait for all pending sends
            if (window.onCompleted) {
                window.onCompleted(async (_success) => {
                    // Wait for all pending console sends to complete
                    if (pendingSends.length > 0) {
                        await Promise.all(pendingSends);
                    }
                });
            }
            // Track errors for HTML artifacts
            let lastError = null;
            // Error handlers - track errors but don't log them
            // (they'll be shown via execution-error message)
            window.addEventListener("error", (e) => {
                const text = (e.error?.stack || e.message || String(e)) + " at line " + (e.lineno || "?") + ":" + (e.colno || "?");
                lastError = {
                    message: e.error?.message || e.message || String(e),
                    stack: e.error?.stack || text,
                };
            });
            window.addEventListener("unhandledrejection", (e) => {
                const text = "Unhandled promise rejection: " + (e.reason?.message || e.reason || "Unknown error");
                lastError = {
                    message: e.reason?.message || String(e.reason) || "Unhandled promise rejection",
                    stack: e.reason?.stack || text,
                };
            });
            // Expose complete() method for user code to call
            let completionSent = false;
            window.complete = async (error, returnValue) => {
                if (completionSent)
                    return;
                completionSent = true;
                const finalError = error || lastError;
                if (window.sendRuntimeMessage) {
                    if (finalError) {
                        await window.sendRuntimeMessage({
                            type: "execution-error",
                            error: finalError,
                        });
                    }
                    else {
                        await window.sendRuntimeMessage({
                            type: "execution-complete",
                            returnValue,
                        });
                    }
                }
            };
        };
    }
    async handleMessage(message, respond) {
        if (message.type === "console") {
            // Collect console output
            this.logs.push({
                type: message.method === "error"
                    ? "error"
                    : message.method === "warn"
                        ? "warn"
                        : message.method === "info"
                            ? "info"
                            : "log",
                text: message.text,
                args: message.args,
            });
            // Acknowledge receipt
            respond({ success: true });
        }
    }
    /**
     * Get collected console logs
     */
    getLogs() {
        return this.logs;
    }
    /**
     * Get completion status
     */
    isCompleted() {
        return this.completed;
    }
    /**
     * Get completion error if any
     */
    getCompletionError() {
        return this.completionError;
    }
    /**
     * Reset state for reuse
     */
    reset() {
        this.logs = [];
        this.completionError = null;
        this.completed = false;
    }
}
//# sourceMappingURL=ConsoleRuntimeProvider.js.map