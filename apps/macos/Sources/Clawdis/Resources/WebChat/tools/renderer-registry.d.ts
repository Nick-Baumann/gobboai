import { type TemplateResult } from "lit";
import type { Ref } from "lit/directives/ref.js";
import type { ToolRenderer } from "./types.js";
export declare const toolRenderers: Map<string, ToolRenderer<any, any>>;
/**
 * Register a custom tool renderer
 */
export declare function registerToolRenderer(toolName: string, renderer: ToolRenderer): void;
/**
 * Get a tool renderer by name
 */
export declare function getToolRenderer(toolName: string): ToolRenderer | undefined;
/**
 * Helper to render a header for tool renderers
 * Shows icon on left when complete/error, spinner on right when in progress
 */
export declare function renderHeader(state: "inprogress" | "complete" | "error", toolIcon: any, text: string | TemplateResult): TemplateResult;
/**
 * Helper to render a collapsible header for tool renderers
 * Same as renderHeader but with a chevron button that toggles visibility of content
 */
export declare function renderCollapsibleHeader(state: "inprogress" | "complete" | "error", toolIcon: any, text: string | TemplateResult, contentRef: Ref<HTMLElement>, chevronRef: Ref<HTMLElement>, defaultExpanded?: boolean): TemplateResult;
//# sourceMappingURL=renderer-registry.d.ts.map