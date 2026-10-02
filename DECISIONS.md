# Decisions (settled; ask before changing)

| Date | Decision | Why |
|------|----------|-----|
| 2026-10-02 | TypeScript + Vite, no frameworks | Types catch AI mistakes; zero runtime cost |
| 2026-10-02 | Biome for lint/format, Vitest for tests, all behind `npm run check` | One command tells the AI whether it broke something |
| 2026-10-02 | ASCII art is bundled via `import.meta.glob` from `src/ascii-art/` (no fetching); every HTML page is listed in `vite.config.js` | Runtime fetching looped forever in dev (Vite answers missing files with index.html) |
| 2026-10-02 | Card text goes through `toHtml()` which escapes everything; links are placed by position | Old string-replace broke on `<`, `&` and duplicate words |
| 2026-10-02 | Card borders are currently NOT drawn (frames were commented out in the old code) | Revisit as a design task if wanted |
