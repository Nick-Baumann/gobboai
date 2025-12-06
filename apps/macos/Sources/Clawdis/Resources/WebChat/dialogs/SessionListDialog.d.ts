import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
export declare class SessionListDialog extends DialogBase {
    private sessions;
    private loading;
    private onSelectCallback?;
    private onDeleteCallback?;
    private deletedSessions;
    private closedViaSelection;
    protected modalWidth: string;
    protected modalHeight: string;
    static open(onSelect: (sessionId: string) => void, onDelete?: (sessionId: string) => void): Promise<void>;
    private loadSessions;
    private handleDelete;
    close(): void;
    private handleSelect;
    private formatDate;
    protected renderContent(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=SessionListDialog.d.ts.map