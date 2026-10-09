# Tasks

Pick the first unchecked task. One task per session. Log a 2-line handoff at the bottom.

## Phase 0: Foundation
- [x] Vite, AGENTS/ARCHITECTURE/TASKS docs
- [x] TypeScript, Biome, Vitest, `npm run check`, build guard test
- [x] `public/` assets, multi-page `vite.config.js`, CSS color variables
- [x] Card engine rewritten: no duplicate methods, escaped HTML, bounds errors, tests
- [x] Review and approve the "feature modules" plan in `ARCHITECTURE.md`
- [x] Add GitHub Actions CI running `npm run check`; decide hosting and add deploy
- [x] Fill in real contact info (phone placeholder) and make the `<noscript>` fallback match the JS cards (consider generating it at build time)
- [x] Tiny: bring back the fake phone line `phone: +36 xx xxx xxxx` (the +36 shows Hungary; never a real number) in the JS contact card and the `<noscript>` copy. Keep it the same in both and keep the card at 32 rows x 41 cols (remove the 2 extra blank rows added before the binary footer)

## Phase 1: Engine polish
- [x] Border styles (none, retro, ascii, single, double, rounded); rounded is hardcoded, toggle removed
- [x] Pick a font with full box-drawing coverage (DejaVu Sans Mono) and fix the `/fonts/stylesheet.css` 404 (fonts moved to `public/fonts/`)
- [x] Card footer system: `drawFooter` anchors the 4-line binary footer at the bottom; home cards use it
- [x] JGS font: tried as the only font and rejected (hard to read); no toggle wanted, DejaVu Sans Mono stays

## Phase 2: Blog
- [x] Markdown loader + frontmatter (title, date, tags, slug)
- [x] Blog card on home grid
- [x] TUI reading view with progress meter (pager-style page, not a card; see DECISIONS.md)
- [ ] RSS feed script

## Phase 3: Tools
- [ ] Binary / Base64 / Hex / ROT13 playground
- [ ] Image to ASCII / dither studio
- [ ] Fluid dynamics experiment (currently an empty stub)
- [ ] Scratchpad + JSON formatter

## Phase 4: Gallery
- [ ] Gallery card, dither/ASCII <-> raw photo view, albums

## Phase 5: Polish
- [ ] "Oracle": a small model thinking out loud 24/7, streamed to a card. One generator on the server (llama.cpp, in-process via llama-cpp-python, FastAPI, SSE broadcast, ring buffer so new visitors see text at once, connection cap, heartbeat), no visitor input. Output must be coherent: test candidate models (SmolLM2-360M, Llama 3.2 1B, Qwen2.5 1.5B, Gemma 3 1B) before choosing; RAM budget ~1.5 GB, low CPU (nice 19, throttled tokens, optional pause when nobody watches), Docker mem/cpu limits, Traefik, canned-line fallback in the card
- [ ] CRT scanline/glow toggle
- [ ] Optional key-click sounds

## Handoff log
### Session 1 (2026-10-02)
- Done: Phase 0 foundation above (branch `chore/foundation`). `npm run check` passes.
- Next: user reviews the feature-module plan; then CI/hosting.

### Session 2 (2026-10-02)
- Done: user approved the feature-module plan; recorded in DECISIONS.md, ARCHITECTURE.md marked approved.
- Done: CI + deploy live. Merging to `main` rsyncs `dist/` to the netcup server (nginx container behind Traefik, `https://1000110.xyz`) as a restricted `deploy` user; see DECISIONS.md. Site renamed to 1000110.xyz.
- Next: contact card done (see Session 3); then Phase 1.

### Session 3 (2026-10-02)
- Done: phone removed (user won't share it), email is mmateka89@gmail.com in JS card and noscript; repo renamed to l1pz/1000110.xyz; `.gitattributes` forces LF (CRLF checkouts broke Biome on Windows). Noscript is still hand-written: generating it at build time stays an open idea.
- Next: Phase 1, "Decide: bring back ASCII borders on cards?" (needs a user decision).

### Session 3b (2026-10-02)
- Done: fake `phone: +36 xx xxx xxxx` restored in JS card and noscript; the 2 extra blank rows removed; `npm run check` passes. Not yet eyeballed in `npm run dev`.
- Next: Phase 1, "Decide: bring back ASCII borders on cards?" (needs a user decision).

### Session 4 (2026-10-02)
- Done: border styles as data (`src/borders.ts`), home cards in `src/cards.ts`, tests for all styles; rounded hardcoded; noscript cards carry the same frame. Toggle was built and removed.
- Next: Phase 1 binary footer decode animation (first unchecked).
- Also done: DejaVu Sans Mono replaces Space Mono (fixes unicode borders); `fonts/` moved to `public/fonts/` (was 404 in prod); one constant card gap (`gap: 1em 2ch`). Unifont tried and rejected.

### Session 4b (2026-10-02)
- Done: `<noscript>` cards are generated from `src/cards.ts` by `plugins/noscript-cards.js` (build and dev); 128 hand-written lines gone; build test covers it. Restart a running `npm run dev` to load the plugin.
- Next: Phase 2, "Markdown loader + frontmatter" (first unchecked; needs a plan shown in the terminal first).

### Session 5 (2026-10-02)
- Done: blog loader in `src/features/blog/` (`frontmatter.ts` hand-written parser, `posts.ts` bundles `posts/*.md` via glob, `getPosts()` newest first, `getPost(slug)`); sample post and tests. `npm run check` passes.
- Next: Phase 2, "Blog card on home grid" (needs the feature module `card()` export and a plan shown in the terminal first).

### Session 6b (2026-10-09)
- Done: `Card.drawFooter` (branch `feat/card-footer`); aboutme/projects/contact use it with byte-identical output. `experiments.ts` still uses `drawBinaryTextCentered` (28-char message, 7 lines): not a standard footer, left alone.
- Next: the `art` card has no footer yet (one `drawFooter` line when wanted).

### Session 6 (2026-10-09)
- Done: blog card (`src/features/blog/index.ts`, `buildBlogCard`): newest 5 posts, each row links to `/blog/#slug`; wired into `buildHomeCards` (so noscript follows), `index.html`, typewriter art, `drawFooter` binary footer, tests. Not yet eyeballed in `npm run dev`.
- Next: Phase 2, "TUI reading view with progress meter" (the `/blog/` page; needs `page` on the feature object, a new HTML page in `vite.config.js`, and a plan shown in the terminal first).

### Session 7 (2026-10-09)
- Done: `/blog/` reader (branch `feat/blog-reader`): list as `ls -l`, post view with man-page header, boxed code, status line with progress meter, vim-style keys; `markdown.ts` + `page.ts` with tests. `markdown-demo.md` is a sample post to delete before real posts. Not yet eyeballed by the user.
- Next: Phase 2, "RSS feed script". Possible follow-ups: build-time `<noscript>` posts, table-of-contents widget card.

### Session 9 (2026-10-10)
- Done: DESIGN.md approved and merged (PR #13); design system step 1 (branch `feat/shell`): `src/core/{html,shell}.ts`, `styles/shell.css`, blog refactored onto them with no visual change (checked in the browser). PR #12 (home charm) is still open and waits for the rebase in step 3; it has its own `styles/status.css` which must be folded into `shell.css`.
- Next: step 2, phone rules.
