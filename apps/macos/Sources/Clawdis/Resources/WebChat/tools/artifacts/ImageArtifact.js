var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DownloadButton } from "@mariozechner/mini-lit/dist/DownloadButton.js";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { i18n } from "../../utils/i18n.js";
import { ArtifactElement } from "./ArtifactElement.js";
let ImageArtifact = class ImageArtifact extends ArtifactElement {
    constructor() {
        super(...arguments);
        this._content = "";
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
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
    getMimeType() {
        const ext = this.filename.split(".").pop()?.toLowerCase();
        if (ext === "jpg" || ext === "jpeg")
            return "image/jpeg";
        if (ext === "gif")
            return "image/gif";
        if (ext === "webp")
            return "image/webp";
        if (ext === "svg")
            return "image/svg+xml";
        if (ext === "bmp")
            return "image/bmp";
        if (ext === "ico")
            return "image/x-icon";
        return "image/png";
    }
    getImageUrl() {
        // If content is already a data URL, use it directly
        if (this._content.startsWith("data:")) {
            return this._content;
        }
        // Otherwise assume it's base64 and construct data URL
        return `data:${this.getMimeType()};base64,${this._content}`;
    }
    decodeBase64() {
        let base64Data;
        // If content is a data URL, extract the base64 part
        if (this._content.startsWith("data:")) {
            const base64Match = this._content.match(/base64,(.+)/);
            if (base64Match) {
                base64Data = base64Match[1];
            }
            else {
                // Not a base64 data URL, return empty
                return new Uint8Array(0);
            }
        }
        else {
            // Otherwise use content as-is
            base64Data = this._content;
        }
        // Decode base64 to binary string
        const binaryString = atob(base64Data);
        // Convert binary string to Uint8Array
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
            mimeType: this.getMimeType(),
            title: i18n("Download"),
        })}
			</div>
		`;
    }
    render() {
        return html `
			<div class="h-full flex flex-col bg-background overflow-auto">
				<div class="flex-1 flex items-center justify-center p-4">
					<img
						src="${this.getImageUrl()}"
						alt="${this.filename}"
						class="max-w-full max-h-full object-contain"
						@error=${(e) => {
            const target = e.target;
            target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E";
        }}
					/>
				</div>
			</div>
		`;
    }
};
__decorate([
    property({ type: String })
], ImageArtifact.prototype, "_content", void 0);
ImageArtifact = __decorate([
    customElement("image-artifact")
], ImageArtifact);
export { ImageArtifact };
//# sourceMappingURL=ImageArtifact.js.map