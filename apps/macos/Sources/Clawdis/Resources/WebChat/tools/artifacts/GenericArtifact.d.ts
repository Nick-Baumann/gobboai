import { type TemplateResult } from "lit";
import { ArtifactElement } from "./ArtifactElement.js";
export declare class GenericArtifact extends ArtifactElement {
    private _content;
    get content(): string;
    set content(value: string);
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private decodeBase64;
    private getMimeType;
    getHeaderButtons(): TemplateResult<1>;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "generic-artifact": GenericArtifact;
    }
}
//# sourceMappingURL=GenericArtifact.d.ts.map