import type { AgentTool } from "@mariozechner/pi-ai";
import { type Static } from "@sinclair/typebox";
import { type SandboxFile } from "../components/SandboxedIframe.js";
import type { SandboxRuntimeProvider } from "../components/sandbox/SandboxRuntimeProvider.js";
import type { ToolRenderer } from "./types.js";
export declare function executeJavaScript(code: string, runtimeProviders: SandboxRuntimeProvider[], signal?: AbortSignal, sandboxUrlProvider?: () => string): Promise<{
    output: string;
    files?: SandboxFile[];
}>;
export type JavaScriptReplToolResult = {
    files?: {
        fileName: string;
        contentBase64: string;
        mimeType: string;
    }[] | undefined;
};
declare const javascriptReplSchema: import("@sinclair/typebox").TObject<{
    title: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TString;
}>;
export type JavaScriptReplParams = Static<typeof javascriptReplSchema>;
interface JavaScriptReplResult {
    output?: string;
    files?: Array<{
        fileName: string;
        mimeType: string;
        size: number;
        contentBase64: string;
    }>;
}
export declare function createJavaScriptReplTool(): AgentTool<typeof javascriptReplSchema, JavaScriptReplToolResult> & {
    runtimeProvidersFactory?: () => SandboxRuntimeProvider[];
    sandboxUrlProvider?: () => string;
};
export declare const javascriptReplTool: AgentTool<import("@sinclair/typebox").TObject<{
    title: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TString;
}>, JavaScriptReplToolResult> & {
    runtimeProvidersFactory?: () => SandboxRuntimeProvider[];
    sandboxUrlProvider?: () => string;
};
export declare const javascriptReplRenderer: ToolRenderer<JavaScriptReplParams, JavaScriptReplResult>;
export {};
//# sourceMappingURL=javascript-repl.d.ts.map