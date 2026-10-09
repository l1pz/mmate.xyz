# Design system: 1000110.xyz

STATUS: PROPOSED (2026-10-10). Not approved yet; nothing here is implemented.

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
4. Blog card uses the `ls -l` row format.
5. Record the rules in `AGENTS.md` ("new pages use the shell in DESIGN.md") and add decisions to `DECISIONS.md`.
Each step is its own commit and is reviewable on its own.

## Open questions
- Do the five stacked cards on a phone feel too long (about 2000px of scrolling)? The status line jumps between them. If not, a compact `ls`-style card index at the top could replace the long stack on phones.
- Should card text stay centered, or become left-aligned like the rest of the shell? Centered keeps the cyberdeck look; left-aligned would be more consistent.
