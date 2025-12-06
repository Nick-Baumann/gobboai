/**
 * Centralized message router for all runtime communication.
 *
 * This singleton replaces all individual window.addEventListener("message") calls
 * with a single global listener that routes messages to the appropriate handlers.
 * Also handles user script messages from chrome.runtime.onUserScriptMessage.
 *
 * Benefits:
 * - Single global listener instead of multiple independent listeners
 * - Automatic cleanup when sandboxes are destroyed
 * - Support for bidirectional communication (providers) and broadcasting (consumers)
 * - Works with both sandbox iframes and user scripts
 * - Clear lifecycle management
 */
export class RuntimeMessageRouter {
    constructor() {
        this.sandboxes = new Map();
        this.messageListener = null;
        this.userScriptMessageListener = null;
    }
    /**
     * Register a new sandbox with its runtime providers.
     * Call this BEFORE creating the iframe (for sandbox contexts) or executing user script.
     */
    registerSandbox(sandboxId, providers, consumers) {
        this.sandboxes.set(sandboxId, {
            sandboxId,
            iframe: null, // Will be set via setSandboxIframe() for sandbox contexts
            providers,
            consumers: new Set(consumers),
        });
        // Setup global listener if not already done
        this.setupListener();
    }
    /**
     * Update the iframe reference for a sandbox.
     * Call this AFTER creating the iframe.
     * This is needed so providers can send responses back to the sandbox.
     */
    setSandboxIframe(sandboxId, iframe) {
        const context = this.sandboxes.get(sandboxId);
        if (context) {
            context.iframe = iframe;
        }
    }
    /**
     * Unregister a sandbox and remove all its consumers.
     * Call this when the sandbox is destroyed.
     */
    unregisterSandbox(sandboxId) {
        this.sandboxes.delete(sandboxId);
        // If no more sandboxes, remove global listeners
        if (this.sandboxes.size === 0) {
            // Remove iframe listener
            if (this.messageListener) {
                window.removeEventListener("message", this.messageListener);
                this.messageListener = null;
            }
            // Remove user script listener
            if (this.userScriptMessageListener && typeof chrome !== "undefined" && chrome.runtime?.onUserScriptMessage) {
                chrome.runtime.onUserScriptMessage.removeListener(this.userScriptMessageListener);
                this.userScriptMessageListener = null;
            }
        }
    }
    /**
     * Add a message consumer for a sandbox.
     * Consumers receive broadcast messages (console, execution-complete, etc.)
     */
    addConsumer(sandboxId, consumer) {
        const context = this.sandboxes.get(sandboxId);
        if (context) {
            context.consumers.add(consumer);
        }
    }
    /**
     * Remove a message consumer from a sandbox.
     */
    removeConsumer(sandboxId, consumer) {
        const context = this.sandboxes.get(sandboxId);
        if (context) {
            context.consumers.delete(consumer);
        }
    }
    /**
     * Setup the global message listeners (called automatically)
     */
    setupListener() {
        // Setup sandbox iframe listener
        if (!this.messageListener) {
            this.messageListener = async (e) => {
                const { sandboxId, messageId } = e.data;
                if (!sandboxId)
                    return;
                const context = this.sandboxes.get(sandboxId);
                if (!context) {
                    return;
                }
                // Create respond() function for bidirectional communication
                const respond = (response) => {
                    context.iframe?.contentWindow?.postMessage({
                        type: "runtime-response",
                        messageId,
                        sandboxId,
                        ...response,
                    }, "*");
                };
                // 1. Try provider handlers first (for bidirectional comm)
                for (const provider of context.providers) {
                    if (provider.handleMessage) {
                        await provider.handleMessage(e.data, respond);
                        // Don't stop - let consumers also handle the message
                    }
                }
                // 2. Broadcast to consumers (one-way messages or lifecycle events)
                for (const consumer of context.consumers) {
                    await consumer.handleMessage(e.data);
                    // Don't stop - let all consumers see the message
                }
            };
            window.addEventListener("message", this.messageListener);
        }
        // Setup user script message listener
        if (!this.userScriptMessageListener) {
            // Guard: check if we're in extension context
            if (typeof chrome === "undefined" || !chrome.runtime?.onUserScriptMessage) {
                return;
            }
            this.userScriptMessageListener = (message, _sender, sendResponse) => {
                const { sandboxId } = message;
                if (!sandboxId)
                    return false;
                const context = this.sandboxes.get(sandboxId);
                if (!context)
                    return false;
                const respond = (response) => {
                    sendResponse({
                        ...response,
                        sandboxId,
                    });
                };
                // Route to providers (async)
                (async () => {
                    // 1. Try provider handlers first (for bidirectional comm)
                    for (const provider of context.providers) {
                        if (provider.handleMessage) {
                            await provider.handleMessage(message, respond);
                            // Don't stop - let consumers also handle the message
                        }
                    }
                    // 2. Broadcast to consumers (one-way messages or lifecycle events)
                    for (const consumer of context.consumers) {
                        await consumer.handleMessage(message);
                        // Don't stop - let all consumers see the message
                    }
                })();
                return true; // Indicates async response
            };
            chrome.runtime.onUserScriptMessage.addListener(this.userScriptMessageListener);
        }
    }
}
/**
 * Global singleton instance.
 * Import this from wherever you need to interact with the message router.
 */
export const RUNTIME_MESSAGE_ROUTER = new RuntimeMessageRouter();
//# sourceMappingURL=RuntimeMessageRouter.js.map