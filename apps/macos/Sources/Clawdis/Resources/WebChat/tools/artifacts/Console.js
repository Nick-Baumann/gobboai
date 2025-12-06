var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { icon } from "@mariozechner/mini-lit";
import "@mariozechner/mini-lit/dist/CopyButton.js";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { ChevronDown, ChevronRight, ChevronsDown, Lock } from "lucide";
import { i18n } from "../../utils/i18n.js";
let Console = class Console extends LitElement {
    constructor() {
        super(...arguments);
        this.logs = [];
        this.expanded = false;
        this.autoscroll = true;
        this.logsContainerRef = createRef();
    }
    createRenderRoot() {
        return this; // light DOM
    }
    updated() {
        // Autoscroll to bottom when new logs arrive
        if (this.autoscroll && this.expanded && this.logsContainerRef.value) {
            this.logsContainerRef.value.scrollTop = this.logsContainerRef.value.scrollHeight;
        }
    }
    getLogsText() {
        return this.logs.map((l) => `[${l.type}] ${l.text}`).join("\n");
    }
    render() {
        const errorCount = this.logs.filter((l) => l.type === "error").length;
        const summary = errorCount > 0
            ? `${i18n("console")} (${errorCount} ${errorCount === 1 ? "error" : "errors"})`
            : `${i18n("console")} (${this.logs.length})`;
        return html `
			<div class="border-t border-border p-2">
				<div class="flex items-center gap-2 w-full">
					<button
						@click=${() => {
            this.expanded = !this.expanded;
        }}
						class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex-1 text-left"
					>
						${icon(this.expanded ? ChevronDown : ChevronRight, "sm")}
						<span>${summary}</span>
					</button>
					${this.expanded
            ? html `
							<button
								@click=${() => {
                this.autoscroll = !this.autoscroll;
            }}
								class="p-1 rounded transition-colors ${this.autoscroll ? "bg-accent text-accent-foreground" : "hover:bg-muted"}"
								title=${this.autoscroll ? i18n("Autoscroll enabled") : i18n("Autoscroll disabled")}
							>
								${icon(this.autoscroll ? ChevronsDown : Lock, "sm")}
							</button>
							<copy-button .text=${this.getLogsText()} title=${i18n("Copy logs")} .showText=${false} class="!bg-transparent hover:!bg-accent"></copy-button>
						`
            : ""}
				</div>
				${this.expanded
            ? html `
						<div class="max-h-48 overflow-y-auto space-y-1 mt-2" ${ref(this.logsContainerRef)}>
							${repeat(this.logs, (_log, index) => index, (log) => html `
									<div class="text-xs font-mono ${log.type === "error" ? "text-destructive" : "text-muted-foreground"}">
										[${log.type}] ${log.text}
									</div>
								`)}
						</div>
					`
            : ""}
			</div>
		`;
    }
};
__decorate([
    property({ attribute: false })
], Console.prototype, "logs", void 0);
__decorate([
    state()
], Console.prototype, "expanded", void 0);
__decorate([
    state()
], Console.prototype, "autoscroll", void 0);
Console = __decorate([
    customElement("artifact-console")
], Console);
export { Console };
//# sourceMappingURL=Console.js.map