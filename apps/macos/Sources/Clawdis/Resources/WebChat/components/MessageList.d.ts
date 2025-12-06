import type { AgentTool } from "@mariozechner/pi-ai";
import { LitElement, type TemplateResult } from "lit";
import type { AppMessage } from "./Messages.js";
export declare class MessageList extends LitElement {
    messages: AppMessage[];
    tools: AgentTool[];
    pendingToolCalls?: Set<string>;
    isStreaming: boolean;
    onCostClick?: () => void;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private buildRenderItems;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=MessageList.d.ts.map