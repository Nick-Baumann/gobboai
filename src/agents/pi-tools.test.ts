import { describe, expect, it } from "vitest";
import { createClawdisCodingTools } from "./pi-tools.js";

describe("createClawdisCodingTools", () => {
  it("merges properties for union tool schemas", () => {
    const tools = createClawdisCodingTools();
    const browser = tools.find((tool) => tool.name === "clawdis_browser");
    expect(browser).toBeDefined();
    const parameters = browser?.parameters as {
      anyOf?: unknown[];
      properties?: Record<string, unknown>;
      required?: string[];
    };
    expect(parameters.anyOf?.length ?? 0).toBeGreaterThan(0);
    expect(parameters.properties?.action).toBeDefined();
    expect(parameters.properties?.controlUrl).toBeDefined();
    expect(parameters.properties?.targetUrl).toBeDefined();
    expect(parameters.properties?.request).toBeDefined();
    expect(parameters.required ?? []).toContain("action");
  });
});
