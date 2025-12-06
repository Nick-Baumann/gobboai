var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit/html.js";
import { FileSpreadsheet, FileText, X } from "lucide";
import { AttachmentOverlay } from "../dialogs/AttachmentOverlay.js";
import { i18n } from "../utils/i18n.js";
let AttachmentTile = class AttachmentTile extends LitElement {
    constructor() {
        super(...arguments);
        this.showDelete = false;
        this.handleClick = () => {
            AttachmentOverlay.open(this.attachment);
        };
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.style.display = "block";
        this.classList.add("max-h-16");
    }
    render() {
        const hasPreview = !!this.attachment.preview;
        const isImage = this.attachment.type === "image";
        const isPdf = this.attachment.mimeType === "application/pdf";
        const isDocx = this.attachment.mimeType?.includes("wordprocessingml") ||
            this.attachment.fileName.toLowerCase().endsWith(".docx");
        const isPptx = this.attachment.mimeType?.includes("presentationml") ||
            this.attachment.fileName.toLowerCase().endsWith(".pptx");
        const isExcel = this.attachment.mimeType?.includes("spreadsheetml") ||
            this.attachment.fileName.toLowerCase().endsWith(".xlsx") ||
            this.attachment.fileName.toLowerCase().endsWith(".xls");
        // Choose the appropriate icon
        const getDocumentIcon = () => {
            if (isExcel)
                return icon(FileSpreadsheet, "md");
            return icon(FileText, "md");
        };
        return html `
			<div class="relative group inline-block">
				${hasPreview
            ? html `
							<div class="relative">
								<img
									src="data:${isImage ? this.attachment.mimeType : "image/png"};base64,${this.attachment.preview}"
									class="w-16 h-16 object-cover rounded-lg border border-input cursor-pointer hover:opacity-80 transition-opacity"
									alt="${this.attachment.fileName}"
									title="${this.attachment.fileName}"
									@click=${this.handleClick}
								/>
								${isPdf
                ? html `
											<!-- PDF badge overlay -->
											<div class="absolute bottom-0 left-0 right-0 bg-background/90 px-1 py-0.5 rounded-b-lg">
												<div class="text-[10px] text-muted-foreground text-center font-medium">${i18n("PDF")}</div>
											</div>
										`
                : ""}
							</div>
						`
            : html `
							<!-- Fallback: document icon + filename -->
							<div
								class="w-16 h-16 rounded-lg border border-input cursor-pointer hover:opacity-80 transition-opacity bg-muted text-muted-foreground flex flex-col items-center justify-center p-2"
								@click=${this.handleClick}
								title="${this.attachment.fileName}"
							>
								${getDocumentIcon()}
								<div class="text-[10px] text-center truncate w-full">
									${this.attachment.fileName.length > 10
                ? this.attachment.fileName.substring(0, 8) + "..."
                : this.attachment.fileName}
								</div>
							</div>
						`}
				${this.showDelete
            ? html `
							<button
								@click=${(e) => {
                e.stopPropagation();
                this.onDelete?.();
            }}
								class="absolute -top-1 -right-1 w-5 h-5 bg-background hover:bg-muted text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center opacity-100 hover:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity border border-input shadow-sm"
								title="${i18n("Remove")}"
							>
								${icon(X, "xs")}
							</button>
						`
            : ""}
			</div>
		`;
    }
};
__decorate([
    property({ type: Object })
], AttachmentTile.prototype, "attachment", void 0);
__decorate([
    property({ type: Boolean })
], AttachmentTile.prototype, "showDelete", void 0);
__decorate([
    property()
], AttachmentTile.prototype, "onDelete", void 0);
AttachmentTile = __decorate([
    customElement("attachment-tile")
], AttachmentTile);
export { AttachmentTile };
//# sourceMappingURL=AttachmentTile.js.map