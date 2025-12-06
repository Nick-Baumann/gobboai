import { LitElement, type TemplateResult } from "lit";
import "../components/ProviderKeyInput.js";
export declare abstract class SettingsTab extends LitElement {
    abstract getTabName(): string;
    protected createRenderRoot(): this;
}
export declare class ApiKeysTab extends SettingsTab {
    getTabName(): string;
    render(): TemplateResult;
}
export declare class ProxyTab extends SettingsTab {
    private proxyEnabled;
    private proxyUrl;
    connectedCallback(): Promise<void>;
    private saveProxySettings;
    getTabName(): string;
    render(): TemplateResult;
}
export declare class SettingsDialog extends LitElement {
    tabs: SettingsTab[];
    private isOpen;
    private activeTabIndex;
    protected createRenderRoot(): this;
    static open(tabs: SettingsTab[]): Promise<void>;
    private setActiveTab;
    private renderSidebarItem;
    private renderMobileTab;
    render(): TemplateResult;
}
//# sourceMappingURL=SettingsDialog.d.ts.map