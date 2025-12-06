var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { i18n } from "@mariozechner/mini-lit";
import { Badge } from "@mariozechner/mini-lit/dist/Badge.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { complete, getModel } from "@mariozechner/pi-ai";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getAppStorage } from "../storage/app-storage.js";
import { applyProxyIfNeeded } from "../utils/proxy-utils.js";
import { Input } from "./Input.js";
// Test models for each provider
const TEST_MODELS = {
    anthropic: "claude-3-5-haiku-20241022",
    openai: "gpt-4o-mini",
    google: "gemini-2.5-flash",
    groq: "openai/gpt-oss-20b",
    openrouter: "z-ai/glm-4.6",
    cerebras: "gpt-oss-120b",
    xai: "grok-4-fast-non-reasoning",
    zai: "glm-4.5-air",
};
let ProviderKeyInput = class ProviderKeyInput extends LitElement {
    constructor() {
        super(...arguments);
        this.provider = "";
        this.keyInput = "";
        this.testing = false;
        this.failed = false;
        this.hasKey = false;
        this.inputChanged = false;
    }
    createRenderRoot() {
        return this;
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.checkKeyStatus();
    }
    async checkKeyStatus() {
        try {
            const key = await getAppStorage().providerKeys.get(this.provider);
            this.hasKey = !!key;
        }
        catch (error) {
            console.error("Failed to check key status:", error);
        }
    }
    async testApiKey(provider, apiKey) {
        try {
            const modelId = TEST_MODELS[provider];
            // Returning true here for Ollama and friends. Can' know which model to use for testing
            if (!modelId)
                return true;
            let model = getModel(provider, modelId);
            if (!model)
                return false;
            // Get proxy URL from settings (if available)
            const proxyEnabled = await getAppStorage().settings.get("proxy.enabled");
            const proxyUrl = await getAppStorage().settings.get("proxy.url");
            // Apply proxy only if this provider/key combination requires it
            model = applyProxyIfNeeded(model, apiKey, proxyEnabled ? proxyUrl || undefined : undefined);
            const context = {
                messages: [{ role: "user", content: "Reply with: ok", timestamp: Date.now() }],
            };
            const result = await complete(model, context, {
                apiKey,
                maxTokens: 200,
            });
            return result.stopReason === "stop";
        }
        catch (error) {
            console.error(`API key test failed for ${provider}:`, error);
            return false;
        }
    }
    async saveKey() {
        if (!this.keyInput)
            return;
        this.testing = true;
        this.failed = false;
        const success = await this.testApiKey(this.provider, this.keyInput);
        this.testing = false;
        if (success) {
            try {
                await getAppStorage().providerKeys.set(this.provider, this.keyInput);
                this.hasKey = true;
                this.inputChanged = false;
                this.requestUpdate();
            }
            catch (error) {
                console.error("Failed to save API key:", error);
                this.failed = true;
                setTimeout(() => {
                    this.failed = false;
                    this.requestUpdate();
                }, 5000);
            }
        }
        else {
            this.failed = true;
            setTimeout(() => {
                this.failed = false;
                this.requestUpdate();
            }, 5000);
        }
    }
    render() {
        return html `
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium capitalize text-foreground">${this.provider}</span>
					${this.testing
            ? Badge({ children: i18n("Testing..."), variant: "secondary" })
            : this.hasKey
                ? html `<span class="text-green-600 dark:text-green-400">✓</span>`
                : ""}
					${this.failed ? Badge({ children: i18n("✗ Invalid"), variant: "destructive" }) : ""}
				</div>
				<div class="flex items-center gap-2">
					${Input({
            type: "password",
            placeholder: this.hasKey ? "••••••••••••" : i18n("Enter API key"),
            value: this.keyInput,
            onInput: (e) => {
                this.keyInput = e.target.value;
                this.inputChanged = true;
                this.requestUpdate();
            },
            className: "flex-1",
        })}
					${Button({
            onClick: () => this.saveKey(),
            variant: "default",
            size: "sm",
            disabled: !this.keyInput || this.testing || (this.hasKey && !this.inputChanged),
            children: i18n("Save"),
        })}
				</div>
			</div>
		`;
    }
};
__decorate([
    property()
], ProviderKeyInput.prototype, "provider", void 0);
__decorate([
    state()
], ProviderKeyInput.prototype, "keyInput", void 0);
__decorate([
    state()
], ProviderKeyInput.prototype, "testing", void 0);
__decorate([
    state()
], ProviderKeyInput.prototype, "failed", void 0);
__decorate([
    state()
], ProviderKeyInput.prototype, "hasKey", void 0);
__decorate([
    state()
], ProviderKeyInput.prototype, "inputChanged", void 0);
ProviderKeyInput = __decorate([
    customElement("provider-key-input")
], ProviderKeyInput);
export { ProviderKeyInput };
//# sourceMappingURL=ProviderKeyInput.js.map