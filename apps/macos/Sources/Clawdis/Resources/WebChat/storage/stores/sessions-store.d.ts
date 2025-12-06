import type { AgentState } from "../../agent/agent.js";
import { Store } from "../store.js";
import type { SessionData, SessionMetadata, StoreConfig } from "../types.js";
/**
 * Store for chat sessions (data and metadata).
 * Uses two object stores: sessions (full data) and sessions-metadata (lightweight).
 */
export declare class SessionsStore extends Store {
    getConfig(): StoreConfig;
    /**
     * Additional config for sessions-metadata store.
     * Must be included when creating the backend.
     */
    static getMetadataConfig(): StoreConfig;
    save(data: SessionData, metadata: SessionMetadata): Promise<void>;
    get(id: string): Promise<SessionData | null>;
    getMetadata(id: string): Promise<SessionMetadata | null>;
    getAllMetadata(): Promise<SessionMetadata[]>;
    delete(id: string): Promise<void>;
    deleteSession(id: string): Promise<void>;
    updateTitle(id: string, title: string): Promise<void>;
    getQuotaInfo(): Promise<{
        usage: number;
        quota: number;
        percent: number;
    }>;
    requestPersistence(): Promise<boolean>;
    saveSession(id: string, state: AgentState, metadata: SessionMetadata | undefined, title?: string): Promise<void>;
    loadSession(id: string): Promise<SessionData | null>;
    getLatestSessionId(): Promise<string | null>;
}
//# sourceMappingURL=sessions-store.d.ts.map