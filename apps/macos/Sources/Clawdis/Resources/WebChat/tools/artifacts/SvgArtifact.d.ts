import { ArtifactElement } from "./ArtifactElement.js";
export declare class SvgArtifact extends ArtifactElement {
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
        "svg-artifact": SvgArtifact;
    }
}
//# sourceMappingURL=SvgArtifact.d.ts.map