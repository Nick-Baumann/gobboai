import type { SandboxRuntimeProvider } from "./SandboxRuntimeProvider.js";
interface ArtifactsPanelLike {
    artifacts: Map<string, {
        content: string;
    }>;
    tool: {
        execute(toolCallId: string, args: {
            command: string;
            filename: string;
            content?: string;
        }): Promise<any>;
    };
}
interface AgentLike {
    appendMessage(message: any): void;
}
/**
 * Artifacts Runtime Provider
 *
 * Provides programmatic access to session artifacts from sandboxed code.
 * Allows code to create, read, update, and delete artifacts dynamically.
 * Supports both online (extension) and offline (downloaded HTML) modes.
 */
export declare class ArtifactsRuntimeProvider implements SandboxRuntimeProvider {
    private artifactsPanel;
    private agent?;
    private readWrite;
    constructor(artifactsPanel: ArtifactsPanelLike, agent?: AgentLike | undefined, readWrite?: boolean);
    getData(): Record<string, any>;
    getRuntime(): (sandboxId: string) => void;
    handleMessage(message: any, respond: (response: any) => void): Promise<void>;
    getDescription(): string;
}
export {};
//# sourceMappingURL=ArtifactsRuntimeProvider.d.ts.map