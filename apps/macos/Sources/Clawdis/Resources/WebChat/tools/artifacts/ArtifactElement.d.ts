import { LitElement, type TemplateResult } from "lit";
export declare abstract class ArtifactElement extends LitElement {
    filename: string;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    abstract get content(): string;
    abstract set content(value: string);
    abstract getHeaderButtons(): TemplateResult | HTMLElement;
}
//# sourceMappingURL=ArtifactElement.d.ts.map