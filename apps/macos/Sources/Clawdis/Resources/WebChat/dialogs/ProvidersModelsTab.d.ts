import { type TemplateResult } from "lit";
import "../components/CustomProviderCard.js";
import "../components/ProviderKeyInput.js";
import { SettingsTab } from "./SettingsDialog.js";
export declare class ProvidersModelsTab extends SettingsTab {
    private customProviders;
    private providerStatus;
    connectedCallback(): Promise<void>;
    private loadCustomProviders;
    getTabName(): string;
    private checkProviderStatus;
    private renderKnownProviders;
    private renderCustomProviders;
    private addCustomProvider;
    private editProvider;
    private refreshProvider;
    private deleteProvider;
    render(): TemplateResult;
}
//# sourceMappingURL=ProvidersModelsTab.d.ts.map