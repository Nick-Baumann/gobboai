import "@mariozechner/mini-lit/dist/ModeToggle.js";
import { LitElement } from "lit";
import type { Attachment } from "../utils/attachment-utils.js";
export declare class AttachmentOverlay extends LitElement {
    private attachment?;
    private showExtractedText;
    private error;
    private currentLoadingTask;
    private onCloseCallback?;
    private boundHandleKeyDown?;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    static open(attachment: Attachment, onClose?: () => void): void;
    private setupEventListeners;
    private close;
    private getFileType;
    private getFileTypeLabel;
    private handleBackdropClick;
    private handleDownload;
    private cleanup;
    render(): import("lit-html").TemplateResult<1>;
    private renderToggle;
    private renderContent;
    private renderFileContent;
    updated(changedProperties: Map<string, any>): Promise<void>;
    private renderPdf;
    private renderDocx;
    private renderExcel;
    private renderExcelSheet;
    private base64ToArrayBuffer;
    private renderExtractedText;
}
//# sourceMappingURL=AttachmentOverlay.d.ts.map