import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
export declare class PersistentStorageDialog extends DialogBase {
    private requesting;
    private resolvePromise?;
    protected modalWidth: string;
    protected modalHeight: string;
    /**
     * Request persistent storage permission.
     * Returns true if browser granted persistent storage, false otherwise.
     */
    static request(): Promise<boolean>;
    private handleGrant;
    private handleDeny;
    close(): void;
    protected renderContent(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=PersistentStorageDialog.d.ts.map