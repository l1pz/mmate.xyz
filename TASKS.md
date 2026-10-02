# Project Tasks & Living Roadmap — mmate.xyz

> **How to use this file**:
> - At the start of each session, pick ONE pending task.
> - At the end of each session, mark it `[x]` and log a 2-line summary in the **Session Handoff Log** at the bottom.
> - If requirements change, simply update, reorder, or add tasks here.

---

## Phase 0: Workflow & Tooling Foundation
- [x] Set up modern lightweight build system (Vite + package.json + .gitignore)
- [x] Create project AI pair programming rules (`AGENTS.md`)
- [x] Document system architecture and coordinate buffer (`ARCHITECTURE.md`)
- [x] Establish living task roadmap (`TASKS.md`)

---

## Phase 1: Core Engine Modernization & Bugfixes
- [ ] Fix border alignment and method overloading bug in `src/card.js`
- [ ] Add interactive binary decoder animation on click/hover for card footers
- [ ] Enable JGS font option / toggle alongside Space Mono
- [ ] Verify Vite dev and build commands pass cleanly with all assets

---

## Phase 2: The Blog Engine ("Digital Zine / Man Page Pager")
- [ ] Create markdown loader with frontmatter parser (title, date, tags, slug)
- [ ] Build ASCII-styled article card for the home grid
- [ ] Build TUI modal reading view with ASCII borders, syntax highlighting, and progress meter
- [ ] Add RSS / Atom feed generator script

---

## Phase 3: Swiss Army Knife Developer Tools
- [ ] **Binary & Cipher Playground**: Interactive tool to encode/decode Binary, Base64, Hex, and ROT13
- [ ] **Image-to-ASCII / Dither Studio**: Client-side Floyd-Steinberg dither & ASCII converter with Gruvbox palette export
- [ ] **Revive Fluid Dynamics / ASCII Physics**: Complete the canvas fluid simulation or ASCII particle grid
- [ ] **Dev Scratchpad**: LocalStorage-persisted markdown scratchpad & JSON formatter

---

## Phase 4: Image Gallery ("Dither & ASCII Visualizer")
- [ ] Create gallery card on the dashboard
- [ ] Implement dual-view photo visualizer: Dithered/ASCII preview <-> Crisp raw photo reveal
- [ ] Populate curated photo albums

---

## Phase 5: AI Integration & Atmospheric Polish
- [ ] In-terminal AI companion ("mate-bot" / "the oracle") with streaming teletype response
- [ ] Optional retro CRT scanline / phosphor glow toggle
- [ ] Optional Web Audio mechanical key click / ambient synth sounds

---

## Session Handoff Log
### Session 0 (2026-10-02)
- **Completed**: Cloned repository, audited codebase, established AI development workflow, created `package.json`, `.gitignore`, `AGENTS.md`, `ARCHITECTURE.md`, and `TASKS.md`.
- **Next Up**: Phase 1 (Fix border alignment & method overloading in `src/card.js`, test with Vite).
