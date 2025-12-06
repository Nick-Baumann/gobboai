import { type Ref } from "lit/directives/ref.js";
import type { SandboxIframe } from "../../components/SandboxedIframe.js";
import type { SandboxRuntimeProvider } from "../../components/sandbox/SandboxRuntimeProvider.js";
import "../../components/SandboxedIframe.js";
import { ArtifactElement } from "./ArtifactElement.js";
import "./Console.js";
export declare class HtmlArtifact extends ArtifactElement {
    filename: string;
    runtimeProviders: SandboxRuntimeProvider[];
    sandboxUrlProvider?: () => string;
    private _content;
    private logs;
    sandboxIframeRef: Ref<SandboxIframe>;
    private consoleRef;
    private viewMode;
    private setViewMode;
    getHeaderButtons(): import("lit-html").TemplateResult<1>;
    set content(value: string);
    executeContent(html: string): void;
    get content(): string;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    getLogs(): string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=HtmlArtifact.d.ts.map