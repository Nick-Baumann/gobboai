var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from "@mariozechner/mini-lit";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { Select } from "@mariozechner/mini-lit/dist/Select.js";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { Brain, Loader2, Paperclip, Send, Sparkles, Square } from "lucide";
import { loadAttachment } from "../utils/attachment-utils.js";
import { i18n } from "../utils/i18n.js";
import "./AttachmentTile.js";
let MessageEditor = class MessageEditor extends LitElement {
    constructor() {
        super(...arguments);
        this._value = "";
        this.textareaRef = createRef();
        this.isStreaming = false;
        this.thinkingLevel = "off";
        this.showAttachmentButton = true;
        this.showModelSelector = true;
        this.showThinkingSelector = true;
        this.attachments = [];
        this.maxFiles = 10;
        this.maxFileSize = 20 * 1024 * 1024; // 20MB
        this.acceptedTypes = "image/*,application/pdf,.docx,.pptx,.xlsx,.xls,.txt,.md,.json,.xml,.html,.css,.js,.ts,.jsx,.tsx,.yml,.yaml";
        this.processingFiles = false;
        this.isDragging = false;
        this.fileInputRef = createRef();
        this.handleTextareaInput = (e) => {
            const textarea = e.target;
            this.value = textarea.value;
            this.onInput?.(this.value);
        };
        this.handleKeyDown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!this.isStreaming && !this.processingFiles && (this.value.trim() || this.attachments.length > 0)) {
                    this.handleSend();
                }
            }
            else if (e.key === "Escape" && this.isStreaming) {
                e.preventDefault();
                this.onAbort?.();
            }
        };
        this.handlePaste = async (e) => {
            const items = e.clipboardData?.items;
            if (!items)
                return;
            const imageFiles = [];
            // Check for image items in clipboard
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        imageFiles.push(file);
                    }
                }
            }
            // If we found images, process them
            if (imageFiles.length > 0) {
                e.preventDefault(); // Prevent default paste behavior
                if (imageFiles.length + this.attachments.length > this.maxFiles) {
                    alert(`Maximum ${this.maxFiles} files allowed`);
                    return;
                }
                this.processingFiles = true;
                const newAttachments = [];
                for (const file of imageFiles) {
                    try {
                        if (file.size > this.maxFileSize) {
                            alert(`Image exceeds maximum size of ${Math.round(this.maxFileSize / 1024 / 1024)}MB`);
                            continue;
                        }
                        const attachment = await loadAttachment(file);
                        newAttachments.push(attachment);
                    }
                    catch (error) {
                        console.error("Error processing pasted image:", error);
                        alert(`Failed to process pasted image: ${String(error)}`);
                    }
                }
                this.attachments = [...this.attachments, ...newAttachments];
                this.onFilesChange?.(this.attachments);
                this.processingFiles = false;
            }
        };
        this.handleSend = () => {
            this.onSend?.(this.value, this.attachments);
        };
        this.handleAttachmentClick = () => {
            this.fileInputRef.value?.click();
        };
        this.handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.isDragging) {
                this.isDragging = true;
            }
        };
        this.handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only set isDragging to false if we're leaving the entire component
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
                this.isDragging = false;
            }
        };
        this.handleDrop = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = false;
            const files = Array.from(e.dataTransfer?.files || []);
            if (files.length === 0)
                return;
            if (files.length + this.attachments.length > this.maxFiles) {
                alert(`Maximum ${this.maxFiles} files allowed`);
                return;
            }
            this.processingFiles = true;
            const newAttachments = [];
            for (const file of files) {
                try {
                    if (file.size > this.maxFileSize) {
                        alert(`${file.name} exceeds maximum size of ${Math.round(this.maxFileSize / 1024 / 1024)}MB`);
                        continue;
                    }
                    const attachment = await loadAttachment(file);
                    newAttachments.push(attachment);
                }
                catch (error) {
                    console.error(`Error processing ${file.name}:`, error);
                    alert(`Failed to process ${file.name}: ${String(error)}`);
                }
            }
            this.attachments = [...this.attachments, ...newAttachments];
            this.onFilesChange?.(this.attachments);
            this.processingFiles = false;
        };
    }
    get value() {
        return this._value;
    }
    set value(val) {
        const oldValue = this._value;
        this._value = val;
        this.requestUpdate("value", oldValue);
    }
    createRenderRoot() {
        return this;
    }
    async handleFilesSelected(e) {
        const input = e.target;
        const files = Array.from(input.files || []);
        if (files.length === 0)
            return;
        if (files.length + this.attachments.length > this.maxFiles) {
            alert(`Maximum ${this.maxFiles} files allowed`);
            input.value = "";
            return;
        }
        this.processingFiles = true;
        const newAttachments = [];
        for (const file of files) {
            try {
                if (file.size > this.maxFileSize) {
                    alert(`${file.name} exceeds maximum size of ${Math.round(this.maxFileSize / 1024 / 1024)}MB`);
                    continue;
                }
                const attachment = await loadAttachment(file);
                newAttachments.push(attachment);
            }
            catch (error) {
                console.error(`Error processing ${file.name}:`, error);
                alert(`Failed to process ${file.name}: ${String(error)}`);
            }
        }
        this.attachments = [...this.attachments, ...newAttachments];
        this.onFilesChange?.(this.attachments);
        this.processingFiles = false;
        input.value = ""; // Reset input
    }
    removeFile(fileId) {
        this.attachments = this.attachments.filter((f) => f.id !== fileId);
        this.onFilesChange?.(this.attachments);
    }
    firstUpdated() {
        const textarea = this.textareaRef.value;
        if (textarea) {
            textarea.focus();
        }
    }
    render() {
        // Check if current model supports thinking/reasoning
        const model = this.currentModel;
        const supportsThinking = model?.reasoning === true; // Models with reasoning:true support thinking
        return html `
			<div
				class="bg-card rounded-xl border shadow-sm relative ${this.isDragging ? "border-primary border-2 bg-primary/5" : "border-border"}"
				@dragover=${this.handleDragOver}
				@dragleave=${this.handleDragLeave}
				@drop=${this.handleDrop}
			>
				<!-- Drag overlay -->
				${this.isDragging
            ? html `
					<div class="absolute inset-0 bg-primary/10 rounded-xl pointer-events-none z-10 flex items-center justify-center">
						<div class="text-primary font-medium">${i18n("Drop files here")}</div>
					</div>
				`
            : ""}

				<!-- Attachments -->
				${this.attachments.length > 0
            ? html `
							<div class="px-4 pt-3 pb-2 flex flex-wrap gap-2">
								${this.attachments.map((attachment) => html `
										<attachment-tile
											.attachment=${attachment}
											.showDelete=${true}
											.onDelete=${() => this.removeFile(attachment.id)}
										></attachment-tile>
									`)}
							</div>
						`
            : ""}

				<textarea
					class="w-full bg-transparent p-4 text-foreground placeholder-muted-foreground outline-none resize-none overflow-y-auto"
					placeholder=${i18n("Type a message...")}
					rows="1"
					style="max-height: 200px; field-sizing: content; min-height: 1lh; height: auto;"
					.value=${this.value}
					@input=${this.handleTextareaInput}
					@keydown=${this.handleKeyDown}
					@paste=${this.handlePaste}
					${ref(this.textareaRef)}
				></textarea>

				<!-- Hidden file input -->
				<input
					type="file"
					${ref(this.fileInputRef)}
					@change=${this.handleFilesSelected}
					accept=${this.acceptedTypes}
					multiple
					style="display: none;"
				/>

				<!-- Button Row -->
				<div class="px-2 pb-2 flex items-center justify-between">
					<!-- Left side - attachment and thinking selector -->
					<div class="flex gap-2 items-center">
						${this.showAttachmentButton
            ? this.processingFiles
                ? html `
										<div class="h-8 w-8 flex items-center justify-center">
											${icon(Loader2, "sm", "animate-spin text-muted-foreground")}
										</div>
									`
                : html `
										${Button({
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    onClick: this.handleAttachmentClick,
                    children: icon(Paperclip, "sm"),
                })}
									`
            : ""}
						${supportsThinking && this.showThinkingSelector
            ? html `
									${Select({
                value: this.thinkingLevel,
                placeholder: i18n("Off"),
                options: [
                    { value: "off", label: i18n("Off"), icon: icon(Brain, "sm") },
                    { value: "minimal", label: i18n("Minimal"), icon: icon(Brain, "sm") },
                    { value: "low", label: i18n("Low"), icon: icon(Brain, "sm") },
                    { value: "medium", label: i18n("Medium"), icon: icon(Brain, "sm") },
                    { value: "high", label: i18n("High"), icon: icon(Brain, "sm") },
                ],
                onChange: (value) => {
                    this.onThinkingChange?.(value);
                },
                width: "80px",
                size: "sm",
                variant: "ghost",
                fitContent: true,
            })}
								`
            : ""}
					</div>

					<!-- Model selector and send on the right -->
					<div class="flex gap-2 items-center">
						${this.showModelSelector && this.currentModel
            ? html `
									${Button({
                variant: "ghost",
                size: "sm",
                onClick: () => {
                    // Focus textarea before opening model selector so focus returns there
                    this.textareaRef.value?.focus();
                    // Wait for next frame to ensure focus takes effect before dialog captures it
                    requestAnimationFrame(() => {
                        this.onModelSelect?.();
                    });
                },
                children: html `
											${icon(Sparkles, "sm")}
											<span class="ml-1">${this.currentModel.id}</span>
										`,
                className: "h-8 text-xs truncate",
            })}
								`
            : ""}
						${this.isStreaming
            ? html `
									${Button({
                variant: "ghost",
                size: "icon",
                onClick: this.onAbort,
                children: icon(Square, "sm"),
                className: "h-8 w-8",
            })}
								`
            : html `
									${Button({
                variant: "ghost",
                size: "icon",
                onClick: this.handleSend,
                disabled: (!this.value.trim() && this.attachments.length === 0) || this.processingFiles,
                children: html `<div style="transform: rotate(-45deg)">${icon(Send, "sm")}</div>`,
                className: "h-8 w-8",
            })}
								`}
					</div>
				</div>
			</div>
		`;
    }
};
__decorate([
    property()
], MessageEditor.prototype, "value", null);
__decorate([
    property()
], MessageEditor.prototype, "isStreaming", void 0);
__decorate([
    property()
], MessageEditor.prototype, "currentModel", void 0);
__decorate([
    property()
], MessageEditor.prototype, "thinkingLevel", void 0);
__decorate([
    property()
], MessageEditor.prototype, "showAttachmentButton", void 0);
__decorate([
    property()
], MessageEditor.prototype, "showModelSelector", void 0);
__decorate([
    property()
], MessageEditor.prototype, "showThinkingSelector", void 0);
__decorate([
    property()
], MessageEditor.prototype, "onInput", void 0);
__decorate([
    property()
], MessageEditor.prototype, "onSend", void 0);
__decorate([
    property()
], MessageEditor.prototype, "onAbort", void 0);
__decorate([
    property()
], MessageEditor.prototype, "onModelSelect", void 0);
__decorate([
    property()
], MessageEditor.prototype, "onThinkingChange", void 0);
__decorate([
    property()
], MessageEditor.prototype, "onFilesChange", void 0);
__decorate([
    property()
], MessageEditor.prototype, "attachments", void 0);
__decorate([
    property()
], MessageEditor.prototype, "maxFiles", void 0);
__decorate([
    property()
], MessageEditor.prototype, "maxFileSize", void 0);
__decorate([
    property()
], MessageEditor.prototype, "acceptedTypes", void 0);
__decorate([
    state()
], MessageEditor.prototype, "processingFiles", void 0);
__decorate([
    state()
], MessageEditor.prototype, "isDragging", void 0);
MessageEditor = __decorate([
    customElement("message-editor")
], MessageEditor);
export { MessageEditor };
//# sourceMappingURL=MessageEditor.js.map