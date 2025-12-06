import "@mariozechner/mini-lit/dist/CopyButton.js";
import { LitElement, type TemplateResult } from "lit";
interface LogEntry {
    type: "log" | "error";
    text: string;
}
export declare class Console extends LitElement {
    logs: LogEntry[];
    private expanded;
    private autoscroll;
    private logsContainerRef;
    protected createRenderRoot(): this;
    updated(): void;
    private getLogsText;
    render(): TemplateResult;
}
export {};
//# sourceMappingURL=Console.d.ts.map