import type { TemplateResult } from "lit";
import type { AppMessage } from "./Messages.js";
export type MessageRole = AppMessage["role"];
export interface MessageRenderer<TMessage extends AppMessage = AppMessage> {
    render(message: TMessage): TemplateResult;
}
export declare function registerMessageRenderer<TRole extends MessageRole>(role: TRole, renderer: MessageRenderer<Extract<AppMessage, {
    role: TRole;
}>>): void;
export declare function getMessageRenderer(role: MessageRole): MessageRenderer | undefined;
export declare function renderMessage(message: AppMessage): TemplateResult | undefined;
//# sourceMappingURL=message-renderer-registry.d.ts.map