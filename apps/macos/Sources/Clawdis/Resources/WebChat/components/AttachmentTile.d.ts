import { LitElement } from "lit";
import type { Attachment } from "../utils/attachment-utils.js";
export declare class AttachmentTile extends LitElement {
    attachment: Attachment;
    showDelete: boolean;
    onDelete?: () => void;
    protected createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    private handleClick;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=AttachmentTile.d.ts.map