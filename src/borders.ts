/**
 * Border styles are plain data: add one by adding an entry to `borders`.
 * Each style is a set of single characters, so every frame keeps the card grid intact.
 */
export interface BorderStyle {
    /** Corners: top-left, top-right, bottom-left, bottom-right. */
    tl: string;
    tr: string;
    bl: string;
    br: string;
    /** Left and right ends of the divider line under the title. */
    teeLeft: string;
    teeRight: string;
    horizontal: string;
    vertical: string;
}

const corners = (c: string) => ({ tl: c, tr: c, bl: c, br: c, teeLeft: c, teeRight: c });

export const borders: Record<string, BorderStyle | null> = {
    none: null,
    // The original frame, still used by the old <noscript> cards.
    retro: { ...corners("0"), horizontal: "-", vertical: "|" },
    ascii: { ...corners("+"), horizontal: "-", vertical: "|" },
    // The styles below need a font with box drawing characters (see DECISIONS.md).
    single: { tl: "┌", tr: "┐", bl: "└", br: "┘", teeLeft: "├", teeRight: "┤", horizontal: "─", vertical: "│" },
    double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", teeLeft: "╠", teeRight: "╣", horizontal: "═", vertical: "║" },
    rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", teeLeft: "├", teeRight: "┤", horizontal: "─", vertical: "│" },
};

/** Style names in the order the toggle cycles through them. */
export const borderNames = Object.keys(borders);

export const defaultBorder = "none";
