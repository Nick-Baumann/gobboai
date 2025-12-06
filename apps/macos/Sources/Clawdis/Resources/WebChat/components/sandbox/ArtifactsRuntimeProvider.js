import { ARTIFACTS_RUNTIME_PROVIDER_DESCRIPTION_RO, ARTIFACTS_RUNTIME_PROVIDER_DESCRIPTION_RW, } from "../../prompts/prompts.js";
/**
 * Artifacts Runtime Provider
 *
 * Provides programmatic access to session artifacts from sandboxed code.
 * Allows code to create, read, update, and delete artifacts dynamically.
 * Supports both online (extension) and offline (downloaded HTML) modes.
 */
export class ArtifactsRuntimeProvider {
    constructor(artifactsPanel, agent, readWrite = true) {
        this.artifactsPanel = artifactsPanel;
        this.agent = agent;
        this.readWrite = readWrite;
    }
    getData() {
        // Inject artifact snapshot for offline mode
        const snapshot = {};
        this.artifactsPanel.artifacts.forEach((artifact, filename) => {
            snapshot[filename] = artifact.content;
        });
        return { artifacts: snapshot };
    }
    getRuntime() {
        // This function will be stringified, so no external references!
        return (_sandboxId) => {
            // Auto-parse/stringify for .json files
            const isJsonFile = (filename) => filename.endsWith(".json");
            window.listArtifacts = async () => {
                // Online: ask extension
                if (window.sendRuntimeMessage) {
                    const response = await window.sendRuntimeMessage({
                        type: "artifact-operation",
                        action: "list",
                    });
                    if (!response.success)
                        throw new Error(response.error);
                    return response.result;
                }
                // Offline: return snapshot keys
                else {
                    return Object.keys(window.artifacts || {});
                }
            };
            window.getArtifact = async (filename) => {
                let content;
                // Online: ask extension
                if (window.sendRuntimeMessage) {
                    const response = await window.sendRuntimeMessage({
                        type: "artifact-operation",
                        action: "get",
                        filename,
                    });
                    if (!response.success)
                        throw new Error(response.error);
                    content = response.result;
                }
                // Offline: read snapshot
                else {
                    if (!window.artifacts?.[filename]) {
                        throw new Error(`Artifact not found (offline mode): ${filename}`);
                    }
                    content = window.artifacts[filename];
                }
                // Auto-parse .json files
                if (isJsonFile(filename)) {
                    try {
                        return JSON.parse(content);
                    }
                    catch (e) {
                        throw new Error(`Failed to parse JSON from ${filename}: ${e}`);
                    }
                }
                return content;
            };
            window.createOrUpdateArtifact = async (filename, content, mimeType) => {
                if (!window.sendRuntimeMessage) {
                    throw new Error("Cannot create/update artifacts in offline mode (read-only)");
                }
                let finalContent = content;
                // Auto-stringify .json files
                if (isJsonFile(filename) && typeof content !== "string") {
                    finalContent = JSON.stringify(content, null, 2);
                }
                else if (typeof content !== "string") {
                    finalContent = JSON.stringify(content, null, 2);
                }
                const response = await window.sendRuntimeMessage({
                    type: "artifact-operation",
                    action: "createOrUpdate",
                    filename,
                    content: finalContent,
                    mimeType,
                });
                if (!response.success)
                    throw new Error(response.error);
            };
            window.deleteArtifact = async (filename) => {
                if (!window.sendRuntimeMessage) {
                    throw new Error("Cannot delete artifacts in offline mode (read-only)");
                }
                const response = await window.sendRuntimeMessage({
                    type: "artifact-operation",
                    action: "delete",
                    filename,
                });
                if (!response.success)
                    throw new Error(response.error);
            };
        };
    }
    async handleMessage(message, respond) {
        if (message.type !== "artifact-operation") {
            return;
        }
        const { action, filename, content, mimeType } = message;
        try {
            switch (action) {
                case "list": {
                    const filenames = Array.from(this.artifactsPanel.artifacts.keys());
                    respond({ success: true, result: filenames });
                    break;
                }
                case "get": {
                    const artifact = this.artifactsPanel.artifacts.get(filename);
                    if (!artifact) {
                        respond({ success: false, error: `Artifact not found: ${filename}` });
                    }
                    else {
                        respond({ success: true, result: artifact.content });
                    }
                    break;
                }
                case "createOrUpdate": {
                    try {
                        const exists = this.artifactsPanel.artifacts.has(filename);
                        const command = exists ? "rewrite" : "create";
                        const action = exists ? "update" : "create";
                        await this.artifactsPanel.tool.execute("", {
                            command,
                            filename,
                            content,
                        });
                        this.agent?.appendMessage({
                            role: "artifact",
                            action,
                            filename,
                            content,
                            ...(action === "create" && { title: filename }),
                            timestamp: new Date().toISOString(),
                        });
                        respond({ success: true });
                    }
                    catch (err) {
                        respond({ success: false, error: err.message });
                    }
                    break;
                }
                case "delete": {
                    try {
                        await this.artifactsPanel.tool.execute("", {
                            command: "delete",
                            filename,
                        });
                        this.agent?.appendMessage({
                            role: "artifact",
                            action: "delete",
                            filename,
                            timestamp: new Date().toISOString(),
                        });
                        respond({ success: true });
                    }
                    catch (err) {
                        respond({ success: false, error: err.message });
                    }
                    break;
                }
                default:
                    respond({ success: false, error: `Unknown artifact action: ${action}` });
            }
        }
        catch (error) {
            respond({ success: false, error: error.message });
        }
    }
    getDescription() {
        return this.readWrite ? ARTIFACTS_RUNTIME_PROVIDER_DESCRIPTION_RW : ARTIFACTS_RUNTIME_PROVIDER_DESCRIPTION_RO;
    }
}
//# sourceMappingURL=ArtifactsRuntimeProvider.js.map