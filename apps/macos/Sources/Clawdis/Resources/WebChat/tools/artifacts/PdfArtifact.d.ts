import { type TemplateResult } from "lit";
import { ArtifactElement } from "./ArtifactElement.js";
export declare class PdfArtifact extends ArtifactElement {
    private _content;
    private error;
    private currentLoadingTask;
    get content(): string;
    set content(value: string);
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private cleanup;
    private base64ToArrayBuffer;
    private decodeBase64;
    getHeaderButtons(): TemplateResult<1>;
    updated(changedProperties: Map<string, any>): Promise<void>;
    private renderPdf;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "pdf-artifact": PdfArtifact;
    }
}
//# sourceMappingURL=PdfArtifact.d.ts.map