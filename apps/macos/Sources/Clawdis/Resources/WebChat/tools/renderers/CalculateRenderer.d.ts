import type { ToolResultMessage } from "@mariozechner/pi-ai";
import type { ToolRenderer, ToolRenderResult } from "../types.js";
interface CalculateParams {
    expression: string;
}
export declare class CalculateRenderer implements ToolRenderer<CalculateParams, undefined> {
    render(params: CalculateParams | undefined, result: ToolResultMessage<undefined> | undefined): ToolRenderResult;
}
export {};
//# sourceMappingURL=CalculateRenderer.d.ts.map