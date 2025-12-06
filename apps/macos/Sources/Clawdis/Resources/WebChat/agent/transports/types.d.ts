import type { AgentEvent, AgentTool, Message, Model, QueuedMessage } from "@mariozechner/pi-ai";
export interface AgentRunConfig {
    systemPrompt: string;
    tools: AgentTool<any>[];
    model: Model<any>;
    reasoning?: "low" | "medium" | "high";
    getQueuedMessages?: <T>() => Promise<QueuedMessage<T>[]>;
}
export interface AgentTransport {
    run(messages: Message[], userMessage: Message, config: AgentRunConfig, signal?: AbortSignal): AsyncIterable<AgentEvent>;
}
//# sourceMappingURL=types.d.ts.map