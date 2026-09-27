import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages project sites
// (served from /<repo>/) as well as any custom domain or local preview.
export default defineConfig({
  base: './',
})
