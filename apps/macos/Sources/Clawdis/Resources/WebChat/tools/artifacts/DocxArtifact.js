var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DownloadButton } from "@mariozechner/mini-lit/dist/DownloadButton.js";
import { renderAsync } from "docx-preview";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { i18n } from "../../utils/i18n.js";
import { ArtifactElement } from "./ArtifactElement.js";
let DocxArtifact = class DocxArtifact extends ArtifactElement {
    constructor() {
        super(...arguments);
        this._content = "";
        this.error = null;
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
        this.error = null;
        this.requestUpdate();
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.style.display = "block";
        this.style.height = "100%";
    }
    base64ToArrayBuffer(base64) {
        // Remove data URL prefix if present
        let base64Data = base64;
        if (base64.startsWith("data:")) {
            const base64Match = base64.match(/base64,(.+)/);
            if (base64Match) {
                base64Data = base64Match[1];
            }
        }
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    decodeBase64() {
        let base64Data = this._content;
        if (this._content.startsWith("data:")) {
            const base64Match = this._content.match(/base64,(.+)/);
            if (base64Match) {
                base64Data = base64Match[1];
            }
        }
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    getHeaderButtons() {
        return html `
			<div class="flex items-center gap-1">
				${DownloadButton({
            content: this.decodeBase64(),
            filename: this.filename,
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            title: i18n("Download"),
        })}
			</div>
		`;
    }
    async updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("_content") && this._content && !this.error) {
            await this.renderDocx();
        }
    }
    async renderDocx() {
        const container = this.querySelector("#docx-container");
        if (!container || !this._content)
            return;
        try {
            const arrayBuffer = this.base64ToArrayBuffer(this._content);
            // Clear container first
            container.innerHTML = "";
            // Create a wrapper div for the document
            const wrapper = document.createElement("div");
            wrapper.className = "docx-wrapper-custom";
            container.appendChild(wrapper);
            // Render the DOCX file into the wrapper
            await renderAsync(arrayBuffer, wrapper, undefined, {
                className: "docx",
                inWrapper: true,
                ignoreWidth: true,
                ignoreHeight: false,
                ignoreFonts: false,
                breakPages: true,
                ignoreLastRenderedPageBreak: true,
                experimental: false,
                trimXmlDeclaration: true,
                useBase64URL: false,
                renderHeaders: true,
                renderFooters: true,
                renderFootnotes: true,
                renderEndnotes: true,
            });
            // Apply custom styles to match theme and fix sizing
            const style = document.createElement("style");
            style.textContent = `
				#docx-container {
					padding: 0;
				}

				#docx-container .docx-wrapper-custom {
					max-width: 100%;
					overflow-x: auto;
				}

				#docx-container .docx-wrapper {
					max-width: 100% !important;
					margin: 0 !important;
					background: transparent !important;
					padding: 0em !important;
				}

				#docx-container .docx-wrapper > section.docx {
					box-shadow: none !important;
					border: none !important;
					border-radius: 0 !important;
					margin: 0 !important;
					padding: 2em !important;
					background: white !important;
					color: black !important;
					max-width: 100% !important;
					width: 100% !important;
					min-width: 0 !important;
					overflow-x: auto !important;
				}

				/* Fix tables and wide content */
				#docx-container table {
					max-width: 100% !important;
					width: auto !important;
					overflow-x: auto !important;
					display: block !important;
				}

				#docx-container img {
					max-width: 100% !important;
					height: auto !important;
				}

				/* Fix paragraphs and text */
				#docx-container p,
				#docx-container span,
				#docx-container div {
					max-width: 100% !important;
					word-wrap: break-word !important;
					overflow-wrap: break-word !important;
				}

				/* Hide page breaks in web view */
				#docx-container .docx-page-break {
					display: none !important;
				}
			`;
            container.appendChild(style);
        }
        catch (error) {
            console.error("Error rendering DOCX:", error);
            this.error = error?.message || i18n("Failed to load document");
        }
    }
    render() {
        if (this.error) {
            return html `
				<div class="h-full flex items-center justify-center bg-background p-4">
					<div class="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg max-w-2xl">
						<div class="font-medium mb-1">${i18n("Error loading document")}</div>
						<div class="text-sm opacity-90">${this.error}</div>
					</div>
				</div>
			`;
        }
        return html `
			<div class="h-full flex flex-col bg-background overflow-auto">
				<div id="docx-container" class="flex-1 overflow-auto"></div>
			</div>
		`;
    }
};
__decorate([
    property({ type: String })
], DocxArtifact.prototype, "_content", void 0);
__decorate([
    state()
], DocxArtifact.prototype, "error", void 0);
DocxArtifact = __decorate([
    customElement("docx-artifact")
], DocxArtifact);
export { DocxArtifact };
//# sourceMappingURL=DocxArtifact.js.map