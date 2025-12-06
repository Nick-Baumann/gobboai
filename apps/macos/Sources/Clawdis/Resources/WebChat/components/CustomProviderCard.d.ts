import { LitElement, type TemplateResult } from "lit";
import type { CustomProvider } from "../storage/stores/custom-providers-store.js";
export declare class CustomProviderCard extends LitElement {
    provider: CustomProvider;
    isAutoDiscovery: boolean;
    status?: {
        modelCount: number;
        status: "connected" | "disconnected" | "checking";
    };
    onRefresh?: (provider: CustomProvider) => void;
    onEdit?: (provider: CustomProvider) => void;
    onDelete?: (provider: CustomProvider) => void;
    protected createRenderRoot(): this;
    private renderStatus;
    render(): TemplateResult;
}
//# sourceMappingURL=CustomProviderCard.d.ts.map