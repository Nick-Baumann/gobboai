var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from "@mariozechner/mini-lit";
import "@mariozechner/mini-lit/dist/MarkdownBlock.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { StringEnum } from "@mariozechner/pi-ai";
import { Type } from "@sinclair/typebox";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { X } from "lucide";
import { ArtifactsRuntimeProvider } from "../../components/sandbox/ArtifactsRuntimeProvider.js";
import { AttachmentsRuntimeProvider } from "../../components/sandbox/AttachmentsRuntimeProvider.js";
import { ARTIFACTS_RUNTIME_PROVIDER_DESCRIPTION_RO, ARTIFACTS_TOOL_DESCRIPTION, ATTACHMENTS_RUNTIME_DESCRIPTION, } from "../../prompts/prompts.js";
import { i18n } from "../../utils/i18n.js";
import { DocxArtifact } from "./DocxArtifact.js";
import { ExcelArtifact } from "./ExcelArtifact.js";
import { GenericArtifact } from "./GenericArtifact.js";
import { HtmlArtifact } from "./HtmlArtifact.js";
import { ImageArtifact } from "./ImageArtifact.js";
import { MarkdownArtifact } from "./MarkdownArtifact.js";
import { PdfArtifact } from "./PdfArtifact.js";
import { SvgArtifact } from "./SvgArtifact.js";
import { TextArtifact } from "./TextArtifact.js";
// JSON-schema friendly parameters object (LLM-facing)
const artifactsParamsSchema = Type.Object({
    command: StringEnum(["create", "update", "rewrite", "get", "delete", "logs"], {
        description: "The operation to perform",
    }),
    filename: Type.String({ description: "Filename including extension (e.g., 'index.html', 'script.js')" }),
    content: Type.Optional(Type.String({ description: "File content" })),
    old_str: Type.Optional(Type.String({ description: "String to replace (for update command)" })),
    new_str: Type.Optional(Type.String({ description: "Replacement string (for update command)" })),
});
let ArtifactsPanel = class ArtifactsPanel extends LitElement {
    constructor() {
        super(...arguments);
        this._artifacts = new Map();
        this._activeFilename = null;
        // Programmatically managed artifact elements
        this.artifactElements = new Map();
        this.contentRef = createRef();
        // Collapsed mode: hides panel content but can show a floating reopen pill
        this.collapsed = false;
        // Overlay mode: when true, panel renders full-screen overlay (mobile)
        this.overlay = false;
    }
    // Public getter for artifacts
    get artifacts() {
        return this._artifacts;
    }
    // Get runtime providers for HTML artifacts (read-only: attachments + artifacts)
    getHtmlArtifactRuntimeProviders() {
        const providers = [];
        // Get attachments from agent messages
        if (this.agent) {
            const attachments = [];
            for (const message of this.agent.state.messages) {
                if (message.role === "user" && message.attachments) {
                    attachments.push(...message.attachments);
                }
            }
            if (attachments.length > 0) {
                providers.push(new AttachmentsRuntimeProvider(attachments));
            }
        }
        // Add read-only artifacts provider
        providers.push(new ArtifactsRuntimeProvider(this, this.agent, false));
        return providers;
    }
    createRenderRoot() {
        return this; // light DOM for shared styles
    }
    connectedCallback() {
        super.connectedCallback();
        this.style.display = "block";
        this.style.height = "100%";
        // Reattach existing artifact elements when panel is re-inserted into the DOM
        requestAnimationFrame(() => {
            const container = this.contentRef.value;
            if (!container)
                return;
            // Ensure we have an active filename
            if (!this._activeFilename && this._artifacts.size > 0) {
                this._activeFilename = Array.from(this._artifacts.keys())[0];
            }
            this.artifactElements.forEach((element, name) => {
                if (!element.parentElement)
                    container.appendChild(element);
                element.style.display = name === this._activeFilename ? "block" : "none";
            });
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // Do not tear down artifact elements; keep them to restore on next mount
    }
    // Helper to determine file type from extension
    getFileType(filename) {
        const ext = filename.split(".").pop()?.toLowerCase();
        if (ext === "html")
            return "html";
        if (ext === "svg")
            return "svg";
        if (ext === "md" || ext === "markdown")
            return "markdown";
        if (ext === "pdf")
            return "pdf";
        if (ext === "xlsx" || ext === "xls")
            return "excel";
        if (ext === "docx")
            return "docx";
        if (ext === "png" ||
            ext === "jpg" ||
            ext === "jpeg" ||
            ext === "gif" ||
            ext === "webp" ||
            ext === "bmp" ||
            ext === "ico")
            return "image";
        // Text files
        if (ext === "txt" ||
            ext === "json" ||
            ext === "xml" ||
            ext === "yaml" ||
            ext === "yml" ||
            ext === "csv" ||
            ext === "js" ||
            ext === "ts" ||
            ext === "jsx" ||
            ext === "tsx" ||
            ext === "py" ||
            ext === "java" ||
            ext === "c" ||
            ext === "cpp" ||
            ext === "h" ||
            ext === "css" ||
            ext === "scss" ||
            ext === "sass" ||
            ext === "less" ||
            ext === "sh")
            return "text";
        // Everything else gets generic fallback
        return "generic";
    }
    // Get or create artifact element
    getOrCreateArtifactElement(filename, content) {
        let element = this.artifactElements.get(filename);
        if (!element) {
            const type = this.getFileType(filename);
            if (type === "html") {
                element = new HtmlArtifact();
                element.runtimeProviders = this.getHtmlArtifactRuntimeProviders();
                if (this.sandboxUrlProvider) {
                    element.sandboxUrlProvider = this.sandboxUrlProvider;
                }
            }
            else if (type === "svg") {
                element = new SvgArtifact();
            }
            else if (type === "markdown") {
                element = new MarkdownArtifact();
            }
            else if (type === "image") {
                element = new ImageArtifact();
            }
            else if (type === "pdf") {
                element = new PdfArtifact();
            }
            else if (type === "excel") {
                element = new ExcelArtifact();
            }
            else if (type === "docx") {
                element = new DocxArtifact();
            }
            else if (type === "text") {
                element = new TextArtifact();
            }
            else {
                element = new GenericArtifact();
            }
            element.filename = filename;
            element.content = content;
            element.style.display = "none";
            element.style.height = "100%";
            // Store element
            this.artifactElements.set(filename, element);
            // Add to DOM - try immediately if container exists, otherwise schedule
            const newElement = element;
            if (this.contentRef.value) {
                this.contentRef.value.appendChild(newElement);
            }
            else {
                requestAnimationFrame(() => {
                    if (this.contentRef.value && !newElement.parentElement) {
                        this.contentRef.value.appendChild(newElement);
                    }
                });
            }
        }
        else {
            // Just update content
            element.content = content;
            if (element instanceof HtmlArtifact) {
                element.runtimeProviders = this.getHtmlArtifactRuntimeProviders();
            }
        }
        return element;
    }
    // Show/hide artifact elements
    showArtifact(filename) {
        // Ensure the active element is in the DOM
        requestAnimationFrame(() => {
            this.artifactElements.forEach((element, name) => {
                if (this.contentRef.value && !element.parentElement) {
                    this.contentRef.value.appendChild(element);
                }
                element.style.display = name === filename ? "block" : "none";
            });
        });
        this._activeFilename = filename;
        this.requestUpdate(); // Only for tab bar update
        // Scroll the active tab into view after render
        requestAnimationFrame(() => {
            const activeButton = this.querySelector(`button[data-filename="${filename}"]`);
            if (activeButton) {
                activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        });
    }
    // Open panel and focus an artifact tab by filename
    openArtifact(filename) {
        if (this._artifacts.has(filename)) {
            this.showArtifact(filename);
            // Ask host to open panel (AgentInterface demo listens to onOpen)
            this.onOpen?.();
        }
    }
    // Build the AgentTool (no details payload; return only output strings)
    get tool() {
        return {
            label: "Artifacts",
            name: "artifacts",
            get description() {
                // HTML artifacts have read-only access to attachments and artifacts
                const runtimeProviderDescriptions = [
                    ATTACHMENTS_RUNTIME_DESCRIPTION,
                    ARTIFACTS_RUNTIME_PROVIDER_DESCRIPTION_RO,
                ];
                return ARTIFACTS_TOOL_DESCRIPTION(runtimeProviderDescriptions);
            },
            parameters: artifactsParamsSchema,
            // Execute mutates our local store and returns a plain output
            execute: async (_toolCallId, args, _signal) => {
                const output = await this.executeCommand(args);
                return { content: [{ type: "text", text: output }], details: undefined };
            },
        };
    }
    // Re-apply artifacts by scanning a message list (optional utility)
    async reconstructFromMessages(messages) {
        const toolCalls = new Map();
        const artifactToolName = "artifacts";
        // 1) Collect tool calls from assistant messages
        for (const message of messages) {
            if (message.role === "assistant") {
                for (const block of message.content) {
                    if (block.type === "toolCall" && block.name === artifactToolName) {
                        toolCalls.set(block.id, block);
                    }
                }
            }
        }
        // 2) Build an ordered list of successful artifact operations
        const operations = [];
        for (const m of messages) {
            if (m.role === "artifact") {
                const artifactMsg = m;
                switch (artifactMsg.action) {
                    case "create":
                        operations.push({
                            command: "create",
                            filename: artifactMsg.filename,
                            content: artifactMsg.content,
                        });
                        break;
                    case "update":
                        operations.push({
                            command: "rewrite",
                            filename: artifactMsg.filename,
                            content: artifactMsg.content,
                        });
                        break;
                    case "delete":
                        operations.push({
                            command: "delete",
                            filename: artifactMsg.filename,
                        });
                        break;
                }
            }
            // Handle tool result messages (from artifacts tool calls)
            else if (m.role === "toolResult" && m.toolName === artifactToolName && !m.isError) {
                const toolCallId = m.toolCallId;
                const call = toolCalls.get(toolCallId);
                if (!call)
                    continue;
                const params = call.arguments;
                if (params.command === "get" || params.command === "logs")
                    continue; // no state change
                operations.push(params);
            }
        }
        // 3) Compute final state per filename by simulating operations in-memory
        const finalArtifacts = new Map();
        for (const op of operations) {
            const filename = op.filename;
            switch (op.command) {
                case "create": {
                    if (op.content) {
                        finalArtifacts.set(filename, op.content);
                    }
                    break;
                }
                case "rewrite": {
                    if (op.content) {
                        finalArtifacts.set(filename, op.content);
                    }
                    break;
                }
                case "update": {
                    let existing = finalArtifacts.get(filename);
                    if (!existing)
                        break; // skip invalid update (shouldn't happen for successful results)
                    if (op.old_str !== undefined && op.new_str !== undefined) {
                        existing = existing.replace(op.old_str, op.new_str);
                        finalArtifacts.set(filename, existing);
                    }
                    break;
                }
                case "delete": {
                    finalArtifacts.delete(filename);
                    break;
                }
                case "get":
                case "logs":
                    // Ignored above, just for completeness
                    break;
            }
        }
        // 4) Reset current UI state before bulk create
        this._artifacts.clear();
        this.artifactElements.forEach((el) => {
            el.remove();
        });
        this.artifactElements.clear();
        this._activeFilename = null;
        this._artifacts = new Map(this._artifacts);
        // 5) Create artifacts in a single pass without waiting for iframe execution or tab switching
        for (const [filename, content] of finalArtifacts.entries()) {
            const createParams = { command: "create", filename, content };
            try {
                await this.createArtifact(createParams, { skipWait: true, silent: true });
            }
            catch {
                // Ignore failures during reconstruction
            }
        }
        // 6) Show first artifact if any exist, and notify listeners once
        if (!this._activeFilename && this._artifacts.size > 0) {
            this.showArtifact(Array.from(this._artifacts.keys())[0]);
        }
        this.onArtifactsChange?.();
        this.requestUpdate();
    }
    // Core command executor
    async executeCommand(params, options = {}) {
        switch (params.command) {
            case "create":
                return await this.createArtifact(params, options);
            case "update":
                return await this.updateArtifact(params, options);
            case "rewrite":
                return await this.rewriteArtifact(params, options);
            case "get":
                return this.getArtifact(params);
            case "delete":
                return this.deleteArtifact(params);
            case "logs":
                return this.getLogs(params);
            default:
                // Should never happen with TypeBox validation
                return `Error: Unknown command ${params.command}`;
        }
    }
    // Wait for HTML artifact execution and get logs
    async waitForHtmlExecution(filename) {
        const element = this.artifactElements.get(filename);
        if (!(element instanceof HtmlArtifact)) {
            return "";
        }
        return new Promise((resolve) => {
            // Fallback timeout - just get logs after execution should complete
            setTimeout(() => {
                // Get whatever logs we have
                const logs = element.getLogs();
                resolve(logs);
            }, 1500);
        });
    }
    // Reload all HTML artifacts (called when any artifact changes)
    reloadAllHtmlArtifacts() {
        this.artifactElements.forEach((element) => {
            if (element instanceof HtmlArtifact && element.sandboxIframeRef.value) {
                // Update runtime providers with latest artifact state
                element.runtimeProviders = this.getHtmlArtifactRuntimeProviders();
                // Re-execute the HTML content
                element.executeContent(element.content);
            }
        });
    }
    async createArtifact(params, options = {}) {
        if (!params.filename || !params.content) {
            return "Error: create command requires filename and content";
        }
        if (this._artifacts.has(params.filename)) {
            return `Error: File ${params.filename} already exists`;
        }
        const artifact = {
            filename: params.filename,
            content: params.content,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this._artifacts.set(params.filename, artifact);
        this._artifacts = new Map(this._artifacts);
        // Create or update element
        this.getOrCreateArtifactElement(params.filename, params.content);
        if (!options.silent) {
            this.showArtifact(params.filename);
            this.onArtifactsChange?.();
            this.requestUpdate();
        }
        // Reload all HTML artifacts since they might depend on this new artifact
        this.reloadAllHtmlArtifacts();
        // For HTML files, wait for execution
        let result = `Created file ${params.filename}`;
        if (this.getFileType(params.filename) === "html" && !options.skipWait) {
            const logs = await this.waitForHtmlExecution(params.filename);
            result += `\n${logs}`;
        }
        return result;
    }
    async updateArtifact(params, options = {}) {
        const artifact = this._artifacts.get(params.filename);
        if (!artifact) {
            const files = Array.from(this._artifacts.keys());
            if (files.length === 0)
                return `Error: File ${params.filename} not found. No files have been created yet.`;
            return `Error: File ${params.filename} not found. Available files: ${files.join(", ")}`;
        }
        if (!params.old_str || params.new_str === undefined) {
            return "Error: update command requires old_str and new_str";
        }
        if (!artifact.content.includes(params.old_str)) {
            return `Error: String not found in file. Here is the full content:\n\n${artifact.content}`;
        }
        artifact.content = artifact.content.replace(params.old_str, params.new_str);
        artifact.updatedAt = new Date();
        this._artifacts.set(params.filename, artifact);
        // Update element
        this.getOrCreateArtifactElement(params.filename, artifact.content);
        if (!options.silent) {
            this.onArtifactsChange?.();
            this.requestUpdate();
        }
        // Show the artifact
        this.showArtifact(params.filename);
        // Reload all HTML artifacts since they might depend on this updated artifact
        this.reloadAllHtmlArtifacts();
        // For HTML files, wait for execution
        let result = `Updated file ${params.filename}`;
        if (this.getFileType(params.filename) === "html" && !options.skipWait) {
            const logs = await this.waitForHtmlExecution(params.filename);
            result += `\n${logs}`;
        }
        return result;
    }
    async rewriteArtifact(params, options = {}) {
        const artifact = this._artifacts.get(params.filename);
        if (!artifact) {
            const files = Array.from(this._artifacts.keys());
            if (files.length === 0)
                return `Error: File ${params.filename} not found. No files have been created yet.`;
            return `Error: File ${params.filename} not found. Available files: ${files.join(", ")}`;
        }
        if (!params.content) {
            return "Error: rewrite command requires content";
        }
        artifact.content = params.content;
        artifact.updatedAt = new Date();
        this._artifacts.set(params.filename, artifact);
        // Update element
        this.getOrCreateArtifactElement(params.filename, artifact.content);
        if (!options.silent) {
            this.onArtifactsChange?.();
        }
        // Show the artifact
        this.showArtifact(params.filename);
        // Reload all HTML artifacts since they might depend on this rewritten artifact
        this.reloadAllHtmlArtifacts();
        // For HTML files, wait for execution
        let result = "";
        if (this.getFileType(params.filename) === "html" && !options.skipWait) {
            const logs = await this.waitForHtmlExecution(params.filename);
            result += `\n${logs}`;
        }
        return result;
    }
    getArtifact(params) {
        const artifact = this._artifacts.get(params.filename);
        if (!artifact) {
            const files = Array.from(this._artifacts.keys());
            if (files.length === 0)
                return `Error: File ${params.filename} not found. No files have been created yet.`;
            return `Error: File ${params.filename} not found. Available files: ${files.join(", ")}`;
        }
        return artifact.content;
    }
    deleteArtifact(params) {
        const artifact = this._artifacts.get(params.filename);
        if (!artifact) {
            const files = Array.from(this._artifacts.keys());
            if (files.length === 0)
                return `Error: File ${params.filename} not found. No files have been created yet.`;
            return `Error: File ${params.filename} not found. Available files: ${files.join(", ")}`;
        }
        this._artifacts.delete(params.filename);
        this._artifacts = new Map(this._artifacts);
        // Remove element
        const element = this.artifactElements.get(params.filename);
        if (element) {
            element.remove();
            this.artifactElements.delete(params.filename);
        }
        // Show another artifact if this was active
        if (this._activeFilename === params.filename) {
            const remaining = Array.from(this._artifacts.keys());
            if (remaining.length > 0) {
                this.showArtifact(remaining[0]);
            }
            else {
                this._activeFilename = null;
                this.requestUpdate();
            }
        }
        this.onArtifactsChange?.();
        this.requestUpdate();
        // Reload all HTML artifacts since they might have depended on this deleted artifact
        this.reloadAllHtmlArtifacts();
        return `Deleted file ${params.filename}`;
    }
    getLogs(params) {
        const element = this.artifactElements.get(params.filename);
        if (!element) {
            const files = Array.from(this._artifacts.keys());
            if (files.length === 0)
                return `Error: File ${params.filename} not found. No files have been created yet.`;
            return `Error: File ${params.filename} not found. Available files: ${files.join(", ")}`;
        }
        if (!(element instanceof HtmlArtifact)) {
            return `Error: File ${params.filename} is not an HTML file. Logs are only available for HTML files.`;
        }
        return element.getLogs();
    }
    render() {
        const artifacts = Array.from(this._artifacts.values());
        // Panel is hidden when collapsed OR when there are no artifacts
        const showPanel = artifacts.length > 0 && !this.collapsed;
        return html `
			<div
				class="${showPanel ? "" : "hidden"} ${this.overlay ? "fixed inset-0 z-40 pointer-events-auto backdrop-blur-sm bg-background/95" : "relative"} h-full flex flex-col bg-background text-card-foreground ${!this.overlay ? "border-l border-border" : ""} overflow-hidden shadow-xl"
			>
				<!-- Tab bar (always shown when there are artifacts) -->
				<div class="flex items-center justify-between border-b border-border bg-background">
					<div class="flex overflow-x-auto">
						${artifacts.map((a) => {
            const isActive = a.filename === this._activeFilename;
            const activeClass = isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground";
            return html `
								<button
									class="px-3 py-2 whitespace-nowrap border-b-2 ${activeClass}"
									data-filename="${a.filename}"
									@click=${() => this.showArtifact(a.filename)}
								>
									<span class="font-mono text-xs">${a.filename}</span>
								</button>
							`;
        })}
					</div>
					<div class="flex items-center gap-1 px-2">
						${(() => {
            const active = this._activeFilename ? this.artifactElements.get(this._activeFilename) : undefined;
            return active ? active.getHeaderButtons() : "";
        })()}
						${Button({
            variant: "ghost",
            size: "sm",
            onClick: () => this.onClose?.(),
            title: i18n("Close artifacts"),
            children: icon(X, "sm"),
        })}
					</div>
				</div>

				<!-- Content area where artifact elements are added programmatically -->
				<div class="flex-1 overflow-hidden" ${ref(this.contentRef)}></div>
			</div>
		`;
    }
};
__decorate([
    state()
], ArtifactsPanel.prototype, "_artifacts", void 0);
__decorate([
    state()
], ArtifactsPanel.prototype, "_activeFilename", void 0);
__decorate([
    property({ attribute: false })
], ArtifactsPanel.prototype, "agent", void 0);
__decorate([
    property({ attribute: false })
], ArtifactsPanel.prototype, "sandboxUrlProvider", void 0);
__decorate([
    property({ attribute: false })
], ArtifactsPanel.prototype, "onArtifactsChange", void 0);
__decorate([
    property({ attribute: false })
], ArtifactsPanel.prototype, "onClose", void 0);
__decorate([
    property({ attribute: false })
], ArtifactsPanel.prototype, "onOpen", void 0);
__decorate([
    property({ type: Boolean })
], ArtifactsPanel.prototype, "collapsed", void 0);
__decorate([
    property({ type: Boolean })
], ArtifactsPanel.prototype, "overlay", void 0);
ArtifactsPanel = __decorate([
    customElement("artifacts-panel")
], ArtifactsPanel);
export { ArtifactsPanel };
//# sourceMappingURL=artifacts.js.map