var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CopyButton } from "@mariozechner/mini-lit/dist/CopyButton.js";
import { DownloadButton } from "@mariozechner/mini-lit/dist/DownloadButton.js";
import hljs from "highlight.js";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { i18n } from "../../utils/i18n.js";
import { ArtifactElement } from "./ArtifactElement.js";
// Known code file extensions for highlighting
const CODE_EXTENSIONS = [
    "js",
    "javascript",
    "ts",
    "typescript",
    "jsx",
    "tsx",
    "py",
    "python",
    "java",
    "c",
    "cpp",
    "cs",
    "php",
    "rb",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "scala",
    "dart",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    "json",
    "xml",
    "yaml",
    "yml",
    "toml",
    "sql",
    "sh",
    "bash",
    "ps1",
    "bat",
    "r",
    "matlab",
    "julia",
    "lua",
    "perl",
    "vue",
    "svelte",
];
let TextArtifact = class TextArtifact extends ArtifactElement {
    constructor() {
        super(...arguments);
        this.filename = "";
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
        return this; // light DOM
    }
    isCode() {
        const ext = this.filename.split(".").pop()?.toLowerCase() || "";
        return CODE_EXTENSIONS.includes(ext);
    }
    getLanguageFromExtension(ext) {
        const languageMap = {
            js: "javascript",
            ts: "typescript",
            py: "python",
            rb: "ruby",
            yml: "yaml",
            ps1: "powershell",
            bat: "batch",
        };
        return languageMap[ext] || ext;
    }
    getMimeType() {
        const ext = this.filename.split(".").pop()?.toLowerCase() || "";
        if (ext === "svg")
            return "image/svg+xml";
        if (ext === "md" || ext === "markdown")
            return "text/markdown";
        return "text/plain";
    }
    getHeaderButtons() {
        const copyButton = new CopyButton();
        copyButton.text = this.content;
        copyButton.title = i18n("Copy");
        copyButton.showText = false;
        return html `
			<div class="flex items-center gap-1">
				${copyButton}
				${DownloadButton({
            content: this.content,
            filename: this.filename,
            mimeType: this.getMimeType(),
            title: i18n("Download"),
        })}
			</div>
		`;
    }
    render() {
        const isCode = this.isCode();
        const ext = this.filename.split(".").pop() || "";
        return html `
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${isCode
            ? html `
								<pre class="m-0 p-4 text-xs"><code class="hljs language-${this.getLanguageFromExtension(ext.toLowerCase())}">${unsafeHTML(hljs.highlight(this.content, {
                language: this.getLanguageFromExtension(ext.toLowerCase()),
                ignoreIllegals: true,
            }).value)}</code></pre>
							`
            : html ` <pre class="m-0 p-4 text-xs font-mono">${this.content}</pre> `}
				</div>
			</div>
		`;
    }
};
__decorate([
    property()
], TextArtifact.prototype, "filename", void 0);
TextArtifact = __decorate([
    customElement("text-artifact")
], TextArtifact);
export { TextArtifact };
//# sourceMappingURL=TextArtifact.js.map