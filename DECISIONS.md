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
| 2026-10-02 | Card borders are currently NOT drawn (frames were commented out in the old code) | Revisit as a design task if wanted |
