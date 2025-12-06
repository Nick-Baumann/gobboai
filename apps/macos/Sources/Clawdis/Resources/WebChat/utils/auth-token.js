import PromptDialog from "@mariozechner/mini-lit/dist/PromptDialog.js";
import { i18n } from "./i18n.js";
export async function getAuthToken() {
    let authToken = localStorage.getItem(`auth-token`) || "";
    if (authToken)
        return authToken;
    while (true) {
        authToken = (await PromptDialog.ask(i18n("Enter Auth Token"), i18n("Please enter your auth token."), "", true))?.trim();
        if (authToken) {
            localStorage.setItem(`auth-token`, authToken);
            break;
        }
    }
    return authToken?.trim() || undefined;
}
export async function clearAuthToken() {
    localStorage.removeItem(`auth-token`);
}
//# sourceMappingURL=auth-token.js.map