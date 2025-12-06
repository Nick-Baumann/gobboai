import { LitElement, type TemplateResult } from "lit";
/**
 * Reusable expandable section component for tool renderers.
 * Captures children in connectedCallback and re-renders them in the details area.
 */
export declare class ExpandableSection extends LitElement {
    summary: string;
    defaultExpanded: boolean;
    private expanded;
    private capturedChildren;
    protected createRenderRoot(): this;
    connectedCallback(): void;
    render(): TemplateResult;
}
//# sourceMappingURL=ExpandableSection.d.ts.map