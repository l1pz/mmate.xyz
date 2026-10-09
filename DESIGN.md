# Design system: 1000110.xyz

STATUS: IMPLEMENTED 2026-10-10 (steps 1-5 below, PR #14). Open questions below keep their defaults until the user has seen the result on a phone.

Deviations from the first proposal: the `whoami` block says something new ("this is my cyberdeck: ...") instead of moving the about card's text, so the about card is unchanged; the blog card keeps the `date  title` rows because a full `ls -l` row does not fit in 39 columns (the blog index drops its fake permissions column under 500px for the same reason).

Every page is a terminal session. Pages share one shell (the frame) and serve their own content inside it. Phones come first: most visitors arrive on one.

## 1. The grid unit: the character cell
- One font (DejaVu Sans Mono), one size, one character cell. Widths are in `ch`, heights in lines. Hierarchy comes from color and markers (`#`, `$`, `>`), never from font size or weight.
- A phone shows about 40 columns (375px / 8.4px). **40 columns is the design width.** Desktop adds space around it, never a different layout language.
- Widths: phone = full width minus a 1.5ch gutter; reading column = `min(72ch, 100%)`; card = 41 columns.
- Small phones: the font size shrinks below ~400px wide so 41 columns always fit (`font-size: min(14px, (100vw - gutters) / 41 / 0.602)`), so a card never overflows and never needs a sideways scroll. Only code boxes may scroll sideways.

## 2. Tokens (all in `styles/theme.css`, never raw hex elsewhere)
| Role | Variable | Used for |
|------|----------|----------|
| text | `--fg` | body text |
| secondary | `--gray` | dim text, borders, footers, crumbs, dates |
| accent / title | `--yellow` | page and card titles, headings, current/focused thing |
| structure | `--aqua` | links, h2, art accents |
| prompt / ok | `--green` | `$` prompt lines, h3, success |
| visited | `--purple` | visited links, art accent |
| error | `--red` | errors |
| surface | `--bg`, `--bg-soft` | page background, bars and inline code |

Spacing: vertical rhythm is 1.6 lines in prose; art and cards use 1.0 (tight, so the art holds its shape). The seam between the two is always a blank line or a rule, never mixed in one block.

## 3. The shell (shared by every page)
Same elements, same order, same classes (`styles/shell.css`, helpers in `src/shell.ts`, pure and tested):
1. **Crumbs**: `1000110.xyz / blog / hello-world`, gray, each part a link.
2. **Man header**: `NAME(1)    section    date`, one dashed rule under it.
3. **Prompt lines**: `$ command`, `$` in gray, the command in green. Every block of content is the output of a command (`$ whoami`, `$ cat posts/x.md`, `$ ls -l ~/blog`).
4. **End prompt**: `$ █` with the blinking cursor (static under reduced motion).
5. **Status line**: fixed at the bottom. Left = where you are (windows on the home page, file name on a post), right = state (clock, or the progress meter `[████░░░░] 42%`).
Content between the crumbs and the end prompt is the page's own.

## 4. Content patterns (what a page puts inside the shell)
- **Prose** (blog post): left-aligned column, headings with a dim `#` marker, boxed code, dimmed quotes.
- **Listing** (`ls -l` rows): used by the blog index and, in the same format, by the blog card.
- **Cards** (home grid, later widgets): 41 x 32 character tiles. A card title is a command (`$ cat about`, `$ ls ~/blog`). Border gray, focused border yellow, footer binary message dim. Cards are widgets inside the shell, not the page itself.
- **Tool / experiment** (later): the shell wraps a canvas or form; the status line shows the tool state.
- **Gallery** (later): same shell, a listing of albums, a viewer as a post-like page.

## 5. Phone rules (apply to every pattern)
- One column under 750px; no page-level horizontal scroll.
- Tap targets are at least 44px tall: the status line windows get padding on touch screens (`@media (pointer: coarse)`), and listing rows are full-width links.
- The status line is the main navigation on phones. It must work by tap alone; keys (`hjkl`, `1`-`5`, `g/G`) are a bonus for keyboards. No feature may need hover.
- The bottom bar respects the safe area (`env(safe-area-inset-bottom)`) so it clears the home indicator.
- Window names shorten on narrow screens so the list fits in 40 columns (`1:me 2:proj 3:blog 4:mail 5:art`).
- No motion beyond the cursor blink; honor `prefers-reduced-motion`.
- Test every UI change at 360px and 390px wide, not only on desktop.

## 6. Home page under this system
```
1000110.xyz
1000110.XYZ(1)          home         2026-10-10
- - - - - - - - - - - - - - - - - - - - - - - -
$ whoami
máté molnár - computer enthusiast,
recreational programmer.

$ ls cards/
(the cards, one column on a phone, up to 4 on desktop)

$ █
 1:me 2:proj 3:blog 4:mail 5:art          23:41
```
The short introduction moves from the about card into the `whoami` block; the about card keeps the portrait.

## 7. Implementation order (proposal)
1. `styles/shell.css` + `src/shell.ts`: crumbs, man header, prompt, end prompt; the blog is refactored to use them (no visual change).
2. Phone rules: fluid font size, safe area, tap targets, short window names; check at 360 and 390 wide.
3. Home page gets the shell, the `whoami` block and command-style card titles.
4. Blog card rows: kept as `date  title` (see deviations above).
5. Record the rules in `AGENTS.md` ("new pages use the shell in DESIGN.md") and add decisions to `DECISIONS.md`.
Each step is its own commit and is reviewable on its own.

## Open questions (defaults in brackets)
- [Keep the stack] Do the five stacked cards on a phone feel too long (about 2000px of scrolling)? The status line jumps between them. If not, a compact `ls`-style card index at the top could replace the long stack on phones.
- [Keep centered] Should card text stay centered, or become left-aligned like the rest of the shell? Centered keeps the cyberdeck look; left-aligned would be more consistent.

## 8. Consistency plan (PROPOSED 2026-10-10)
Why: home, blog index and post each assembled the shell by hand, so they drifted (no man header or end prompt on the blog index, different status lines), and the experiments pages never got the shell at all. The fix is structural: a page cannot leave a part out, because it does not assemble the shell, it only hands over its content.

### 8.1 The site map is data (`src/core/site.ts`)
One list of pages: `id`, `path`, `name` (status window), `section`, `pattern`. Everything site-wide derives from it: the status line windows, the crumbs, the man header name and section. Adding a page = one entry plus its HTML file in `vite.config.js`.

| id | path | window | pattern | content |
|----|------|--------|---------|---------|
| home | `/` | `1:home` | session | one command per section: `$ whoami`, `$ cat portrait.txt`, `$ ls ~/blog`, `$ ls projects/`, `$ cat contact.txt`, `$ cat l'art.txt`; no cards |
| blog | `/blog/` | `2:blog` | listing, then prose | `$ ls -l ~/blog`; a post is `$ cat posts/x.md` |
| experiments | `/experiments/` | `3:exp` | listing | `$ ls experiments/`, one row per experiment (replaces the lone WIP card) |
| fluid dynamics | `/experiments/fluiddynamics/` | (child of exp) | tool | shell header, canvas inside |
| later: tools, gallery, oracle | | next numbers | tool / listing / feed | |

### 8.2 One page frame (`renderPage` in `src/core/shell.ts`)
Every page, JS or `<noscript>`, is `renderPage({ page, command, body })`, which outputs in this fixed order: crumbs, man header, `$ command`, the page's body, end prompt. Page code only writes `body`. The status line is mounted by the same shared boot code on every page.

### 8.3 One status line (`src/core/statusline.ts`)
- Left: the site windows from the site map (`1:home 2:blog 3:exp`), the current page highlighted with `*`, each a link with a 44px tap target. This is the site navigation on phones.
- Right: a clock and scroll progress, `23:41 [████░░░░] 42%`, on every page. Under 600px wide only `42%` shows, so everything fits 40 columns.
- The home page's card windows are removed along with the cards (8.8).

### 8.4 One key vocabulary
- Everywhere: `1`-`9` jump to site window N, `g`/`G` top and bottom.
- Every page is a scrolling column, so `j`/`k` scroll everywhere; `b` or Esc goes up one level.
- Keys are only a bonus; every action also works by tap.

### 8.5 Guards so it cannot drift again
- A pure `assertShell(html)` test helper checks the parts and their order; every page's renderer is tested with it, and the `<noscript>` output too.
- A test compares `vite.config.js` page inputs with the site map, so a new HTML page without a map entry fails `npm run check`.
- The build test loads every built HTML file and checks `body.shell`, the status line mount point and the viewport meta.
- `AGENTS.md` already tells new pages to use the shell; it will point at `renderPage` and the site map.

### 8.6 Implementation order (one PR, one commit per step)
1. `site.ts` + `renderPage` + `assertShell`, with tests.
2. Shared status line (windows from the site map, progress on every page); delete the separate home status bar and blog status line code.
3. Blog index, post and not-found go through `renderPage`.
4. Home goes through `renderPage`; card windows removed; keys updated.
5. Experiments index as a listing; fluid dynamics gets the shell header around its canvas.
6. Guard tests, then fold this section into sections 3-6 and update `AGENTS.md`, `DECISIONS.md`.

### 8.7 Decisions (user, 2026-10-10)
- Man header date: each page's own date where it has one (a post), today otherwise.
- The clock stays, on the right of the status line next to the progress meter, on wide screens.

### 8.8 Cards retire from the home page
The 41 x 32 tile forced a fixed width, equal weight for every block and centered text, so the home page worked unlike every other page. The home page becomes a session like the blog (one column, one command per section, left-aligned text, hidden binary messages kept as dim lines at the end of the about, projects and contact sections).
- Kept (engine, for later widgets such as a table-of-contents card, the Oracle or a clock): `src/card.ts`, `borders.ts`, `ascii.ts`, the color styles and `.card` CSS, with their tests.
- Removed: the home card grid and `.home`/`.card-container` layout, `src/cards.ts` home cards, the blog card, `src/keynav.ts`, the card window list (`src/statusbar.ts`), card focus in `src/index.ts`. Git history keeps them.
- The `<noscript>` plugin renders the same home body function as the JS page; no card rendering involved.
- Implementation order step 4 becomes "home as a session", and step 6 also deletes the dead code and updates ARCHITECTURE.md.
