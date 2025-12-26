import { describe, expect, it } from "vitest";

import { stripHeartbeatToken } from "./heartbeat.js";
import { HEARTBEAT_TOKEN } from "./tokens.js";

describe("stripHeartbeatToken", () => {
  it("skips empty or token-only replies", () => {
    expect(stripHeartbeatToken(undefined)).toEqual({
      shouldSkip: true,
      text: "",
    });
    expect(stripHeartbeatToken("  ")).toEqual({
      shouldSkip: true,
      text: "",
    });
    expect(stripHeartbeatToken(HEARTBEAT_TOKEN)).toEqual({
      shouldSkip: true,
      text: "",
    });
  });

  it("keeps content and removes token when mixed", () => {
    expect(stripHeartbeatToken(`ALERT ${HEARTBEAT_TOKEN}`)).toEqual({
      shouldSkip: false,
      text: "ALERT",
    });
    expect(stripHeartbeatToken("hello")).toEqual({
      shouldSkip: false,
      text: "hello",
    });
  });

  it("strips repeated OK tails after heartbeat token", () => {
    expect(stripHeartbeatToken("HEARTBEAT_OK_OK_OK")).toEqual({
      shouldSkip: true,
      text: "",
    });
    expect(stripHeartbeatToken("HEARTBEAT_OK_OK")).toEqual({
      shouldSkip: true,
      text: "",
    });
    expect(stripHeartbeatToken("HEARTBEAT_OK _OK")).toEqual({
      shouldSkip: true,
      text: "",
    });
    expect(stripHeartbeatToken("HEARTBEAT_OK OK")).toEqual({
      shouldSkip: true,
      text: "",
    });
    expect(stripHeartbeatToken("ALERT HEARTBEAT_OK_OK")).toEqual({
      shouldSkip: false,
      text: "ALERT",
    });
  });
});
