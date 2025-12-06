import type { SandboxRuntimeProvider } from "./SandboxRuntimeProvider.js";
/**
 * Message consumer interface - components that want to receive messages from sandboxes
 */
export interface MessageConsumer {
    /**
     * Handle a message from a sandbox.
     * All consumers receive all messages - decide internally what to handle.
     */
    handleMessage(message: any): Promise<void>;
}
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
export declare class RuntimeMessageRouter {
    private sandboxes;
    private messageListener;
    private userScriptMessageListener;
    /**
     * Register a new sandbox with its runtime providers.
     * Call this BEFORE creating the iframe (for sandbox contexts) or executing user script.
     */
    registerSandbox(sandboxId: string, providers: SandboxRuntimeProvider[], consumers: MessageConsumer[]): void;
    /**
     * Update the iframe reference for a sandbox.
     * Call this AFTER creating the iframe.
     * This is needed so providers can send responses back to the sandbox.
     */
    setSandboxIframe(sandboxId: string, iframe: HTMLIFrameElement): void;
    /**
     * Unregister a sandbox and remove all its consumers.
     * Call this when the sandbox is destroyed.
     */
    unregisterSandbox(sandboxId: string): void;
    /**
     * Add a message consumer for a sandbox.
     * Consumers receive broadcast messages (console, execution-complete, etc.)
     */
    addConsumer(sandboxId: string, consumer: MessageConsumer): void;
    /**
     * Remove a message consumer from a sandbox.
     */
    removeConsumer(sandboxId: string, consumer: MessageConsumer): void;
    /**
     * Setup the global message listeners (called automatically)
     */
    private setupListener;
}
/**
 * Global singleton instance.
 * Import this from wherever you need to interact with the message router.
 */
export declare const RUNTIME_MESSAGE_ROUTER: RuntimeMessageRouter;
//# sourceMappingURL=RuntimeMessageRouter.d.ts.map