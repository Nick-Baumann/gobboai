import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
import { type Model } from "@mariozechner/pi-ai";
import { type PropertyValues, type TemplateResult } from "lit";
export declare class ModelSelector extends DialogBase {
    currentModel: Model<any> | null;
    searchQuery: string;
    filterThinking: boolean;
    filterVision: boolean;
    customProvidersLoading: boolean;
    selectedIndex: number;
    private navigationMode;
    private customProviderModels;
    private onSelectCallback?;
    private scrollContainerRef;
    private searchInputRef;
    private lastMousePosition;
    protected modalWidth: string;
    static open(currentModel: Model<any> | null, onSelect: (model: Model<any>) => void): Promise<void>;
    firstUpdated(changedProperties: PropertyValues): Promise<void>;
    private loadCustomProviders;
    private formatTokens;
    private handleSelect;
    private getFilteredModels;
    private scrollToSelected;
    protected renderContent(): TemplateResult;
}
//# sourceMappingURL=ModelSelector.d.ts.map