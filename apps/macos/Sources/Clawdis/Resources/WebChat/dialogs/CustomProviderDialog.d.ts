import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
import { type TemplateResult } from "lit";
import type { CustomProvider, CustomProviderType } from "../storage/stores/custom-providers-store.js";
export declare class CustomProviderDialog extends DialogBase {
    private provider?;
    private initialType?;
    private onSaveCallback?;
    private name;
    private type;
    private baseUrl;
    private apiKey;
    private testing;
    private testError;
    private discoveredModels;
    protected modalWidth: string;
    protected modalHeight: string;
    static open(provider: CustomProvider | undefined, initialType: CustomProviderType | undefined, onSave?: () => void): Promise<void>;
    private initializeFromProvider;
    private updateDefaultBaseUrl;
    private isAutoDiscoveryType;
    private testConnection;
    private save;
    protected renderContent(): TemplateResult;
}
//# sourceMappingURL=CustomProviderDialog.d.ts.map