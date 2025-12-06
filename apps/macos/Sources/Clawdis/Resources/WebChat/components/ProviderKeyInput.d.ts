import { LitElement } from "lit";
export declare class ProviderKeyInput extends LitElement {
    provider: string;
    private keyInput;
    private testing;
    private failed;
    private hasKey;
    private inputChanged;
    protected createRenderRoot(): this;
    connectedCallback(): Promise<void>;
    private checkKeyStatus;
    private testApiKey;
    private saveKey;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ProviderKeyInput.d.ts.map