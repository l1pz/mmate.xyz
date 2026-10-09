# Architecture: 1000110.xyz

## Core idea
A card is a fixed grid of characters (default 41 x 32), like a text-mode terminal screen. Pages are grids of cards.

## Card engine (`src/card.ts`)
Pure logic, fully tested (`tests/card.test.ts`). The only DOM touch is `render()`.
- `new Card(cols, rows, title, draw)`: title on row 1, drawing starts at row 3.
- `drawTextCentered(text, link?)`, `drawAsciiArtCentered(name)`, `drawBinaryTextCentered(text)`, `emptyLine(n)`: each draws at the current row and moves down.
- `link = { href, label? }`: `label` is the part of the text that becomes the link.
- `drawFooter(text)`: the hidden binary message, always the same 4 lines ending one blank row above the bottom row (rows 26-29 on a 32 row card), whatever the content above. Text is padded with spaces to 16 characters; longer text or content already in those rows throws `RangeError`. Use it for every card footer instead of counting `emptyLine`s.
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
src/cards.ts                            the home page cards (buildHomeCards, rounded border hardcoded; includes the blog card)
plugins/noscript-cards.js               build/dev plugin: fills the <noscript> block of index.html from buildHomeCards
src/index.ts                            home page: renders the cards with the rounded border (hardcoded)
styles/                                 reset, theme (Gruvbox variables), card layout
public/fonts/                           self-hosted fonts (DejaVu Sans Mono + JGS pixel fonts), copied as-is to dist/fonts
tests/                                  vitest: card engine, borders, home cards in every border style, production-build guard
```

## No-JS version
`index.html` has `<!-- noscript-cards -->` inside `<noscript>`. `plugins/noscript-cards.js` (listed in `vite.config.js`) replaces it with `card.toHtml()` of every card from `buildHomeCards()`, loaded through Vite so `import.meta.glob` works. Never edit noscript cards by hand: change `src/cards.ts` and both versions follow. Build time values (the age line, the random art piece) are fixed per build. `tests/build.test.ts` checks the generated output.

## Layout
CSS grid, 1 column (<750px), 2 (750-1099), 3 (1100-1499), 4 (>=1500). All cards are the same size.

## Feature modules (APPROVED 2026-10-02; only `blog` exists so far: loader and home card)
Each feature (blog, tools, gallery, oracle) is a folder `src/features/<name>/` exporting one object:
```ts
export default {
  id: "blog",
  card(width, height): Card,        // the tile on the home grid
  page?: { path: "/blog/", mount(el) }   // optional full-page view
}
```
`src/index.ts` just imports the list of features and renders their cards. Features never import each other; shared code goes in `src/core/`. This keeps each AI session inside one folder.

### Blog loader (`src/features/blog/`)
`frontmatter.ts` (pure parser/validator: `parseFrontmatter`, `parsePost`), `posts.ts` (`loadPosts`, `getPosts()` newest first, `getPost(slug)`), `posts/*.md` (title, date `YYYY-MM-DD`, optional `tags: [a, b]`, optional `slug`, defaulting to the filename). Bad frontmatter or a duplicate slug throws at load time. 
`index.ts` is the feature object: `card()` builds the home tile (`buildBlogCard`: newest 5 posts, typewriter art on top, one row each, titles truncated, rows link to `/blog/#slug`, "no posts yet" when empty). No reading page yet. `buildHomeCards` calls `blog.card()` directly; `src/index.ts` does not iterate a features list until a second feature exists.
