import { describe, expect, it } from "vitest";
import { buildLoadstring, escapeLuaString, validateScriptUrl } from "./loadstring";

describe("validateScriptUrl", () => {
  it("accepts a plain https URL", () => {
    expect(validateScriptUrl("https://example.com/script.lua")).toEqual({
      ok: true,
      url: "https://example.com/script.lua",
    });
  });

  it("fills in https:// when the scheme is missing", () => {
    expect(validateScriptUrl("example.com/script.lua")).toEqual({
      ok: true,
      url: "https://example.com/script.lua",
    });
  });

  it("rejects empty input", () => {
    expect(validateScriptUrl("   ").ok).toBe(false);
  });

  it("rejects non-http schemes", () => {
    expect(validateScriptUrl("ftp://example.com/x.lua").ok).toBe(false);
    expect(validateScriptUrl("javascript:alert(1)").ok).toBe(false);
  });

  it("rejects garbage and spaces", () => {
    expect(validateScriptUrl("not a url").ok).toBe(false);
    expect(validateScriptUrl("https://exam ple.com").ok).toBe(false);
  });
});

describe("escapeLuaString", () => {
  it("escapes double quotes", () => {
    expect(escapeLuaString('a"b')).toBe('a\\"b');
  });

  it("escapes backslashes", () => {
    expect(escapeLuaString("a\\b")).toBe("a\\\\b");
  });

  it("escapes newlines and tabs", () => {
    expect(escapeLuaString("a\nb\tc\rd")).toBe("a\\nb\\tc\\rd");
  });

  it("zero-pads control characters so following digits are safe", () => {
    // \x01 followed by "9" must not merge into \019
    expect(escapeLuaString("\x019")).toBe("\\0019");
  });

  it("leaves ordinary characters alone", () => {
    expect(escapeLuaString("https://x.y/z.lua?q=1&p=2")).toBe(
      "https://x.y/z.lua?q=1&p=2",
    );
  });
});

describe("buildLoadstring", () => {
  it("produces the canonical snippet", () => {
    expect(buildLoadstring("https://example.com/script.lua")).toBe(
      'loadstring(game:HttpGet("https://example.com/script.lua"))()',
    );
  });

  it("keeps quotes inside the URL from breaking the string", () => {
    const snippet = buildLoadstring('https://example.com/a"b.lua');
    expect(snippet).toBe(
      'loadstring(game:HttpGet("https://example.com/a\\"b.lua"))()',
    );
  });
});
