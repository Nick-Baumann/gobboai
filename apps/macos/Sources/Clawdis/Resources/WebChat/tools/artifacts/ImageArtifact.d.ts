import { type TemplateResult } from "lit";
import { ArtifactElement } from "./ArtifactElement.js";
export declare class ImageArtifact extends ArtifactElement {
    private _content;
    get content(): string;
    set content(value: string);
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private getMimeType;
    private getImageUrl;
    private decodeBase64;
    getHeaderButtons(): TemplateResult<1>;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "image-artifact": ImageArtifact;
    }
}
//# sourceMappingURL=ImageArtifact.d.ts.map