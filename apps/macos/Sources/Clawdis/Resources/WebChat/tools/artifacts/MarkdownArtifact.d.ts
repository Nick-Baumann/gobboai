import "@mariozechner/mini-lit/dist/MarkdownBlock.js";
import { ArtifactElement } from "./ArtifactElement.js";
export declare class MarkdownArtifact extends ArtifactElement {
    filename: string;
    private _content;
    get content(): string;
    set content(value: string);
    private viewMode;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    private setViewMode;
    getHeaderButtons(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "markdown-artifact": MarkdownArtifact;
    }
}
//# sourceMappingURL=MarkdownArtifact.d.ts.map