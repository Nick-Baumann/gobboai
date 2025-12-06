import "@mariozechner/mini-lit/dist/CodeBlock.js";
import type { ToolResultMessage } from "@mariozechner/pi-ai";
import "../../components/ConsoleBlock.js";
import type { ToolRenderer, ToolRenderResult } from "../types.js";
import type { ArtifactsPanel, ArtifactsParams } from "./artifacts.js";
export declare class ArtifactsToolRenderer implements ToolRenderer<ArtifactsParams, undefined> {
    artifactsPanel?: ArtifactsPanel | undefined;
    constructor(artifactsPanel?: ArtifactsPanel | undefined);
    render(params: ArtifactsParams | undefined, result: ToolResultMessage<undefined> | undefined, isStreaming?: boolean): ToolRenderResult;
}
//# sourceMappingURL=artifacts-tool-renderer.d.ts.map