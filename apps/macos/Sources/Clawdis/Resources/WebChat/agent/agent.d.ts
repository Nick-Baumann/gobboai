import { type AgentTool, type Message, type Model } from "@mariozechner/pi-ai";
import type { AppMessage } from "../components/Messages.js";
import type { Attachment } from "../utils/attachment-utils.js";
import type { AgentTransport } from "./transports/types.js";
import type { DebugLogEntry } from "./types.js";
export type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high";
export interface AgentState {
    systemPrompt: string;
    model: Model<any>;
    thinkingLevel: ThinkingLevel;
    tools: AgentTool<any>[];
    messages: AppMessage[];
    isStreaming: boolean;
    streamMessage: Message | null;
    pendingToolCalls: Set<string>;
    error?: string;
}
export type AgentEvent = {
    type: "state-update";
    state: AgentState;
} | {
    type: "error-no-model";
} | {
    type: "error-no-api-key";
    provider: string;
} | {
    type: "started";
} | {
    type: "completed";
};
export interface AgentOptions {
    initialState?: Partial<AgentState>;
    debugListener?: (entry: DebugLogEntry) => void;
    transport: AgentTransport;
    messageTransformer?: (messages: AppMessage[]) => Message[] | Promise<Message[]>;
}
export declare class Agent {
    private _state;
    private listeners;
    private abortController?;
    private transport;
    private debugListener?;
    private messageTransformer;
    private messageQueue;
    constructor(opts: AgentOptions);
    get state(): AgentState;
    subscribe(fn: (e: AgentEvent) => void): () => void;
    setSystemPrompt(v: string): void;
    setModel(m: Model<any>): void;
    setThinkingLevel(l: ThinkingLevel): void;
    setTools(t: AgentTool<any>[]): void;
    replaceMessages(ms: AppMessage[]): void;
    appendMessage(m: AppMessage): void;
    queueMessage(m: AppMessage): Promise<void>;
    clearMessages(): void;
    abort(): void;
    private logState;
    prompt(input: string, attachments?: Attachment[]): Promise<void>;
    private patch;
    private emit;
}
//# sourceMappingURL=agent.d.ts.map