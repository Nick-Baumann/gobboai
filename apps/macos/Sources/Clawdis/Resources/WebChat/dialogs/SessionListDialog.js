var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SessionListDialog_1;
import { DialogContent, DialogHeader } from "@mariozechner/mini-lit/dist/Dialog.js";
import { DialogBase } from "@mariozechner/mini-lit/dist/DialogBase.js";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { getAppStorage } from "../storage/app-storage.js";
import { formatUsage } from "../utils/format.js";
import { i18n } from "../utils/i18n.js";
let SessionListDialog = SessionListDialog_1 = class SessionListDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.sessions = [];
        this.loading = true;
        this.deletedSessions = new Set();
        this.closedViaSelection = false;
        this.modalWidth = "min(600px, 90vw)";
        this.modalHeight = "min(700px, 90vh)";
    }
    static async open(onSelect, onDelete) {
        const dialog = new SessionListDialog_1();
        dialog.onSelectCallback = onSelect;
        dialog.onDeleteCallback = onDelete;
        dialog.open();
        await dialog.loadSessions();
    }
    async loadSessions() {
        this.loading = true;
        try {
            const storage = getAppStorage();
            this.sessions = await storage.sessions.getAllMetadata();
        }
        catch (err) {
            console.error("Failed to load sessions:", err);
            this.sessions = [];
        }
        finally {
            this.loading = false;
        }
    }
    async handleDelete(sessionId, event) {
        event.stopPropagation();
        if (!confirm(i18n("Delete this session?"))) {
            return;
        }
        try {
            const storage = getAppStorage();
            if (!storage.sessions)
                return;
            await storage.sessions.deleteSession(sessionId);
            await this.loadSessions();
            // Track deleted session
            this.deletedSessions.add(sessionId);
        }
        catch (err) {
            console.error("Failed to delete session:", err);
        }
    }
    close() {
        super.close();
        // Only notify about deleted sessions if dialog wasn't closed via selection
        if (!this.closedViaSelection && this.onDeleteCallback && this.deletedSessions.size > 0) {
            for (const sessionId of this.deletedSessions) {
                this.onDeleteCallback(sessionId);
            }
        }
    }
    handleSelect(sessionId) {
        this.closedViaSelection = true;
        if (this.onSelectCallback) {
            this.onSelectCallback(sessionId);
        }
        this.close();
    }
    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return i18n("Today");
        }
        else if (days === 1) {
            return i18n("Yesterday");
        }
        else if (days < 7) {
            return i18n("{days} days ago").replace("{days}", days.toString());
        }
        else {
            return date.toLocaleDateString();
        }
    }
    renderContent() {
        return html `
			${DialogContent({
            className: "h-full flex flex-col",
            children: html `
					${DialogHeader({
                title: i18n("Sessions"),
                description: i18n("Load a previous conversation"),
            })}

					<div class="flex-1 overflow-y-auto mt-4 space-y-2">
						${this.loading
                ? html `<div class="text-center py-8 text-muted-foreground">${i18n("Loading...")}</div>`
                : this.sessions.length === 0
                    ? html `<div class="text-center py-8 text-muted-foreground">${i18n("No sessions yet")}</div>`
                    : this.sessions.map((session) => html `
											<div
												class="group flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors"
												@click=${() => this.handleSelect(session.id)}
											>
												<div class="flex-1 min-w-0">
													<div class="font-medium text-sm text-foreground truncate">${session.title}</div>
													<div class="text-xs text-muted-foreground mt-1">${this.formatDate(session.lastModified)}</div>
													<div class="text-xs text-muted-foreground mt-1">
														${session.messageCount} ${i18n("messages")} · ${formatUsage(session.usage)}
													</div>
												</div>
												<button
													class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-destructive transition-opacity"
													@click=${(e) => this.handleDelete(session.id, e)}
													title=${i18n("Delete")}
												>
													<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
														<path d="M3 6h18"></path>
														<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
														<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
													</svg>
												</button>
											</div>
										`)}
					</div>
				`,
        })}
		`;
    }
};
__decorate([
    state()
], SessionListDialog.prototype, "sessions", void 0);
__decorate([
    state()
], SessionListDialog.prototype, "loading", void 0);
SessionListDialog = SessionListDialog_1 = __decorate([
    customElement("session-list-dialog")
], SessionListDialog);
export { SessionListDialog };
//# sourceMappingURL=SessionListDialog.js.map