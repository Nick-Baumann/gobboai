var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { i18n } from "@mariozechner/mini-lit";
import { Select } from "@mariozechner/mini-lit/dist/Select.js";
import { getProviders } from "@mariozechner/pi-ai";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import "../components/CustomProviderCard.js";
import "../components/ProviderKeyInput.js";
import { getAppStorage } from "../storage/app-storage.js";
import { discoverModels } from "../utils/model-discovery.js";
import { CustomProviderDialog } from "./CustomProviderDialog.js";
import { SettingsTab } from "./SettingsDialog.js";
let ProvidersModelsTab = class ProvidersModelsTab extends SettingsTab {
    constructor() {
        super(...arguments);
        this.customProviders = [];
        this.providerStatus = new Map();
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.loadCustomProviders();
    }
    async loadCustomProviders() {
        try {
            const storage = getAppStorage();
            this.customProviders = await storage.customProviders.getAll();
            // Check status for auto-discovery providers
            for (const provider of this.customProviders) {
                const isAutoDiscovery = provider.type === "ollama" ||
                    provider.type === "llama.cpp" ||
                    provider.type === "vllm" ||
                    provider.type === "lmstudio";
                if (isAutoDiscovery) {
                    this.checkProviderStatus(provider);
                }
            }
        }
        catch (error) {
            console.error("Failed to load custom providers:", error);
        }
    }
    getTabName() {
        return "Providers & Models";
    }
    async checkProviderStatus(provider) {
        this.providerStatus.set(provider.id, { modelCount: 0, status: "checking" });
        this.requestUpdate();
        try {
            const models = await discoverModels(provider.type, provider.baseUrl, provider.apiKey);
            this.providerStatus.set(provider.id, { modelCount: models.length, status: "connected" });
        }
        catch (error) {
            this.providerStatus.set(provider.id, { modelCount: 0, status: "disconnected" });
        }
        this.requestUpdate();
    }
    renderKnownProviders() {
        const providers = getProviders();
        return html `
			<div class="flex flex-col gap-6">
				<div>
					<h3 class="text-sm font-semibold text-foreground mb-2">Cloud Providers</h3>
					<p class="text-sm text-muted-foreground mb-4">
						Cloud LLM providers with predefined models. API keys are stored locally in your browser.
					</p>
				</div>
				<div class="flex flex-col gap-6">
					${providers.map((provider) => html ` <provider-key-input .provider=${provider}></provider-key-input> `)}
				</div>
			</div>
		`;
    }
    renderCustomProviders() {
        const isAutoDiscovery = (type) => type === "ollama" || type === "llama.cpp" || type === "vllm" || type === "lmstudio";
        return html `
			<div class="flex flex-col gap-6">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-semibold text-foreground mb-2">Custom Providers</h3>
						<p class="text-sm text-muted-foreground">
							User-configured servers with auto-discovered or manually defined models.
						</p>
					</div>
					${Select({
            placeholder: i18n("Add Provider"),
            options: [
                { value: "ollama", label: "Ollama" },
                { value: "llama.cpp", label: "llama.cpp" },
                { value: "vllm", label: "vLLM" },
                { value: "lmstudio", label: "LM Studio" },
                { value: "openai-completions", label: i18n("OpenAI Completions Compatible") },
                { value: "openai-responses", label: i18n("OpenAI Responses Compatible") },
                { value: "anthropic-messages", label: i18n("Anthropic Messages Compatible") },
            ],
            onChange: (value) => this.addCustomProvider(value),
            variant: "outline",
            size: "sm",
        })}
				</div>

				${this.customProviders.length === 0
            ? html `
							<div class="text-sm text-muted-foreground text-center py-8">
								No custom providers configured. Click 'Add Provider' to get started.
							</div>
						`
            : html `
							<div class="flex flex-col gap-4">
								${this.customProviders.map((provider) => html `
										<custom-provider-card
											.provider=${provider}
											.isAutoDiscovery=${isAutoDiscovery(provider.type)}
											.status=${this.providerStatus.get(provider.id)}
											.onRefresh=${(p) => this.refreshProvider(p)}
											.onEdit=${(p) => this.editProvider(p)}
											.onDelete=${(p) => this.deleteProvider(p)}
										></custom-provider-card>
									`)}
							</div>
						`}
			</div>
		`;
    }
    async addCustomProvider(type) {
        await CustomProviderDialog.open(undefined, type, async () => {
            await this.loadCustomProviders();
            this.requestUpdate();
        });
    }
    async editProvider(provider) {
        await CustomProviderDialog.open(provider, undefined, async () => {
            await this.loadCustomProviders();
            this.requestUpdate();
        });
    }
    async refreshProvider(provider) {
        this.providerStatus.set(provider.id, { modelCount: 0, status: "checking" });
        this.requestUpdate();
        try {
            const models = await discoverModels(provider.type, provider.baseUrl, provider.apiKey);
            this.providerStatus.set(provider.id, { modelCount: models.length, status: "connected" });
            this.requestUpdate();
            console.log(`Refreshed ${models.length} models from ${provider.name}`);
        }
        catch (error) {
            this.providerStatus.set(provider.id, { modelCount: 0, status: "disconnected" });
            this.requestUpdate();
            console.error(`Failed to refresh provider ${provider.name}:`, error);
            alert(`Failed to refresh provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async deleteProvider(provider) {
        if (!confirm("Are you sure you want to delete this provider?")) {
            return;
        }
        try {
            const storage = getAppStorage();
            await storage.customProviders.delete(provider.id);
            await this.loadCustomProviders();
            this.requestUpdate();
        }
        catch (error) {
            console.error("Failed to delete provider:", error);
        }
    }
    render() {
        return html `
			<div class="flex flex-col gap-8">
				${this.renderKnownProviders()}
				<div class="border-t border-border"></div>
				${this.renderCustomProviders()}
			</div>
		`;
    }
};
__decorate([
    state()
], ProvidersModelsTab.prototype, "customProviders", void 0);
__decorate([
    state()
], ProvidersModelsTab.prototype, "providerStatus", void 0);
ProvidersModelsTab = __decorate([
    customElement("providers-models-tab")
], ProvidersModelsTab);
export { ProvidersModelsTab };
//# sourceMappingURL=ProvidersModelsTab.js.map