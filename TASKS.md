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

## Phase 2a: Design system (DESIGN.md)
- [x] Step 1: shared shell (`src/core/shell.ts`, `styles/shell.css`); the blog uses it
- [x] Step 2: phone rules (fluid font under ~400px, safe area, tap targets, short window names; checked at 360 and 390)
- [x] Step 3: home charm (colors, status bar, keyboard navigation) merged in; home page gets the shell, a `whoami` block and command-style card titles
- [x] Step 4: blog card rows (kept as `date  title`, see DESIGN.md)
- [x] Step 5: rules into `AGENTS.md` and `DECISIONS.md`

## Phase 2c: Consistency (DESIGN.md)
- [x] Site map + page frame + `assertShell` guard
- [x] Shared status line (windows, clock, progress) and keys on every page
- [x] Blog index, post and not-found through the frame
- [x] Home as a session; home cards, blog card, keynav and card windows removed (card engine kept)
- [x] Experiments listing and the fluid dynamics page on the shell
- [x] Guards: site map vs `vite.config.js`, built pages have the shell; docs updated

## Phase 2b: Home page charm (done, then superseded: the home page is now a session, see Phase 2c; the card colors, window list and card keys it built were reworked or removed)
- [x] Color pass: card titles yellow, borders gray, binary footers dim gray, accent colors on art (card engine style spans; `<noscript>` follows)
- [x] tmux-style status bar on the home page: window list `1:about 2:projects 3:blog ...` (focused one marked) + live clock; shares its CSS with the blog status line
- [x] Keyboard navigation: h/j/k/l or arrows move a highlight between cards (focused border turns yellow), Enter follows the card's first link, 1-5 jump to a card, Esc clears

### Home page ideas (parked, in rough priority; user liked all of them)
- Command prompt `$ _` on the home page: `help`, `ls`, `blog`, `cat about`, `theme`; the place for easter eggs (`sudo`, `xyzzy`, `rm -rf /`, random `fortune` line)
- Boot sequence on the first visit per session: a few typed lines (`1000110.xyz cyberdeck v0.1 ... ok`), then the cards print in; skippable with any key; keep it short
- Living cards: clock, a "now" card (building / listening), the typewriter typing a line, animated art; the Oracle is the big version
- Later, on the blog: table-of-contents widget card beside a post (wide screens), build-time `<noscript>` posts

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

## Phase 6: Blog admin (needs a plan and a user decision on storage before any code)
- [ ] `/admin/` page, protected by Pocket ID, to add, edit and delete blog posts: write in the browser (textarea with a live preview that uses the blog's own `renderMarkdown` and styles) or upload raw `.md` files. Notes from the first discussion:
  - Where posts live after an edit is the big decision. A: the admin service commits the `.md` to the repo (fine-grained GitHub token, `contents:write`, limited to `src/features/blog/posts/`); the existing CI check + deploy publishes it in about a minute, git stays the single source of truth and CI rejects bad frontmatter (recommended). B: posts are files on the server and the blog fetches them at runtime (instant, but reverses the "bundled at build time" decision, posts leave git, RSS/post index must be generated server side).
  - Needs a small backend (the Oracle task needs one too; share the container and Traefik setup). Pocket ID is OIDC, so Traefik forward auth (oauth2-proxy or tinyauth) must protect both `/admin/` and its API; the server re-validates every upload with the same `parsePost` rules (slug, date, size limit, `.md` only).
  - Drafts: add `draft: true` to the frontmatter; drafts show in the admin list only, never in the public blog, home or RSS.
  - Images are not supported by the Markdown subset yet; uploading assets will come up as soon as posts want pictures.
  - Design: a normal shell page (`renderPage`, a `site.ts` entry), but private: add a `hidden` flag to the site map so it gets no status line window and no crumbs link. Listing like `ls -l ~/blog` with drafts marked, editor as `$ vim posts/<slug>.md`. Must work on a phone (writing from the couch is the point).
  - Secrets (client id and secret, GitHub token) live in the server's environment, never in the repo.

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

### Session 8 (2026-10-09)
- Done: home page charm 1-3 (branch `feat/home-charm`): card color styles, tmux-style status bar with clock, h/j/k/l + number-key navigation with a yellow focus border. Ideas 4-6 stay parked in this file. Not yet eyeballed by the user.
- Next: user looks at the home page; then Phase 2 "RSS feed script" or the parked home ideas (command prompt first).

### Session 9b (2026-10-10)
- Done: whole redesign in PR #14: #12 merged into the branch (and closed), phone rules, home page on the shell (`src/home.ts`, command-style card titles, whoami block), blog rows are full-width links, DESIGN.md/AGENTS.md/DECISIONS.md updated. Checked in the browser at desktop, 390px and 360px (narrow iframes; real phones and `pointer: coarse` still untested).
- Next: user looks on a real phone; then Phase 2 "RSS feed script" or the parked home ideas (command prompt first).

### Session 10 (2026-10-10)
- Done (branch `feat/consistency`): every page (home, blog index/post/not found, experiments, fluid dynamics) goes through `renderPage` and one status line; home is a session; cards retired from pages (engine kept); guard tests added. Checked in the browser at desktop and 360px; real phones still untested.
- Next: user looks; then Phase 2 "RSS feed script" (can also generate the post index the home page needs later) or the parked home ideas (command prompt first).
- Also: the two sample posts (`hello-world`, `markdown-demo`) are removed; `posts/` keeps a `.gitkeep`, so the blog and the home blog section show "(nothing here yet)" until the first real post. Tests no longer depend on bundled posts (`blog-rows.test.ts` uses fixtures). Markdown features are still shown in `tests/blog-markdown.test.ts`.
