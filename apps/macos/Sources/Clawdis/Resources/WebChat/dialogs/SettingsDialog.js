var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SettingsDialog_1;
import { i18n } from "@mariozechner/mini-lit";
import { Dialog, DialogContent, DialogHeader } from "@mariozechner/mini-lit/dist/Dialog.js";
import { Input } from "@mariozechner/mini-lit/dist/Input.js";
import { Label } from "@mariozechner/mini-lit/dist/Label.js";
import { Switch } from "@mariozechner/mini-lit/dist/Switch.js";
import { getProviders } from "@mariozechner/pi-ai";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../components/ProviderKeyInput.js";
import { getAppStorage } from "../storage/app-storage.js";
// Base class for settings tabs
export class SettingsTab extends LitElement {
    createRenderRoot() {
        return this;
    }
}
// API Keys Tab
let ApiKeysTab = class ApiKeysTab extends SettingsTab {
    getTabName() {
        return i18n("API Keys");
    }
    render() {
        const providers = getProviders();
        return html `
			<div class="flex flex-col gap-6">
				<p class="text-sm text-muted-foreground">
					${i18n("Configure API keys for LLM providers. Keys are stored locally in your browser.")}
				</p>
				${providers.map((provider) => html `<provider-key-input .provider=${provider}></provider-key-input>`)}
			</div>
		`;
    }
};
ApiKeysTab = __decorate([
    customElement("api-keys-tab")
], ApiKeysTab);
export { ApiKeysTab };
// Proxy Tab
let ProxyTab = class ProxyTab extends SettingsTab {
    constructor() {
        super(...arguments);
        this.proxyEnabled = false;
        this.proxyUrl = "http://localhost:3001";
    }
    async connectedCallback() {
        super.connectedCallback();
        // Load proxy settings when tab is connected
        try {
            const storage = getAppStorage();
            const enabled = await storage.settings.get("proxy.enabled");
            const url = await storage.settings.get("proxy.url");
            if (enabled !== null)
                this.proxyEnabled = enabled;
            if (url !== null)
                this.proxyUrl = url;
        }
        catch (error) {
            console.error("Failed to load proxy settings:", error);
        }
    }
    async saveProxySettings() {
        try {
            const storage = getAppStorage();
            await storage.settings.set("proxy.enabled", this.proxyEnabled);
            await storage.settings.set("proxy.url", this.proxyUrl);
        }
        catch (error) {
            console.error("Failed to save proxy settings:", error);
        }
    }
    getTabName() {
        return i18n("Proxy");
    }
    render() {
        return html `
			<div class="flex flex-col gap-4">
				<p class="text-sm text-muted-foreground">
					${i18n("Allows browser-based apps to bypass CORS restrictions when calling LLM providers. Required for Z-AI and Anthropic with OAuth token.")}
				</p>

				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-foreground">${i18n("Use CORS Proxy")}</span>
					${Switch({
            checked: this.proxyEnabled,
            onChange: (checked) => {
                this.proxyEnabled = checked;
                this.saveProxySettings();
            },
        })}
				</div>

				<div class="space-y-2">
					${Label({ children: i18n("Proxy URL") })}
					${Input({
            type: "text",
            value: this.proxyUrl,
            disabled: !this.proxyEnabled,
            onInput: (e) => {
                this.proxyUrl = e.target.value;
            },
            onChange: () => this.saveProxySettings(),
        })}
					<p class="text-xs text-muted-foreground">
						${i18n("Format: The proxy must accept requests as <proxy-url>/?url=<target-url>")}
					</p>
				</div>
			</div>
		`;
    }
};
__decorate([
    state()
], ProxyTab.prototype, "proxyEnabled", void 0);
__decorate([
    state()
], ProxyTab.prototype, "proxyUrl", void 0);
ProxyTab = __decorate([
    customElement("proxy-tab")
], ProxyTab);
export { ProxyTab };
let SettingsDialog = SettingsDialog_1 = class SettingsDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.tabs = [];
        this.isOpen = false;
        this.activeTabIndex = 0;
    }
    createRenderRoot() {
        return this;
    }
    static async open(tabs) {
        const dialog = new SettingsDialog_1();
        dialog.tabs = tabs;
        dialog.isOpen = true;
        document.body.appendChild(dialog);
    }
    setActiveTab(index) {
        this.activeTabIndex = index;
    }
    renderSidebarItem(tab, index) {
        const isActive = this.activeTabIndex === index;
        return html `
			<button
				class="w-full text-left px-4 py-3 rounded-md transition-colors ${isActive
            ? "bg-secondary text-foreground font-medium"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}"
				@click=${() => this.setActiveTab(index)}
			>
				${tab.getTabName()}
			</button>
		`;
    }
    renderMobileTab(tab, index) {
        const isActive = this.activeTabIndex === index;
        return html `
			<button
				class="px-3 py-2 text-sm font-medium transition-colors ${isActive ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}"
				@click=${() => this.setActiveTab(index)}
			>
				${tab.getTabName()}
			</button>
		`;
    }
    render() {
        if (this.tabs.length === 0) {
            return html ``;
        }
        return Dialog({
            isOpen: this.isOpen,
            onClose: () => {
                this.isOpen = false;
                this.remove();
            },
            width: "min(1000px, 90vw)",
            height: "min(800px, 90vh)",
            backdropClassName: "bg-black/50 backdrop-blur-sm",
            children: html `
				${DialogContent({
                className: "h-full p-6",
                children: html `
						<div class="flex flex-col h-full overflow-hidden">
							<!-- Header -->
							<div class="pb-4 flex-shrink-0">${DialogHeader({ title: i18n("Settings") })}</div>

							<!-- Mobile Tabs -->
							<div class="md:hidden flex flex-shrink-0 pb-4">
								${this.tabs.map((tab, index) => this.renderMobileTab(tab, index))}
							</div>

							<!-- Layout -->
							<div class="flex flex-1 overflow-hidden">
								<!-- Sidebar (desktop only) -->
								<div class="hidden md:block w-64 flex-shrink-0 space-y-1">
									${this.tabs.map((tab, index) => this.renderSidebarItem(tab, index))}
								</div>

								<!-- Content -->
								<div class="flex-1 overflow-y-auto md:pl-6">
									${this.tabs.map((tab, index) => html `<div style="display: ${this.activeTabIndex === index ? "block" : "none"}">${tab}</div>`)}
								</div>
							</div>
						</div>
					`,
            })}
			`,
        });
    }
};
__decorate([
    property({ type: Array, attribute: false })
], SettingsDialog.prototype, "tabs", void 0);
__decorate([
    state()
], SettingsDialog.prototype, "isOpen", void 0);
__decorate([
    state()
], SettingsDialog.prototype, "activeTabIndex", void 0);
SettingsDialog = SettingsDialog_1 = __decorate([
    customElement("settings-dialog")
], SettingsDialog);
export { SettingsDialog };
//# sourceMappingURL=SettingsDialog.js.map