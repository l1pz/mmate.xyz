/** Keyboard navigation between the home page cards. Pure logic; the DOM wiring is in `index.ts`. */

export type Dir = "left" | "right" | "up" | "down";

export interface Box {
    left: number;
    top: number;
    width: number;
    height: number;
}

export type Action =
    | { type: "move"; dir: Dir }
    | { type: "jump"; index: number }
    | { type: "open" }
    | { type: "clear" };

const VIM: Record<string, Dir> = { h: "left", j: "down", k: "up", l: "right" };
const ARROWS: Record<string, Dir> = { ArrowLeft: "left", ArrowDown: "down", ArrowUp: "up", ArrowRight: "right" };

/**
 * What a key press means. h/j/k/l always move; the arrow keys only once a card is focused (until then they scroll
 * the page as usual); 1-9 jump to that card; Enter opens; Esc clears. `null` means "not ours, leave it alone".
 */
export function keyAction(key: string, hasFocus: boolean, count: number): Action | null {
    if (VIM[key]) return { type: "move", dir: VIM[key] };
    if (hasFocus && ARROWS[key]) return { type: "move", dir: ARROWS[key] };
    if (/^[1-9]$/.test(key) && Number(key) <= count) return { type: "jump", index: Number(key) - 1 };
    if (hasFocus && key === "Enter") return { type: "open" };
    if (hasFocus && key === "Escape") return { type: "clear" };
    return null;
}

/**
 * The card to focus after moving `dir` from `current`: the nearest card whose center lies that way,
 * counting sideways drift double so a move stays in its row or column. With nothing focused the first card wins.
 * Stays put when there is no card in that direction.
 */
export function moveFocus(boxes: Box[], current: number | null, dir: Dir): number {
    if (current === null) return 0;
    const center = (b: Box) => ({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
    const from = center(boxes[current]);
    let best = current;
    let bestScore = Number.POSITIVE_INFINITY;
    boxes.forEach((box, i) => {
        if (i === current) return;
        const to = center(box);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const ahead = { right: dx, left: -dx, down: dy, up: -dy }[dir];
        if (ahead <= 1) return; // not in that direction (1px tolerance for rounding)
        const drift = dir === "left" || dir === "right" ? Math.abs(dy) : Math.abs(dx);
        const score = ahead + drift * 2;
        if (score < bestScore) {
            bestScore = score;
            best = i;
        }
    });
    return best;
}
