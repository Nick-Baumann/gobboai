import type { AgentTool, AssistantMessage as AssistantMessageType, ToolCall, ToolResultMessage as ToolResultMessageType, UserMessage as UserMessageType } from "@mariozechner/pi-ai";
import { LitElement, type TemplateResult } from "lit";
import type { Attachment } from "../utils/attachment-utils.js";
import "./ThinkingBlock.js";
export type UserMessageWithAttachments = UserMessageType & {
    attachments?: Attachment[];
};
export interface ArtifactMessage {
    role: "artifact";
    action: "create" | "update" | "delete";
    filename: string;
    content?: string;
    title?: string;
    timestamp: string;
}
type BaseMessage = AssistantMessageType | UserMessageWithAttachments | ToolResultMessageType | ArtifactMessage;
export interface CustomMessages {
}
export type AppMessage = BaseMessage | CustomMessages[keyof CustomMessages];
export declare class UserMessage extends LitElement {
    message: UserMessageWithAttachments;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    render(): TemplateResult<1>;
}
export declare class AssistantMessage extends LitElement {
    message: AssistantMessageType;
    tools?: AgentTool<any>[];
    pendingToolCalls?: Set<string>;
    hideToolCalls: boolean;
    toolResultsById?: Map<string, ToolResultMessageType>;
    isStreaming: boolean;
    onCostClick?: () => void;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    render(): TemplateResult<1>;
}
export declare class ToolMessageDebugView extends LitElement {
    callArgs: any;
    result?: ToolResultMessageType;
    hasResult: boolean;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private pretty;
    render(): TemplateResult<1>;
}
export declare class ToolMessage extends LitElement {
    toolCall: ToolCall;
    tool?: AgentTool<any>;
    result?: ToolResultMessageType;
    pending: boolean;
    aborted: boolean;
    isStreaming: boolean;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    render(): TemplateResult;
}
export declare class AbortedMessage extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    protected render(): unknown;
}
export {};
//# sourceMappingURL=Messages.d.ts.map