import { LitElement } from "lit";
import { type MessageConsumer } from "./sandbox/RuntimeMessageRouter.js";
import type { SandboxRuntimeProvider } from "./sandbox/SandboxRuntimeProvider.js";
export interface SandboxFile {
    fileName: string;
    content: string | Uint8Array;
    mimeType: string;
}
export interface SandboxResult {
    success: boolean;
    console: Array<{
        type: string;
        text: string;
    }>;
    files?: SandboxFile[];
    error?: {
        message: string;
        stack: string;
    };
    returnValue?: any;
}
/**
 * Function that returns the URL to the sandbox HTML file.
 * Used in browser extensions to load sandbox.html via chrome.runtime.getURL().
 */
export type SandboxUrlProvider = () => string;
/**
 * Configuration for prepareHtmlDocument
 */
export interface PrepareHtmlOptions {
    /** True if this is an HTML artifact (inject into existing HTML), false if REPL (wrap in HTML) */
    isHtmlArtifact: boolean;
    /** True if this is a standalone download (no runtime bridge, no navigation interceptor) */
    isStandalone?: boolean;
}
export declare class SandboxIframe extends LitElement {
    private iframe?;
    /**
     * Optional: Provide a function that returns the sandbox HTML URL.
     * If provided, the iframe will use this URL instead of srcdoc.
     * This is required for browser extensions with strict CSP.
     */
    sandboxUrlProvider?: SandboxUrlProvider;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Load HTML content into sandbox and keep it displayed (for HTML artifacts)
     * @param sandboxId Unique ID
     * @param htmlContent Full HTML content
     * @param providers Runtime providers to inject
     * @param consumers Message consumers to register (optional)
     */
    loadContent(sandboxId: string, htmlContent: string, providers?: SandboxRuntimeProvider[], consumers?: MessageConsumer[]): void;
    private loadViaSandboxUrl;
    private loadViaSrcdoc;
    /**
     * Execute code in sandbox
     * @param sandboxId Unique ID for this execution
     * @param code User code (plain JS for REPL, or full HTML for artifacts)
     * @param providers Runtime providers to inject
     * @param consumers Additional message consumers (optional, execute has its own internal consumer)
     * @param signal Abort signal
     * @returns Promise resolving to execution result
     */
    execute(sandboxId: string, code: string, providers?: SandboxRuntimeProvider[], consumers?: MessageConsumer[], signal?: AbortSignal, isHtmlArtifact?: boolean): Promise<SandboxResult>;
    /**
     * Validate HTML using DOMParser - returns error message if invalid, null if valid
     * Note: JavaScript syntax validation is done in sandbox.js to avoid CSP restrictions
     */
    private validateHtml;
    /**
     * Prepare complete HTML document with runtime + user code
     * PUBLIC so HtmlArtifact can use it for download button
     */
    prepareHtmlDocument(sandboxId: string, userCode: string, providers?: SandboxRuntimeProvider[], options?: PrepareHtmlOptions): string;
    /**
     * Generate runtime script from providers
     * @param sandboxId Unique sandbox ID
     * @param providers Runtime providers
     * @param isStandalone If true, skip runtime bridge and navigation interceptor (for standalone downloads)
     */
    private getRuntimeScript;
}
//# sourceMappingURL=SandboxedIframe.d.ts.map