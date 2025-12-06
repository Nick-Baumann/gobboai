/**
 * Generates sendRuntimeMessage() function for injection into execution contexts.
 * Provides unified messaging API that works in both sandbox iframe and user script contexts.
 */
export type MessageType = "request-response" | "fire-and-forget";
export interface RuntimeMessageBridgeOptions {
    context: "sandbox-iframe" | "user-script";
    sandboxId: string;
}
export declare class RuntimeMessageBridge {
    /**
     * Generate sendRuntimeMessage() function as injectable string.
     * Returns the function source code to be injected into target context.
     */
    static generateBridgeCode(options: RuntimeMessageBridgeOptions): string;
    private static generateSandboxBridge;
    private static generateUserScriptBridge;
}
//# sourceMappingURL=RuntimeMessageBridge.d.ts.map