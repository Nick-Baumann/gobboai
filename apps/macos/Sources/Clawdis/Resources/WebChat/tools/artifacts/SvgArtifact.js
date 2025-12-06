var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CopyButton } from "@mariozechner/mini-lit/dist/CopyButton.js";
import { DownloadButton } from "@mariozechner/mini-lit/dist/DownloadButton.js";
import { PreviewCodeToggle } from "@mariozechner/mini-lit/dist/PreviewCodeToggle.js";
import hljs from "highlight.js";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { i18n } from "../../utils/i18n.js";
import { ArtifactElement } from "./ArtifactElement.js";
let SvgArtifact = class SvgArtifact extends ArtifactElement {
    constructor() {
        super(...arguments);
        this.filename = "";
        this._content = "";
        this.viewMode = "preview";
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
        this.requestUpdate();
    }
    createRenderRoot() {
        return this; // light DOM
    }
    setViewMode(mode) {
        this.viewMode = mode;
    }
    getHeaderButtons() {
        const toggle = new PreviewCodeToggle();
        toggle.mode = this.viewMode;
        toggle.addEventListener("mode-change", (e) => {
            this.setViewMode(e.detail);
        });
        const copyButton = new CopyButton();
        copyButton.text = this._content;
        copyButton.title = i18n("Copy SVG");
        copyButton.showText = false;
        return html `
			<div class="flex items-center gap-2">
				${toggle}
				${copyButton}
				${DownloadButton({ content: this._content, filename: this.filename, mimeType: "image/svg+xml", title: i18n("Download SVG") })}
			</div>
		`;
    }
    render() {
        return html `
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${this.viewMode === "preview"
            ? html `<div class="h-full flex items-center justify-center">
								${unsafeHTML(this.content.replace(/<svg(\s|>)/i, (_m, p1) => `<svg class="w-full h-full"${p1}`))}
							</div>`
            : html `<pre class="m-0 p-4 text-xs"><code class="hljs language-xml">${unsafeHTML(hljs.highlight(this.content, { language: "xml", ignoreIllegals: true }).value)}</code></pre>`}
				</div>
			</div>
		`;
    }
};
__decorate([
    property()
], SvgArtifact.prototype, "filename", void 0);
__decorate([
    state()
], SvgArtifact.prototype, "viewMode", void 0);
SvgArtifact = __decorate([
    customElement("svg-artifact")
], SvgArtifact);
export { SvgArtifact };
//# sourceMappingURL=SvgArtifact.js.map