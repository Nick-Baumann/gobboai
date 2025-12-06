import { LitElement } from "lit";
export class ArtifactElement extends LitElement {
    constructor() {
        super(...arguments);
        this.filename = "";
    }
    createRenderRoot() {
        return this; // light DOM for shared styles
    }
}
//# sourceMappingURL=ArtifactElement.js.map