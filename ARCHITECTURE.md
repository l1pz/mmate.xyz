# Architecture: mmate.xyz

## Core idea
A card is a fixed grid of characters (default 41 x 32), like a text-mode terminal screen. Pages are grids of cards.

## Card engine (`src/card.ts`)
Pure logic, fully tested (`tests/card.test.ts`). The only DOM touch is `render()`.
- `new Card(cols, rows, title, draw)`: title on row 1, drawing starts at row 3.
- `drawTextCentered(text, link?)`, `drawAsciiArtCentered(name)`, `drawBinaryTextCentered(text)`, `emptyLine(n)`: each draws at the current row and moves down.
- `link = { href, label? }`: `label` is the part of the text that becomes the link.
- Drawing outside the grid throws `RangeError` (so overflow is a loud bug, not silent corruption). Columns are clipped.
- `toString()` plain text, `toHtml()` escaped HTML with `<a>` tags, `render(el)` mounts a `<pre>`.

## Files
```
index.html, experiments/**/index.html   pages (all listed in vite.config.js)
public/ascii/                           ASCII art, fetched at runtime from /ascii/
src/ascii.ts                            ASCII loader
src/card.ts                             card engine
src/index.ts                            home page cards
styles/                                 reset, theme (Gruvbox variables), card layout
tests/                                  vitest: card engine + production-build guard
```

## Layout
CSS grid, 1 column (<750px), 2 (750-1099), 3 (1100-1499), 4 (>=1500). All cards are the same size.

## Planned: feature modules (PROPOSED, needs user approval)
Each feature (blog, tools, gallery, oracle) is a folder `src/features/<name>/` exporting one object:
```ts
export default {
  id: "blog",
  card(width, height): Card,        // the tile on the home grid
  page?: { path: "/blog/", mount(el) }   // optional full-page view
}
```
`src/index.ts` just imports the list of features and renders their cards. Features never import each other; shared code goes in `src/core/`. This keeps each AI session inside one folder.
