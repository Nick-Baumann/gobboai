import { LitElement } from "lit";
export declare class ConsoleBlock extends LitElement {
    content: string;
    variant: "default" | "error";
    private copied;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private copy;
    updated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ConsoleBlock.d.ts.map