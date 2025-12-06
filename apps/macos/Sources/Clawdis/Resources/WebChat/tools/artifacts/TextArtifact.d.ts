import { ArtifactElement } from "./ArtifactElement.js";
export declare class TextArtifact extends ArtifactElement {
    filename: string;
    private _content;
    get content(): string;
    set content(value: string);
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    private isCode;
    private getLanguageFromExtension;
    private getMimeType;
    getHeaderButtons(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "text-artifact": TextArtifact;
    }
}
//# sourceMappingURL=TextArtifact.d.ts.map