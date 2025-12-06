export declare const simpleHtml: {
    systemPrompt: string;
    model: {
        id: string;
        name: string;
        api: string;
        provider: string;
        baseUrl: string;
        reasoning: boolean;
        input: string[];
        cost: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
        };
        contextWindow: number;
        maxTokens: number;
    };
    messages: ({
        role: string;
        content: {
            type: string;
            text: string;
        }[];
        api?: undefined;
        provider?: undefined;
        model?: undefined;
        usage?: undefined;
        stopReason?: undefined;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
    } | {
        role: string;
        content: ({
            type: string;
            text: string;
            id?: undefined;
            name?: undefined;
            arguments?: undefined;
        } | {
            type: string;
            id: string;
            name: string;
            arguments: {
                command: string;
                filename: string;
                content: string;
            };
            text?: undefined;
        })[];
        api: string;
        provider: string;
        model: string;
        usage: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            cost: {
                input: number;
                output: number;
                cacheRead: number;
                cacheWrite: number;
                total: number;
            };
        };
        stopReason: string;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
    } | {
        role: string;
        toolCallId: string;
        toolName: string;
        output: string;
        isError: boolean;
        content?: undefined;
        api?: undefined;
        provider?: undefined;
        model?: undefined;
        usage?: undefined;
        stopReason?: undefined;
    })[];
};
export declare const longSession: {
    systemPrompt: string;
    model: {
        id: string;
        name: string;
        api: string;
        provider: string;
        baseUrl: string;
        reasoning: boolean;
        input: string[];
        cost: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
        };
        contextWindow: number;
        maxTokens: number;
    };
    messages: ({
        role: string;
        content: {
            type: string;
            text: string;
        }[];
        api?: undefined;
        provider?: undefined;
        model?: undefined;
        usage?: undefined;
        stopReason?: undefined;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
        details?: undefined;
        errorMessage?: undefined;
    } | {
        role: string;
        content: ({
            type: string;
            text: string;
            id?: undefined;
            name?: undefined;
            arguments?: undefined;
        } | {
            type: string;
            id: string;
            name: string;
            arguments: {
                command: string;
                filename: string;
                content: string;
            };
            text?: undefined;
        })[];
        api: string;
        provider: string;
        model: string;
        usage: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            cost: {
                input: number;
                output: number;
                cacheRead: number;
                cacheWrite: number;
                total: number;
            };
        };
        stopReason: string;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
        details?: undefined;
        errorMessage?: undefined;
    } | {
        role: string;
        toolCallId: string;
        toolName: string;
        output: string;
        isError: boolean;
        content?: undefined;
        api?: undefined;
        provider?: undefined;
        model?: undefined;
        usage?: undefined;
        stopReason?: undefined;
        details?: undefined;
        errorMessage?: undefined;
    } | {
        role: string;
        content: ({
            type: string;
            text: string;
            id?: undefined;
            name?: undefined;
            arguments?: undefined;
        } | {
            type: string;
            id: string;
            name: string;
            arguments: {
                code: string;
            };
            text?: undefined;
        })[];
        api: string;
        provider: string;
        model: string;
        usage: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            cost: {
                input: number;
                output: number;
                cacheRead: number;
                cacheWrite: number;
                total: number;
            };
        };
        stopReason: string;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
        details?: undefined;
        errorMessage?: undefined;
    } | {
        role: string;
        toolCallId: string;
        toolName: string;
        output: string;
        details: {
            files: never[];
        };
        isError: boolean;
        content?: undefined;
        api?: undefined;
        provider?: undefined;
        model?: undefined;
        usage?: undefined;
        stopReason?: undefined;
        errorMessage?: undefined;
    } | {
        role: string;
        content: {
            type: string;
            text: string;
        }[];
        api: string;
        provider: string;
        model: string;
        usage: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            cost: {
                input: number;
                output: number;
                cacheRead: number;
                cacheWrite: number;
                total: number;
            };
        };
        stopReason: string;
        errorMessage: string;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
        details?: undefined;
    } | {
        role: string;
        content: ({
            type: string;
            text: string;
            id?: undefined;
            name?: undefined;
            arguments?: undefined;
        } | {
            type: string;
            id: string;
            name: string;
            arguments: {
                command: string;
                filename: string;
                title: string;
                content: string;
            };
            text?: undefined;
        })[];
        api: string;
        provider: string;
        model: string;
        usage: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            cost: {
                input: number;
                output: number;
                cacheRead: number;
                cacheWrite: number;
                total: number;
            };
        };
        stopReason: string;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
        details?: undefined;
        errorMessage?: undefined;
    } | {
        role: string;
        content: {
            type: string;
            id: string;
            name: string;
            arguments: {
                command: string;
                filename: string;
                old_str: string;
                new_str: string;
            };
        }[];
        api: string;
        provider: string;
        model: string;
        usage: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            cost: {
                input: number;
                output: number;
                cacheRead: number;
                cacheWrite: number;
                total: number;
            };
        };
        stopReason: string;
        toolCallId?: undefined;
        toolName?: undefined;
        output?: undefined;
        isError?: undefined;
        details?: undefined;
        errorMessage?: undefined;
    })[];
};
//# sourceMappingURL=test-sessions.d.ts.map