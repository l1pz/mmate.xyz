# Tasks

Pick the first unchecked task. One task per session. Log a 2-line handoff at the bottom.

## Phase 0: Foundation
- [x] Vite, AGENTS/ARCHITECTURE/TASKS docs
- [x] TypeScript, Biome, Vitest, `npm run check`, build guard test
- [x] `public/` assets, multi-page `vite.config.js`, CSS color variables
- [x] Card engine rewritten: no duplicate methods, escaped HTML, bounds errors, tests
- [x] Review and approve the "feature modules" plan in `ARCHITECTURE.md`
- [ ] Add GitHub Actions CI running `npm run check`; decide hosting and add deploy
- [ ] Fill in real contact info (phone placeholder) and make the `<noscript>` fallback match the JS cards (consider generating it at build time)

## Phase 1: Engine polish
- [ ] Decide: bring back ASCII borders on cards? (see DECISIONS.md)
- [ ] Binary footer decode animation on hover/click
- [ ] JGS font toggle next to Space Mono

## Phase 2: Blog
- [ ] Markdown loader + frontmatter (title, date, tags, slug)
- [ ] Blog card on home grid
- [ ] TUI reading view with progress meter
- [ ] RSS feed script

## Phase 3: Tools
- [ ] Binary / Base64 / Hex / ROT13 playground
- [ ] Image to ASCII / dither studio
- [ ] Fluid dynamics experiment (currently an empty stub)
- [ ] Scratchpad + JSON formatter

## Phase 4: Gallery
- [ ] Gallery card, dither/ASCII <-> raw photo view, albums

## Phase 5: Polish
- [ ] "Oracle" AI companion (needs a backend/proxy decision first)
- [ ] CRT scanline/glow toggle
- [ ] Optional key-click sounds

## Handoff log
### Session 1 (2026-10-02)
- Done: Phase 0 foundation above (branch `chore/foundation`). `npm run check` passes.
- Next: user reviews the feature-module plan; then CI/hosting.

### Session 2 (2026-10-02)
- Done: user approved the feature-module plan; recorded in DECISIONS.md, ARCHITECTURE.md marked approved.
- Next: GitHub Actions CI + hosting decision (needs user input on host).
