var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import hljs from "highlight.js";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { i18n } from "../../utils/i18n.js";
import "@mariozechner/mini-lit/dist/MarkdownBlock.js";
import { CopyButton } from "@mariozechner/mini-lit/dist/CopyButton.js";
import { DownloadButton } from "@mariozechner/mini-lit/dist/DownloadButton.js";
import { PreviewCodeToggle } from "@mariozechner/mini-lit/dist/PreviewCodeToggle.js";
import { ArtifactElement } from "./ArtifactElement.js";
let MarkdownArtifact = class MarkdownArtifact extends ArtifactElement {
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
        copyButton.title = i18n("Copy Markdown");
        copyButton.showText = false;
        return html `
			<div class="flex items-center gap-2">
				${toggle}
				${copyButton}
				${DownloadButton({
            content: this._content,
            filename: this.filename,
            mimeType: "text/markdown",
            title: i18n("Download Markdown"),
        })}
			</div>
		`;
    }
    render() {
        return html `
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${this.viewMode === "preview"
            ? html `<div class="p-4"><markdown-block .content=${this.content}></markdown-block></div>`
            : html `<pre class="m-0 p-4 text-xs whitespace-pre-wrap break-words"><code class="hljs language-markdown">${unsafeHTML(hljs.highlight(this.content, { language: "markdown", ignoreIllegals: true }).value)}</code></pre>`}
				</div>
			</div>
		`;
    }
};
__decorate([
    property()
], MarkdownArtifact.prototype, "filename", void 0);
__decorate([
    state()
], MarkdownArtifact.prototype, "viewMode", void 0);
MarkdownArtifact = __decorate([
    customElement("markdown-artifact")
], MarkdownArtifact);
export { MarkdownArtifact };
//# sourceMappingURL=MarkdownArtifact.js.map