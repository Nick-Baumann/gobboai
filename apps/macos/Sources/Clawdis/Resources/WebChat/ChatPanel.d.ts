import { LitElement } from "lit";
import type { Agent } from "./agent/agent.js";
import "./components/AgentInterface.js";
import type { AgentTool } from "@mariozechner/pi-ai";
import type { AgentInterface } from "./components/AgentInterface.js";
import type { SandboxRuntimeProvider } from "./components/sandbox/SandboxRuntimeProvider.js";
import { ArtifactsPanel } from "./tools/artifacts/index.js";
export declare class ChatPanel extends LitElement {
    agent?: Agent;
    agentInterface?: AgentInterface;
    artifactsPanel?: ArtifactsPanel;
    private hasArtifacts;
    private artifactCount;
    private showArtifactsPanel;
    private windowWidth;
    private resizeHandler;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    setAgent(agent: Agent, config?: {
        onApiKeyRequired?: (provider: string) => Promise<boolean>;
        onBeforeSend?: () => void | Promise<void>;
        onCostClick?: () => void;
        sandboxUrlProvider?: () => string;
        toolsFactory?: (agent: Agent, agentInterface: AgentInterface, artifactsPanel: ArtifactsPanel, runtimeProvidersFactory: () => SandboxRuntimeProvider[]) => AgentTool<any>[];
    }): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=ChatPanel.d.ts.map