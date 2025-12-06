import type { ToolResultMessage } from "@mariozechner/pi-ai";
import type { ToolRenderer, ToolRenderResult } from "../types.js";
interface BashParams {
    command: string;
}
export declare class BashRenderer implements ToolRenderer<BashParams, undefined> {
    render(params: BashParams | undefined, result: ToolResultMessage<undefined> | undefined): ToolRenderResult;
}
export {};
//# sourceMappingURL=BashRenderer.d.ts.map