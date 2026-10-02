# Decisions (settled; ask before changing)

| Date | Decision | Why |
|------|----------|-----|
| 2026-10-02 | TypeScript + Vite, no frameworks | Types catch AI mistakes; zero runtime cost |
| 2026-10-02 | Biome for lint/format, Vitest for tests, all behind `npm run check` | One command tells the AI whether it broke something |
| 2026-10-02 | ASCII art is bundled via `import.meta.glob` from `src/ascii-art/` (no fetching); every HTML page is listed in `vite.config.js` | Runtime fetching looped forever in dev (Vite answers missing files with index.html) |
| 2026-10-02 | Card text goes through `toHtml()` which escapes everything; links are placed by position | Old string-replace broke on `<`, `&` and duplicate words |
| 2026-10-02 | Features are folders `src/features/<name>/` exporting one object (`id`, `card()`, optional `page`); features never import each other, shared code in `src/core/` | Keeps each AI session inside one folder (see ARCHITECTURE.md) |
| 2026-10-02 | Oracle is a broadcast, not a chat: one self-hosted small model streams its "thoughts" to all visitors via SSE; no visitor input, no paid APIs | Cost and abuse do not grow with visitors; coherence matters more than the smallest footprint |
| 2026-10-02 | Hosting: own netcup server, domain 1000110.xyz. Traefik is the only reverse proxy; site is an `nginx:alpine` container (stack `/opt/stacks/1000110-xyz`) serving a bind-mounted `dist/`. CI rsyncs `dist/` as an unprivileged `deploy` user restricted by rrsync to that directory (`deploy/setup-server.sh`) | No second proxy; deploy is a file sync; a leaked CI key cannot reach Docker |
| 2026-10-02 | `.gitattributes` forces LF line endings everywhere | Windows CRLF checkouts made `npm run check` fail locally while CI passed |
| 2026-10-02 | Font is JGS `jgs7` at 14px (its native pixel grid: 7px cells, self-hosted in `public/fonts/`), no font toggle. It is monospaced and has every glyph the site draws, including the rounded box characters; it lacks ő/ű and braille. Tried and rejected: Space Mono (no box drawing, misaligned borders), DejaVu Sans Mono (full glyphs but plain), GNU Unifont (bitmap look bad in a browser). One font for the whole grid because fallback fonts have other widths | The user wants the JGS pixel look; checked glyph coverage against every character in the art and cards |
| 2026-10-02 | `<noscript>` cards are generated at build/dev time from `src/cards.ts` by `plugins/noscript-cards.js`, never written by hand; the border is hardcoded once in `buildHomeCards` | One source for both versions; the hand-written copy had to be edited for every card change |
| 2026-10-02 | The binary footers stay hidden easter eggs: no decode animation, no hints, no hover/click reveal | The charm is that visitors find and decode them themselves |
| 2026-10-02 | Cards use the `rounded` border, hardcoded in `src/index.ts`. Styles (none, retro, ascii, single, double, rounded) stay as data in `src/borders.ts`; `<noscript>` cards carry the same rounded frame. The toggle (key `b`, localStorage setting) was built, tried and removed | The user wants one fixed look for now; re-adding a toggle is easy because styles are data |
