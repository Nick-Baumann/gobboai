var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ModelSelector_1;
import { icon } from "@mariozechner/mini-lit";
import { Badge } from "@mariozechner/mini-lit/dist/Badge.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { DialogHeader } from "@mariozechner/mini-lit/dist/Dialog.js";
import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
import { getModels, getProviders } from "@mariozechner/pi-ai";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { Brain, Image as ImageIcon } from "lucide";
import { Input } from "../components/Input.js";
import { getAppStorage } from "../storage/app-storage.js";
import { formatModelCost } from "../utils/format.js";
import { i18n } from "../utils/i18n.js";
import { discoverModels } from "../utils/model-discovery.js";
let ModelSelector = ModelSelector_1 = class ModelSelector extends DialogBase {
    constructor() {
        super(...arguments);
        this.currentModel = null;
        this.searchQuery = "";
        this.filterThinking = false;
        this.filterVision = false;
        this.customProvidersLoading = false;
        this.selectedIndex = 0;
        this.navigationMode = "mouse";
        this.customProviderModels = [];
        this.scrollContainerRef = createRef();
        this.searchInputRef = createRef();
        this.lastMousePosition = { x: 0, y: 0 };
        this.modalWidth = "min(400px, 90vw)";
    }
    static async open(currentModel, onSelect) {
        const selector = new ModelSelector_1();
        selector.currentModel = currentModel;
        selector.onSelectCallback = onSelect;
        selector.open();
        selector.loadCustomProviders();
    }
    async firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        // Wait for dialog to be fully rendered
        await this.updateComplete;
        // Focus the search input when dialog opens
        this.searchInputRef.value?.focus();
        // Track actual mouse movement
        this.addEventListener("mousemove", (e) => {
            // Check if mouse actually moved
            if (e.clientX !== this.lastMousePosition.x || e.clientY !== this.lastMousePosition.y) {
                this.lastMousePosition = { x: e.clientX, y: e.clientY };
                // Only switch to mouse mode on actual mouse movement
                if (this.navigationMode === "keyboard") {
                    this.navigationMode = "mouse";
                    // Update selection to the item under the mouse
                    const target = e.target;
                    const modelItem = target.closest("[data-model-item]");
                    if (modelItem) {
                        const allItems = this.scrollContainerRef.value?.querySelectorAll("[data-model-item]");
                        if (allItems) {
                            const index = Array.from(allItems).indexOf(modelItem);
                            if (index !== -1) {
                                this.selectedIndex = index;
                            }
                        }
                    }
                }
            }
        });
        // Add global keyboard handler for the dialog
        this.addEventListener("keydown", (e) => {
            // Get filtered models to know the bounds
            const filteredModels = this.getFilteredModels();
            if (e.key === "ArrowDown") {
                e.preventDefault();
                this.navigationMode = "keyboard";
                this.selectedIndex = Math.min(this.selectedIndex + 1, filteredModels.length - 1);
                this.scrollToSelected();
            }
            else if (e.key === "ArrowUp") {
                e.preventDefault();
                this.navigationMode = "keyboard";
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.scrollToSelected();
            }
            else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredModels[this.selectedIndex]) {
                    this.handleSelect(filteredModels[this.selectedIndex].model);
                }
            }
        });
    }
    async loadCustomProviders() {
        this.customProvidersLoading = true;
        const allCustomModels = [];
        try {
            const storage = getAppStorage();
            const customProviders = await storage.customProviders.getAll();
            // Load models from custom providers
            for (const provider of customProviders) {
                const isAutoDiscovery = provider.type === "ollama" ||
                    provider.type === "llama.cpp" ||
                    provider.type === "vllm" ||
                    provider.type === "lmstudio";
                if (isAutoDiscovery) {
                    try {
                        const models = await discoverModels(provider.type, provider.baseUrl, provider.apiKey);
                        const modelsWithProvider = models.map((model) => ({
                            ...model,
                            provider: provider.name,
                        }));
                        allCustomModels.push(...modelsWithProvider);
                    }
                    catch (error) {
                        console.debug(`Failed to load models from ${provider.name}:`, error);
                    }
                }
                else if (provider.models) {
                    // Manual provider - models already defined
                    allCustomModels.push(...provider.models);
                }
            }
        }
        catch (error) {
            console.error("Failed to load custom providers:", error);
        }
        finally {
            this.customProviderModels = allCustomModels;
            this.customProvidersLoading = false;
            this.requestUpdate();
        }
    }
    formatTokens(tokens) {
        if (tokens >= 1000000)
            return `${(tokens / 1000000).toFixed(0)}M`;
        if (tokens >= 1000)
            return `${(tokens / 1000).toFixed(0)}`;
        return String(tokens);
    }
    handleSelect(model) {
        if (model) {
            this.onSelectCallback?.(model);
            this.close();
        }
    }
    getFilteredModels() {
        // Collect all models from known providers
        const allModels = [];
        const knownProviders = getProviders();
        for (const provider of knownProviders) {
            const models = getModels(provider);
            for (const model of models) {
                allModels.push({ provider, id: model.id, model });
            }
        }
        // Add custom provider models
        for (const model of this.customProviderModels) {
            allModels.push({ provider: model.provider, id: model.id, model });
        }
        // Filter models based on search and capability filters
        let filteredModels = allModels;
        // Apply search filter
        if (this.searchQuery) {
            filteredModels = filteredModels.filter(({ provider, id, model }) => {
                const searchTokens = this.searchQuery.split(/\s+/).filter((t) => t);
                const searchText = `${provider} ${id} ${model.name}`.toLowerCase();
                return searchTokens.every((token) => searchText.includes(token));
            });
        }
        // Apply capability filters
        if (this.filterThinking) {
            filteredModels = filteredModels.filter(({ model }) => model.reasoning);
        }
        if (this.filterVision) {
            filteredModels = filteredModels.filter(({ model }) => model.input.includes("image"));
        }
        // Sort: current model first, then by provider
        filteredModels.sort((a, b) => {
            const aIsCurrent = this.currentModel?.id === a.model.id;
            const bIsCurrent = this.currentModel?.id === b.model.id;
            if (aIsCurrent && !bIsCurrent)
                return -1;
            if (!aIsCurrent && bIsCurrent)
                return 1;
            return a.provider.localeCompare(b.provider);
        });
        return filteredModels;
    }
    scrollToSelected() {
        requestAnimationFrame(() => {
            const scrollContainer = this.scrollContainerRef.value;
            const selectedElement = scrollContainer?.querySelectorAll("[data-model-item]")[this.selectedIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        });
    }
    renderContent() {
        const filteredModels = this.getFilteredModels();
        return html `
			<!-- Header and Search -->
			<div class="p-6 pb-4 flex flex-col gap-4 border-b border-border flex-shrink-0">
				${DialogHeader({ title: i18n("Select Model") })}
				${Input({
            placeholder: i18n("Search models..."),
            value: this.searchQuery,
            inputRef: this.searchInputRef,
            onInput: (e) => {
                this.searchQuery = e.target.value;
                this.selectedIndex = 0;
                // Reset scroll position when search changes
                if (this.scrollContainerRef.value) {
                    this.scrollContainerRef.value.scrollTop = 0;
                }
            },
        })}
				<div class="flex gap-2">
					${Button({
            variant: this.filterThinking ? "default" : "secondary",
            size: "sm",
            onClick: () => {
                this.filterThinking = !this.filterThinking;
                this.selectedIndex = 0;
                if (this.scrollContainerRef.value) {
                    this.scrollContainerRef.value.scrollTop = 0;
                }
            },
            className: "rounded-full",
            children: html `<span class="inline-flex items-center gap-1">${icon(Brain, "sm")} ${i18n("Thinking")}</span>`,
        })}
					${Button({
            variant: this.filterVision ? "default" : "secondary",
            size: "sm",
            onClick: () => {
                this.filterVision = !this.filterVision;
                this.selectedIndex = 0;
                if (this.scrollContainerRef.value) {
                    this.scrollContainerRef.value.scrollTop = 0;
                }
            },
            className: "rounded-full",
            children: html `<span class="inline-flex items-center gap-1">${icon(ImageIcon, "sm")} ${i18n("Vision")}</span>`,
        })}
				</div>
			</div>

			<!-- Scrollable model list -->
			<div class="flex-1 overflow-y-auto" ${ref(this.scrollContainerRef)}>
				${filteredModels.map(({ provider, id, model }, index) => {
            const isCurrent = this.currentModel?.id === model.id && this.currentModel?.provider === model.provider;
            const isSelected = index === this.selectedIndex;
            return html `
						<div
							data-model-item
							class="px-4 py-3 ${this.navigationMode === "mouse" ? "hover:bg-muted" : ""} cursor-pointer border-b border-border ${isSelected ? "bg-accent" : ""}"
							@click=${() => this.handleSelect(model)}
							@mouseenter=${() => {
                // Only update selection in mouse mode
                if (this.navigationMode === "mouse") {
                    this.selectedIndex = index;
                }
            }}
						>
							<div class="flex items-center justify-between gap-2 mb-1">
								<div class="flex items-center gap-2 flex-1 min-w-0">
									<span class="text-sm font-medium text-foreground truncate">${id}</span>
									${isCurrent ? html `<span class="text-green-500">✓</span>` : ""}
								</div>
								${Badge(provider, "outline")}
							</div>
							<div class="flex items-center justify-between text-xs text-muted-foreground">
								<div class="flex items-center gap-2">
									<span class="${model.reasoning ? "" : "opacity-30"}">${icon(Brain, "sm")}</span>
									<span class="${model.input.includes("image") ? "" : "opacity-30"}">${icon(ImageIcon, "sm")}</span>
									<span>${this.formatTokens(model.contextWindow)}K/${this.formatTokens(model.maxTokens)}K</span>
								</div>
								<span>${formatModelCost(model.cost)}</span>
							</div>
						</div>
					`;
        })}
			</div>
		`;
    }
};
__decorate([
    state()
], ModelSelector.prototype, "currentModel", void 0);
__decorate([
    state()
], ModelSelector.prototype, "searchQuery", void 0);
__decorate([
    state()
], ModelSelector.prototype, "filterThinking", void 0);
__decorate([
    state()
], ModelSelector.prototype, "filterVision", void 0);
__decorate([
    state()
], ModelSelector.prototype, "customProvidersLoading", void 0);
__decorate([
    state()
], ModelSelector.prototype, "selectedIndex", void 0);
__decorate([
    state()
], ModelSelector.prototype, "navigationMode", void 0);
__decorate([
    state()
], ModelSelector.prototype, "customProviderModels", void 0);
ModelSelector = ModelSelector_1 = __decorate([
    customElement("agent-model-selector")
], ModelSelector);
export { ModelSelector };
//# sourceMappingURL=ModelSelector.js.map