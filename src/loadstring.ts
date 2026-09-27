export type UrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Escapes a string for embedding inside a Lua double-quoted string literal.
 * `"` and `\` are escaped, common whitespace uses short escapes, and every
 * other control character becomes a 3-digit decimal escape (`\ddd`) so a
 * following digit can never be swallowed into the escape sequence.
 */
export function escapeLuaString(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0)!;
    if (ch === '"') out += '\\"';
    else if (ch === "\\") out += "\\\\";
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch === "\t") out += "\\t";
    else if (code < 0x20 || code === 0x7f) out += `\\${String(code).padStart(3, "0")}`;
    else out += ch;
  }
  return out;
}

/**
 * Validates user input as an http(s) script URL. A missing scheme is treated
 * as https:// for convenience. Never fetches the URL.
 */
export function validateScriptUrl(raw: string): UrlResult {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Enter a script URL." };

  let parsed: URL;
  try {
    parsed = new URL(input.includes("://") ? input : `https://${input}`);
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http:// and https:// URLs are supported." };
  }
  if (!parsed.hostname) {
    return { ok: false, error: "That URL is missing a host." };
  }
  if (/\s/.test(input)) {
    return { ok: false, error: "URLs can't contain spaces." };
  }

  return { ok: true, url: parsed.href };
}

/** Builds the one-line executor snippet for a validated URL. */
export function buildLoadstring(url: string): string {
  return `loadstring(game:HttpGet("${escapeLuaString(url)}"))()`;
}
