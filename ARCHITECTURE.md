# Architecture & System Design — mmate.xyz

## 1. Overview
`mmate.xyz` is built on a virtual text-buffer architecture designed to emulate hardware text-mode terminals within the modern web browser.

---

## 2. Core Abstractions

### The Virtual Text Canvas (`src/card.js`)
Each card is represented as a 2D character matrix (`cols` × `rows`, standard 41 × 32):

```
+---------------------------------------+  Row 0: 0-------------------0
|               about me                |  Row 1: |     title         |
+---------------------------------------+  Row 2: 0-------------------0
|                                       |  Row 3: Content area starts
|               ASCII ART               |
|                                       |
|              Máté Molnár              |
|                                       |
|  01101001 00100111 01101101 00100000  |  Row 30: Binary footer
+---------------------------------------+  Row 31: 0-------------------0
```

#### Canvas API Primitives:
- `fill(char)`: Fills entire canvas with whitespace or a pattern.
- `drawLineH(startCol, endCol, row)`: Draws horizontal boundary `0---0`.
- `drawLineV(startRow, endRow, col)`: Draws vertical boundary `|`.
- `drawTextCentered(text, options)`: Centers text horizontally at the current row.
- `drawAsciiArtCentered(artName)`: Renders multi-line ASCII art centered.
- `drawBinaryTextCentered(text)`: Converts string to 8-bit binary chunks and renders centered.
- `render(parentElement)`: Serializes canvas matrix to string, binds hyperlinks, and mounts `<pre>` into DOM.

---

## 3. Layout & Responsiveness
The site uses CSS Grid with character-based sizing to ensure cards never stretch or break their monospace alignment:

- **Mobile (< 750px)**: 1 column
- **Tablet (750px – 1099px)**: 2 columns
- **Desktop (1100px – 1499px)**: 3 columns
- **Ultra-Wide (≥ 1500px)**: 4 columns

All cards maintain identical fixed character dimensions (41 × 32 chars) so the grid remains visually balanced regardless of content.

---

## 4. Planned Module Structure

```
mmate.xyz/
├── index.html            # Main entry point & <noscript> cards
├── AGENTS.md             # Project guidelines for AI pair programming
├── ARCHITECTURE.md       # System design & specs (this file)
├── TASKS.md              # Living task board & session handoffs
├── ascii/                # Raw ASCII art text files (.ascii)
├── fonts/                # JGS pixel fonts & Space Mono
├── styles/               # CSS stylesheets (theme, reset, card)
└── src/
    ├── index.js          # Main entry & card orchestrator
    ├── card.js           # Virtual text canvas engine
    ├── ascii.js          # ASCII asset loader
    ├── blog/             # Markdown parser & reading pager
    ├── gallery/          # Dither & ASCII image visualizer
    └── tools/            # Swiss Army Knife utilities
```
