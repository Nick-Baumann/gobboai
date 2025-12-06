import "@mariozechner/mini-lit/dist/MarkdownBlock.js";
import { type AgentTool, type Message } from "@mariozechner/pi-ai";
import { type Static } from "@sinclair/typebox";
import { LitElement, type TemplateResult } from "lit";
import type { Agent } from "../../agent/agent.js";
export interface Artifact {
    filename: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const artifactsParamsSchema: import("@sinclair/typebox").TObject<{
    command: import("@sinclair/typebox").TUnsafe<string>;
    filename: import("@sinclair/typebox").TString;
    content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    old_str: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    new_str: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type ArtifactsParams = Static<typeof artifactsParamsSchema>;
export declare class ArtifactsPanel extends LitElement {
    private _artifacts;
    private _activeFilename;
    private artifactElements;
    private contentRef;
    agent?: Agent;
    sandboxUrlProvider?: () => string;
    onArtifactsChange?: () => void;
    onClose?: () => void;
    onOpen?: () => void;
    collapsed: boolean;
    overlay: boolean;
    get artifacts(): Map<string, Artifact>;
    private getHtmlArtifactRuntimeProviders;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private getFileType;
    private getOrCreateArtifactElement;
    private showArtifact;
    openArtifact(filename: string): void;
    get tool(): AgentTool<typeof artifactsParamsSchema, undefined>;
    reconstructFromMessages(messages: Array<Message | {
        role: "aborted";
    } | {
        role: "artifact";
    }>): Promise<void>;
    private executeCommand;
    private waitForHtmlExecution;
    private reloadAllHtmlArtifacts;
    private createArtifact;
    private updateArtifact;
    private rewriteArtifact;
    private getArtifact;
    private deleteArtifact;
    private getLogs;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "artifacts-panel": ArtifactsPanel;
    }
}
export {};
//# sourceMappingURL=artifacts.d.ts.map