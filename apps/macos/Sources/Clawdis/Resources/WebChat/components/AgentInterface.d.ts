import { LitElement } from "lit";
import "./MessageEditor.js";
import "./MessageList.js";
import "./Messages.js";
import type { Agent } from "../agent/agent.js";
import "./StreamingMessageContainer.js";
import type { Attachment } from "../utils/attachment-utils.js";
export declare class AgentInterface extends LitElement {
    session?: Agent;
    enableAttachments: boolean;
    enableModelSelector: boolean;
    enableThinkingSelector: boolean;
    showThemeToggle: boolean;
    onApiKeyRequired?: (provider: string) => Promise<boolean>;
    onBeforeSend?: () => void | Promise<void>;
    onBeforeToolCall?: (toolName: string, args: any) => boolean | Promise<boolean>;
    onCostClick?: () => void;
    private _messageEditor;
    private _streamingContainer;
    private _autoScroll;
    private _lastScrollTop;
    private _lastClientHeight;
    private _scrollContainer?;
    private _resizeObserver?;
    private _unsubscribeSession?;
    setInput(text: string, attachments?: Attachment[]): void;
    setAutoScroll(enabled: boolean): void;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    willUpdate(changedProperties: Map<string, any>): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    private setupSessionSubscription;
    private _handleScroll;
    sendMessage(input: string, attachments?: Attachment[]): Promise<void>;
    private renderMessages;
    private renderStats;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=AgentInterface.d.ts.map