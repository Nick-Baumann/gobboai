import "../components/ProviderKeyInput.js";
import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
export declare class ApiKeyPromptDialog extends DialogBase {
    private provider;
    private resolvePromise?;
    private unsubscribe?;
    protected modalWidth: string;
    protected modalHeight: string;
    static prompt(provider: string): Promise<boolean>;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    close(): void;
    protected renderContent(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ApiKeyPromptDialog.d.ts.map