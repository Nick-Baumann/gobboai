import { type TemplateResult } from "lit";
import { ArtifactElement } from "./ArtifactElement.js";
export declare class ExcelArtifact extends ArtifactElement {
    private _content;
    private error;
    get content(): string;
    set content(value: string);
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private base64ToArrayBuffer;
    private decodeBase64;
    private getMimeType;
    getHeaderButtons(): TemplateResult<1>;
    updated(changedProperties: Map<string, any>): Promise<void>;
    private renderExcel;
    private renderExcelSheet;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "excel-artifact": ExcelArtifact;
    }
}
//# sourceMappingURL=ExcelArtifact.d.ts.map