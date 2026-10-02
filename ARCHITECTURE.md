# Architecture: 1000110.xyz

## Core idea
A card is a fixed grid of characters (default 41 x 32), like a text-mode terminal screen. Pages are grids of cards.

## Card engine (`src/card.ts`)
Pure logic, fully tested (`tests/card.test.ts`). The only DOM touch is `render()`.
- `new Card(cols, rows, title, draw)`: title on row 1, drawing starts at row 3.
- `drawTextCentered(text, link?)`, `drawAsciiArtCentered(name)`, `drawBinaryTextCentered(text)`, `emptyLine(n)`: each draws at the current row and moves down.
- `link = { href, label? }`: `label` is the part of the text that becomes the link.
- Drawing outside the grid throws `RangeError` (so overflow is a loud bug, not silent corruption). Columns are clipped.
- `toString()` plain text, `toHtml()` escaped HTML with `<a>` tags, `render(el)` mounts a `<pre>`.
- Optional 5th constructor argument `border` (a `BorderStyle` from `src/borders.ts`, or null/omitted for none). The frame is drawn after the content on rows 0, 2 and the last row plus the first/last column; if content already uses one of those cells it throws `RangeError`. Content area is therefore rows 3 to rows-2, cols 1 to cols-2 when a border is on.

## Files
```
index.html, experiments/**/index.html   pages (all listed in vite.config.js)
src/ascii-art/                        ASCII art (.ascii), bundled at build time
src/ascii.ts                            loads the bundled art
src/card.ts                             card engine
src/borders.ts                          border styles (plain data; add a style = add an entry)
src/settings.ts                         border setting: cycle, load/save in localStorage (safe if blocked)
src/cards.ts                            the home page cards (buildHomeCards)
src/index.ts                            home page: renders cards, border toggle (key `b` or the footer button)
styles/                                 reset, theme (Gruvbox variables), card layout, settings (border toggle)
public/fonts/                           self-hosted fonts (DejaVu Sans Mono + JGS pixel fonts), copied as-is to dist/fonts
tests/                                  vitest: card engine, borders, settings, home cards in every border style, production-build guard
```

## Layout
CSS grid, 1 column (<750px), 2 (750-1099), 3 (1100-1499), 4 (>=1500). All cards are the same size.

## Planned: feature modules (APPROVED 2026-10-02, not yet implemented)
Each feature (blog, tools, gallery, oracle) is a folder `src/features/<name>/` exporting one object:
```ts
export default {
  id: "blog",
  card(width, height): Card,        // the tile on the home grid
  page?: { path: "/blog/", mount(el) }   // optional full-page view
}
```
`src/index.ts` just imports the list of features and renders their cards. Features never import each other; shared code goes in `src/core/`. This keeps each AI session inside one folder.
