var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { i18n } from "@mariozechner/mini-lit";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
import { Input } from "@mariozechner/mini-lit/dist/Input.js";
import { Label } from "@mariozechner/mini-lit/dist/Label.js";
import { Select } from "@mariozechner/mini-lit/dist/Select.js";
import { html } from "lit";
import { state } from "lit/decorators.js";
import { getAppStorage } from "../storage/app-storage.js";
import { discoverModels } from "../utils/model-discovery.js";
export class CustomProviderDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.name = "";
        this.type = "openai-completions";
        this.baseUrl = "";
        this.apiKey = "";
        this.testing = false;
        this.testError = "";
        this.discoveredModels = [];
        this.modalWidth = "min(800px, 90vw)";
        this.modalHeight = "min(700px, 90vh)";
    }
    static async open(provider, initialType, onSave) {
        const dialog = new CustomProviderDialog();
        dialog.provider = provider;
        dialog.initialType = initialType;
        dialog.onSaveCallback = onSave;
        document.body.appendChild(dialog);
        dialog.initializeFromProvider();
        dialog.open();
        dialog.requestUpdate();
    }
    initializeFromProvider() {
        if (this.provider) {
            this.name = this.provider.name;
            this.type = this.provider.type;
            this.baseUrl = this.provider.baseUrl;
            this.apiKey = this.provider.apiKey || "";
            this.discoveredModels = this.provider.models || [];
        }
        else {
            this.name = "";
            this.type = this.initialType || "openai-completions";
            this.baseUrl = "";
            this.updateDefaultBaseUrl();
            this.apiKey = "";
            this.discoveredModels = [];
        }
        this.testError = "";
        this.testing = false;
    }
    updateDefaultBaseUrl() {
        if (this.baseUrl)
            return;
        const defaults = {
            ollama: "http://localhost:11434",
            "llama.cpp": "http://localhost:8080",
            vllm: "http://localhost:8000",
            lmstudio: "http://localhost:1234",
            "openai-completions": "",
            "openai-responses": "",
            "anthropic-messages": "",
        };
        this.baseUrl = defaults[this.type] || "";
    }
    isAutoDiscoveryType() {
        return this.type === "ollama" || this.type === "llama.cpp" || this.type === "vllm" || this.type === "lmstudio";
    }
    async testConnection() {
        if (!this.isAutoDiscoveryType())
            return;
        this.testing = true;
        this.testError = "";
        this.discoveredModels = [];
        try {
            const models = await discoverModels(this.type, this.baseUrl, this.apiKey || undefined);
            this.discoveredModels = models.map((model) => ({
                ...model,
                provider: this.name || this.type,
            }));
            this.testError = "";
        }
        catch (error) {
            this.testError = error instanceof Error ? error.message : String(error);
            this.discoveredModels = [];
        }
        finally {
            this.testing = false;
            this.requestUpdate();
        }
    }
    async save() {
        if (!this.name || !this.baseUrl) {
            alert(i18n("Please fill in all required fields"));
            return;
        }
        try {
            const storage = getAppStorage();
            const provider = {
                id: this.provider?.id || crypto.randomUUID(),
                name: this.name,
                type: this.type,
                baseUrl: this.baseUrl,
                apiKey: this.apiKey || undefined,
                models: this.isAutoDiscoveryType() ? undefined : this.provider?.models || [],
            };
            await storage.customProviders.set(provider);
            if (this.onSaveCallback) {
                this.onSaveCallback();
            }
            this.close();
        }
        catch (error) {
            console.error("Failed to save provider:", error);
            alert(i18n("Failed to save provider"));
        }
    }
    renderContent() {
        const providerTypes = [
            { value: "ollama", label: "Ollama (auto-discovery)" },
            { value: "llama.cpp", label: "llama.cpp (auto-discovery)" },
            { value: "vllm", label: "vLLM (auto-discovery)" },
            { value: "lmstudio", label: "LM Studio (auto-discovery)" },
            { value: "openai-completions", label: "OpenAI Completions Compatible" },
            { value: "openai-responses", label: "OpenAI Responses Compatible" },
            { value: "anthropic-messages", label: "Anthropic Messages Compatible" },
        ];
        return html `
			<div class="flex flex-col h-full overflow-hidden">
				<div class="p-6 flex-shrink-0 border-b border-border">
					<h2 class="text-lg font-semibold text-foreground">
						${this.provider ? i18n("Edit Provider") : i18n("Add Provider")}
					</h2>
				</div>

				<div class="flex-1 overflow-y-auto p-6">
					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							${Label({ htmlFor: "provider-name", children: i18n("Provider Name") })}
							${Input({
            value: this.name,
            placeholder: i18n("e.g., My Ollama Server"),
            onInput: (e) => {
                this.name = e.target.value;
                this.requestUpdate();
            },
        })}
						</div>

						<div class="flex flex-col gap-2">
							${Label({ htmlFor: "provider-type", children: i18n("Provider Type") })}
							${Select({
            value: this.type,
            options: providerTypes.map((pt) => ({
                value: pt.value,
                label: pt.label,
            })),
            onChange: (value) => {
                this.type = value;
                this.baseUrl = "";
                this.updateDefaultBaseUrl();
                this.requestUpdate();
            },
            width: "100%",
        })}
						</div>

						<div class="flex flex-col gap-2">
							${Label({ htmlFor: "base-url", children: i18n("Base URL") })}
							${Input({
            value: this.baseUrl,
            placeholder: i18n("e.g., http://localhost:11434"),
            onInput: (e) => {
                this.baseUrl = e.target.value;
                this.requestUpdate();
            },
        })}
						</div>

						<div class="flex flex-col gap-2">
							${Label({ htmlFor: "api-key", children: i18n("API Key (Optional)") })}
							${Input({
            type: "password",
            value: this.apiKey,
            placeholder: i18n("Leave empty if not required"),
            onInput: (e) => {
                this.apiKey = e.target.value;
                this.requestUpdate();
            },
        })}
						</div>

						${this.isAutoDiscoveryType()
            ? html `
									<div class="flex flex-col gap-2">
										${Button({
                onClick: () => this.testConnection(),
                variant: "outline",
                disabled: this.testing || !this.baseUrl,
                children: this.testing ? i18n("Testing...") : i18n("Test Connection"),
            })}
										${this.testError ? html ` <div class="text-sm text-destructive">${this.testError}</div> ` : ""}
										${this.discoveredModels.length > 0
                ? html `
													<div class="text-sm text-muted-foreground">
														${i18n("Discovered")} ${this.discoveredModels.length} ${i18n("models")}:
														<ul class="list-disc list-inside mt-2">
															${this.discoveredModels.slice(0, 5).map((model) => html `<li>${model.name}</li>`)}
															${this.discoveredModels.length > 5
                    ? html `<li>...${i18n("and")} ${this.discoveredModels.length - 5} ${i18n("more")}</li>`
                    : ""}
														</ul>
													</div>
												`
                : ""}
									</div>
								`
            : html ` <div class="text-sm text-muted-foreground">
									${i18n("For manual provider types, add models after saving the provider.")}
								</div>`}
					</div>
				</div>

				<div class="p-6 flex-shrink-0 border-t border-border flex justify-end gap-2">
					${Button({
            onClick: () => this.close(),
            variant: "ghost",
            children: i18n("Cancel"),
        })}
					${Button({
            onClick: () => this.save(),
            variant: "default",
            disabled: !this.name || !this.baseUrl,
            children: i18n("Save"),
        })}
				</div>
			</div>
		`;
    }
}
__decorate([
    state()
], CustomProviderDialog.prototype, "name", void 0);
__decorate([
    state()
], CustomProviderDialog.prototype, "type", void 0);
__decorate([
    state()
], CustomProviderDialog.prototype, "baseUrl", void 0);
__decorate([
    state()
], CustomProviderDialog.prototype, "apiKey", void 0);
__decorate([
    state()
], CustomProviderDialog.prototype, "testing", void 0);
__decorate([
    state()
], CustomProviderDialog.prototype, "testError", void 0);
__decorate([
    state()
], CustomProviderDialog.prototype, "discoveredModels", void 0);
customElements.define("custom-provider-dialog", CustomProviderDialog);
//# sourceMappingURL=CustomProviderDialog.js.map