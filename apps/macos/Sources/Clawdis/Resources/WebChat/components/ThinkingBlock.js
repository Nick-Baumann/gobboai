var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from "@mariozechner/mini-lit";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ChevronRight } from "lucide";
let ThinkingBlock = class ThinkingBlock extends LitElement {
    constructor() {
        super(...arguments);
        this.isStreaming = false;
        this.isExpanded = false;
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.style.display = "block";
    }
    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
    }
    render() {
        const shimmerClasses = this.isStreaming
            ? "animate-shimmer bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent"
            : "";
        return html `
			<div class="thinking-block">
				<div
					class="thinking-header cursor-pointer select-none flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
					@click=${this.toggleExpanded}
				>
					<span class="transition-transform inline-block ${this.isExpanded ? "rotate-90" : ""}">${icon(ChevronRight, "sm")}</span>
					<span class="${shimmerClasses}">Thinking...</span>
				</div>
				${this.isExpanded ? html `<markdown-block .content=${this.content} .isThinking=${true}></markdown-block>` : ""}
			</div>
		`;
    }
};
__decorate([
    property()
], ThinkingBlock.prototype, "content", void 0);
__decorate([
    property({ type: Boolean })
], ThinkingBlock.prototype, "isStreaming", void 0);
__decorate([
    state()
], ThinkingBlock.prototype, "isExpanded", void 0);
ThinkingBlock = __decorate([
    customElement("thinking-block")
], ThinkingBlock);
export { ThinkingBlock };
//# sourceMappingURL=ThinkingBlock.js.map