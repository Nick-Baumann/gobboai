var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { i18n } from "@mariozechner/mini-lit";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
let CustomProviderCard = class CustomProviderCard extends LitElement {
    constructor() {
        super(...arguments);
        this.isAutoDiscovery = false;
    }
    createRenderRoot() {
        return this;
    }
    renderStatus() {
        if (!this.isAutoDiscovery) {
            return html `
				<div class="text-xs text-muted-foreground mt-1">
					${i18n("Models")}: ${this.provider.models?.length || 0}
				</div>
			`;
        }
        if (!this.status)
            return html ``;
        const statusIcon = this.status.status === "connected"
            ? html `<span class="text-green-500">●</span>`
            : this.status.status === "checking"
                ? html `<span class="text-yellow-500">●</span>`
                : html `<span class="text-red-500">●</span>`;
        const statusText = this.status.status === "connected"
            ? `${this.status.modelCount} ${i18n("models")}`
            : this.status.status === "checking"
                ? i18n("Checking...")
                : i18n("Disconnected");
        return html `
			<div class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
				${statusIcon} ${statusText}
			</div>
		`;
    }
    render() {
        return html `
			<div class="border border-border rounded-lg p-4 space-y-2">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<div class="font-medium text-sm text-foreground">${this.provider.name}</div>
						<div class="text-xs text-muted-foreground mt-1">
							<span class="capitalize">${this.provider.type}</span>
							${this.provider.baseUrl ? html ` • ${this.provider.baseUrl}` : ""}
						</div>
						${this.renderStatus()}
					</div>
					<div class="flex gap-2">
						${this.isAutoDiscovery && this.onRefresh
            ? Button({
                onClick: () => this.onRefresh?.(this.provider),
                variant: "ghost",
                size: "sm",
                children: i18n("Refresh"),
            })
            : ""}
						${this.onEdit
            ? Button({
                onClick: () => this.onEdit?.(this.provider),
                variant: "ghost",
                size: "sm",
                children: i18n("Edit"),
            })
            : ""}
						${this.onDelete
            ? Button({
                onClick: () => this.onDelete?.(this.provider),
                variant: "ghost",
                size: "sm",
                children: i18n("Delete"),
            })
            : ""}
					</div>
				</div>
			</div>
		`;
    }
};
__decorate([
    property({ type: Object })
], CustomProviderCard.prototype, "provider", void 0);
__decorate([
    property({ type: Boolean })
], CustomProviderCard.prototype, "isAutoDiscovery", void 0);
__decorate([
    property({ type: Object })
], CustomProviderCard.prototype, "status", void 0);
__decorate([
    property()
], CustomProviderCard.prototype, "onRefresh", void 0);
__decorate([
    property()
], CustomProviderCard.prototype, "onEdit", void 0);
__decorate([
    property()
], CustomProviderCard.prototype, "onDelete", void 0);
CustomProviderCard = __decorate([
    customElement("custom-provider-card")
], CustomProviderCard);
export { CustomProviderCard };
//# sourceMappingURL=CustomProviderCard.js.map