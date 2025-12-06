var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from "@mariozechner/mini-lit";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ChevronDown, ChevronRight } from "lucide";
/**
 * Reusable expandable section component for tool renderers.
 * Captures children in connectedCallback and re-renders them in the details area.
 */
let ExpandableSection = class ExpandableSection extends LitElement {
    constructor() {
        super(...arguments);
        this.defaultExpanded = false;
        this.expanded = false;
        this.capturedChildren = [];
    }
    createRenderRoot() {
        return this; // light DOM
    }
    connectedCallback() {
        super.connectedCallback();
        // Capture children before first render
        this.capturedChildren = Array.from(this.childNodes);
        // Clear children (we'll re-insert them in render)
        this.innerHTML = "";
        this.expanded = this.defaultExpanded;
    }
    render() {
        return html `
			<div>
				<button
					@click=${() => {
            this.expanded = !this.expanded;
        }}
					class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
				>
					${icon(this.expanded ? ChevronDown : ChevronRight, "sm")}
					<span>${this.summary}</span>
				</button>
				${this.expanded ? html `<div class="mt-2">${this.capturedChildren}</div>` : ""}
			</div>
		`;
    }
};
__decorate([
    property()
], ExpandableSection.prototype, "summary", void 0);
__decorate([
    property({ type: Boolean })
], ExpandableSection.prototype, "defaultExpanded", void 0);
__decorate([
    state()
], ExpandableSection.prototype, "expanded", void 0);
ExpandableSection = __decorate([
    customElement("expandable-section")
], ExpandableSection);
export { ExpandableSection };
//# sourceMappingURL=ExpandableSection.js.map