import type { AgentTool } from "@mariozechner/pi-ai";
import { type Static } from "@sinclair/typebox";
import type { ToolRenderer } from "./types.js";
declare const extractDocumentSchema: import("@sinclair/typebox").TObject<{
    url: import("@sinclair/typebox").TString;
}>;
export type ExtractDocumentParams = Static<typeof extractDocumentSchema>;
export interface ExtractDocumentResult {
    extractedText: string;
    format: string;
    fileName: string;
    size: number;
}
export declare function createExtractDocumentTool(): AgentTool<typeof extractDocumentSchema, ExtractDocumentResult> & {
    corsProxyUrl?: string;
};
export declare const extractDocumentTool: AgentTool<import("@sinclair/typebox").TObject<{
    url: import("@sinclair/typebox").TString;
}>, ExtractDocumentResult> & {
    corsProxyUrl?: string;
};
export declare const extractDocumentRenderer: ToolRenderer<ExtractDocumentParams, ExtractDocumentResult>;
export {};
//# sourceMappingURL=extract-document.d.ts.map