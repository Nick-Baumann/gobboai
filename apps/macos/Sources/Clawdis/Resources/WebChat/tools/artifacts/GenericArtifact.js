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
let GenericArtifact = class GenericArtifact extends ArtifactElement {
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
    getMimeType() {
        const ext = this.filename.split(".").pop()?.toLowerCase();
        // Add common MIME types
        const mimeTypes = {
            pdf: "application/pdf",
            zip: "application/zip",
            tar: "application/x-tar",
            gz: "application/gzip",
            rar: "application/vnd.rar",
            "7z": "application/x-7z-compressed",
            mp3: "audio/mpeg",
            mp4: "video/mp4",
            avi: "video/x-msvideo",
            mov: "video/quicktime",
            wav: "audio/wav",
            ogg: "audio/ogg",
            json: "application/json",
            xml: "application/xml",
            bin: "application/octet-stream",
        };
        return mimeTypes[ext || ""] || "application/octet-stream";
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
			<div class="h-full flex items-center justify-center bg-background p-8">
				<div class="text-center max-w-md">
					<div class="text-muted-foreground text-lg mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 mx-auto mb-4 text-muted-foreground/50"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						<div class="font-medium text-foreground mb-2">${this.filename}</div>
						<p class="text-sm">
							${i18n("Preview not available for this file type.")} ${i18n("Click the download button above to view it on your computer.")}
						</p>
					</div>
				</div>
			</div>
		`;
    }
};
__decorate([
    property({ type: String })
], GenericArtifact.prototype, "_content", void 0);
GenericArtifact = __decorate([
    customElement("generic-artifact")
], GenericArtifact);
export { GenericArtifact };
//# sourceMappingURL=GenericArtifact.js.map