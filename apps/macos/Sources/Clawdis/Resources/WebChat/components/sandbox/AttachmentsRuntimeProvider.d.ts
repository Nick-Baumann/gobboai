import type { Attachment } from "../../utils/attachment-utils.js";
import type { SandboxRuntimeProvider } from "./SandboxRuntimeProvider.js";
/**
 * Attachments Runtime Provider
 *
 * OPTIONAL provider that provides file access APIs to sandboxed code.
 * Only needed when attachments are present.
 * Attachments are read-only snapshot data - no messaging needed.
 */
export declare class AttachmentsRuntimeProvider implements SandboxRuntimeProvider {
    private attachments;
    constructor(attachments: Attachment[]);
    getData(): Record<string, any>;
    getRuntime(): (sandboxId: string) => void;
    getDescription(): string;
}
//# sourceMappingURL=AttachmentsRuntimeProvider.d.ts.map