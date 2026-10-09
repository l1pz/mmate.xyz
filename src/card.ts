import { ascii } from "./ascii";
import type { BorderStyle } from "./borders";
import { binaryLines } from "./core/binary";

export interface Link {
    /** Part of the text that becomes the link. Defaults to the whole text. */
    label?: string;
    href: string;
}

interface PlacedLink {
    row: number;
    col: number;
    length: number;
    href: string;
}

/** Color of a run of cells: becomes `<span class="c-NAME">`, colored by `styles/card.css`. */
export type CardStyle = "title" | "border" | "dim" | "aqua" | "green" | "yellow" | "purple" | "red";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Lines in the binary footer block (see `drawFooter`). */
export const FOOTER_LINES = 4;

/** A fixed-size grid of characters, like a text-mode terminal screen. */
export default class Card {
    readonly cols: number;
    readonly rows: number;
    #title: string;
    #canvas: string[][];
    #styles: (CardStyle | null)[][];
    #currentRow = 3;
    #links: PlacedLink[] = [];

    constructor(cols: number, rows: number, title: string, draw: (card: Card) => void, border?: BorderStyle | null) {
        this.cols = cols;
        this.rows = rows;
        this.#title = title;
        this.#canvas = Array.from({ length: rows }, () => new Array<string>(cols).fill(" "));
        this.#styles = Array.from({ length: rows }, () => new Array<CardStyle | null>(cols).fill(null));
        this.#drawText(this.#title, this.#centerCol(this.#title), 1, "title");
        if (title.startsWith("$ ")) this.#styles[1][this.#centerCol(title)] = "dim"; // a command title: dim prompt
        draw(this);
        if (border) this.#drawFrame(border);
    }

    toString(): string {
        return this.#canvas.map((row) => row.join("")).join("\n") + "\n";
    }

    /** HTML for the card: text is escaped, links are real <a> tags and colored runs are `<span class="c-NAME">`. */
    toHtml(): string {
        return (
            this.#canvas
                .map((cells, row) => {
                    // Text between `from` and `to` (no links inside), grouped into runs of one style.
                    const runs = (from: number, to: number) => {
                        let html = "";
                        for (let col = from; col < to; ) {
                            const style = this.#styles[row][col];
                            let end = col + 1;
                            while (end < to && this.#styles[row][end] === style) end++;
                            const text = escapeHtml(cells.slice(col, end).join(""));
                            html += style ? `<span class="c-${style}">${text}</span>` : text;
                            col = end;
                        }
                        return html;
                    };
                    const links = this.#links.filter((l) => l.row === row).sort((a, b) => a.col - b.col);
                    let html = "";
                    let col = 0;
                    for (const link of links) {
                        html += runs(col, link.col);
                        html += `<a href="${link.href}">${runs(link.col, link.col + link.length)}</a>`;
                        col = link.col + link.length;
                    }
                    return html + runs(col, this.cols);
                })
                .join("\n") + "\n"
        );
    }

    /** Makes the card title a link (the title row is row 1). */
    linkTitle(href: string): void {
        this.#links.push({ row: 1, col: this.#centerCol(this.#title), length: this.#title.length, href });
    }

    emptyLine(n = 1): void {
        this.#currentRow += n;
    }

    drawAsciiArtCentered(name: string, style?: CardStyle): void {
        const art = ascii[name];
        if (art === undefined) throw new Error(`Unknown ASCII art "${name}"`);
        const lines = art.split("\n");
        const maxLineLength = Math.max(...lines.map((line) => line.length));
        const col = Math.floor(this.cols / 2) - Math.floor(maxLineLength / 2);
        for (const line of lines) {
            this.#drawText(line, col, this.#currentRow++, style);
        }
    }

    drawTextCentered(text: string, link?: Link, style?: CardStyle): void {
        const col = this.#centerCol(text);
        this.#drawText(text, col, this.#currentRow, style);
        if (link) {
            const label = link.label ?? text;
            const start = text.indexOf(label);
            if (start === -1) throw new Error(`Link label "${label}" not found in "${text}"`);
            this.#links.push({ row: this.#currentRow, col: col + start, length: label.length, href: link.href });
        }
        this.#currentRow++;
    }

    drawBinaryTextCentered(text: string, style?: CardStyle): void {
        for (const line of binaryLines(text, Math.floor(this.cols / 9))) {
            this.drawTextCentered(line, undefined, style);
        }
    }

    /**
     * Hidden binary message in a fixed spot: 4 lines ending one blank row above the bottom row,
     * so every card has its footer at the same place without counting `emptyLine`s.
     * The text is padded with spaces to fill all 4 lines. Throws `RangeError` if it is too long
     * or the content already uses the footer rows.
     */
    drawFooter(text: string): void {
        const perLine = Math.floor(this.cols / 9);
        const max = perLine * FOOTER_LINES;
        if (text.length > max) {
            throw new RangeError(`Card "${this.#title}": footer has ${text.length} characters, the maximum is ${max}`);
        }
        const first = this.rows - 2 - FOOTER_LINES;
        for (let row = first; row < first + FOOTER_LINES; row++) {
            if (this.#canvas[row].some((c) => c !== " ")) {
                throw new RangeError(`Card "${this.#title}": content overlaps the footer at row ${row}`);
            }
        }
        this.#currentRow = first;
        this.drawBinaryTextCentered(text.padEnd(max), "dim");
    }

    render(parent: Element): void {
        const pre = document.createElement("pre");
        pre.innerHTML = this.toHtml();
        parent.replaceChildren(pre);
    }

    #centerCol(text: string): number {
        return Math.floor(this.cols / 2) - Math.floor(text.length / 2);
    }

    /**
     * Frame on the outer rows/columns plus a divider under the title (row 2).
     * Drawn after the content, and it throws if the content already uses a frame cell.
     */
    #drawFrame(b: BorderStyle): void {
        const last = this.cols - 1;
        const bottom = this.rows - 1;
        const put = (row: number, col: number, c: string) => {
            if (this.#canvas[row][col] !== " ") {
                throw new RangeError(`Card "${this.#title}": content overlaps the border at row ${row}, col ${col}`);
            }
            this.#canvas[row][col] = c;
            this.#styles[row][col] = "border";
        };
        for (let row = 0; row <= bottom; row++) {
            const isLine = row === 0 || row === 2 || row === bottom;
            const left = row === 0 ? b.tl : row === 2 ? b.teeLeft : row === bottom ? b.bl : b.vertical;
            const right = row === 0 ? b.tr : row === 2 ? b.teeRight : row === bottom ? b.br : b.vertical;
            put(row, 0, left);
            put(row, last, right);
            if (isLine) for (let col = 1; col < last; col++) put(row, col, b.horizontal);
        }
    }

    #drawText(text: string, col: number, row: number, style?: CardStyle): void {
        if (row < 0 || row >= this.rows) {
            throw new RangeError(`Card "${this.#title}": row ${row} is outside the ${this.rows} row grid`);
        }
        for (let i = 0; i < text.length; i++) {
            const c = col + i;
            if (c >= 0 && c < this.cols) {
                this.#canvas[row][c] = text[i];
                this.#styles[row][c] = style ?? null;
            }
        }
    }
}
