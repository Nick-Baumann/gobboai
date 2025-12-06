import type { ToolResultMessage } from "@mariozechner/pi-ai";
import "./javascript-repl.js";
import "./extract-document.js";
import { getToolRenderer, registerToolRenderer } from "./renderer-registry.js";
import type { ToolRenderResult } from "./types.js";
/**
 * Enable or disable show JSON mode
 * When enabled, all tool renderers will use the default JSON renderer
 */
export declare function setShowJsonMode(enabled: boolean): void;
/**
 * Render tool - unified function that handles params, result, and streaming state
 */
export declare function renderTool(toolName: string, params: any | undefined, result: ToolResultMessage | undefined, isStreaming?: boolean): ToolRenderResult;
export { getToolRenderer, registerToolRenderer };
//# sourceMappingURL=index.d.ts.map