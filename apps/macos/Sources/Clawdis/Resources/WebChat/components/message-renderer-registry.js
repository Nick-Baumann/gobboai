// Registry of custom message renderers by role
const messageRenderers = new Map();
export function registerMessageRenderer(role, renderer) {
    messageRenderers.set(role, renderer);
}
export function getMessageRenderer(role) {
    return messageRenderers.get(role);
}
export function renderMessage(message) {
    return messageRenderers.get(message.role)?.render(message);
}
//# sourceMappingURL=message-renderer-registry.js.map