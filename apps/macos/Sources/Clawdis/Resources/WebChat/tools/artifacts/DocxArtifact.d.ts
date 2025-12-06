import { type TemplateResult } from "lit";
import { ArtifactElement } from "./ArtifactElement.js";
export declare class DocxArtifact extends ArtifactElement {
    private _content;
    private error;
    get content(): string;
    set content(value: string);
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private base64ToArrayBuffer;
    private decodeBase64;
    getHeaderButtons(): TemplateResult<1>;
    updated(changedProperties: Map<string, any>): Promise<void>;
    private renderDocx;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "docx-artifact": DocxArtifact;
    }
}
//# sourceMappingURL=DocxArtifact.d.ts.map