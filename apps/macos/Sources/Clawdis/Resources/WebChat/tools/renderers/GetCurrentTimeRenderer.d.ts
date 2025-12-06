import type { ToolResultMessage } from "@mariozechner/pi-ai";
import type { ToolRenderer, ToolRenderResult } from "../types.js";
interface GetCurrentTimeParams {
    timezone?: string;
}
export declare class GetCurrentTimeRenderer implements ToolRenderer<GetCurrentTimeParams, undefined> {
    render(params: GetCurrentTimeParams | undefined, result: ToolResultMessage<undefined> | undefined): ToolRenderResult;
}
export {};
//# sourceMappingURL=GetCurrentTimeRenderer.d.ts.map