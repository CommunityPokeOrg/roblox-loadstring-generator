# Roblox Loadstring Generator

**Live app:** https://communitypokeorg.github.io/roblox-loadstring-generator/

Paste a link to a `.lua` script, get a clean one-line snippet for your Roblox
executor:

```lua
loadstring(game:HttpGet("https://example.com/script.lua"))()
```

The app never fetches or executes the URL — it only formats it into a snippet.
Quotes, backslashes, and control characters in the URL are escaped so they
can't break out of the Lua string.

## Usage

1. Open the app (see **Development** below to run it locally).
2. Paste a `http://` or `https://` script URL into the input.
3. The snippet is generated live — hit **Copy** and paste it into your
   executor.

Missing `https://` is filled in automatically. Anything that isn't a valid
http(s) URL is rejected with an inline error.

## Development

Requires Node.js 20+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server
```

## Checks

```bash
npm run build    # typecheck (tsc --noEmit) + production build to dist/
npm test         # run the vitest unit tests for URL validation/escaping
npm run preview  # serve the production build locally
```

## Stack

Vanilla TypeScript + Vite + Vitest. No framework, no runtime dependencies —
the whole app is a single static page in `index.html` + `src/`.
