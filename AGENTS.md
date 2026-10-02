# AI Pair Programming Guide for mmate.xyz

## 1. Project Philosophy & Identity
`mmate.xyz` is a 100% handmade personal website and digital sanctuary for Máté Molnár. It operates like a modular ASCII cyberdeck / retro terminal workstation full of interactive utilities ("Swiss Army Knife"), a blog engine, image visualizer, and ambient experiments.

### The Sacred Aesthetic Guardrails
- **Art Direction**: Retro TUI / Terminal aesthetic. Monospace typography with ASCII art frames (`0-------0`, `|`).
- **Color Palette**: Gruvbox Dark (`#282828` background, `#EBDBB2` text, `#8EC07C` aqua, `#B8BB26` green, `#FABD2F` yellow, `#D3869B` purple, `#FB4934` red).
- **Virtual Text Buffer**: Standard cards follow a 41-column by 32-row grid.
- **Zero Bloat Policy**: Do NOT install heavy frameworks (e.g. React, Next.js, Vue, Tailwind). The site must remain blazingly fast, lightweight, and handcrafted using modern Vanilla ES Modules/TypeScript and Vite.
- **Craftsmanship & Easter Eggs**: Preserve the spirit of hidden binary messages, `<noscript>` fallbacks, and micro-interactions.

---

## 2. AI Working Rules & Protocol

### Session Start
1. Read `TASKS.md` to see the current active phase and next pending task.
2. Review `ARCHITECTURE.md` if touching core card rendering or data pipelines.
3. Keep the scope of the session strictly confined to ONE task from `TASKS.md`.

### During Development
1. **Plan First**: For non-trivial changes, outline the file edits and interface changes before writing code.
2. **Never Break Layouts**: Ensure the 41-char width grid is respected and mobile responsiveness (1-4 columns) remains intact.
3. **Keep Code Modular**: Put new utilities or tools in dedicated modules under `src/tools/` or `src/blog/`.

### Session Wrap-up & Handoff
1. Always run `npm run build` to verify there are 0 syntax errors or broken imports.
2. Update `TASKS.md`: check off completed items and write a 2-line handoff summary in the Session Log.
3. Create a clean git commit.

---

## 3. Key Commands
- Dev Server: `npm run dev`
- Build & Verify: `npm run build`
- Preview Build: `npm run preview`
