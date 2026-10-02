import { ascii } from "./ascii";

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

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A fixed-size grid of characters, like a text-mode terminal screen. */
export default class Card {
    readonly cols: number;
    readonly rows: number;
    #title: string;
    #canvas: string[][];
    #currentRow = 3;
    #links: PlacedLink[] = [];

    constructor(cols: number, rows: number, title: string, draw: (card: Card) => void) {
        this.cols = cols;
        this.rows = rows;
        this.#title = title;
        this.#canvas = Array.from({ length: rows }, () => new Array<string>(cols).fill(" "));
        this.#drawText(this.#title, this.#centerCol(this.#title), 1);
        draw(this);
    }

    toString(): string {
        return this.#canvas.map((row) => row.join("")).join("\n") + "\n";
    }

    /** HTML for the card: text is escaped and links are real <a> tags. */
    toHtml(): string {
        return (
            this.#canvas
                .map((cells, row) => {
                    const links = this.#links.filter((l) => l.row === row).sort((a, b) => a.col - b.col);
                    let html = "";
                    let col = 0;
                    for (const link of links) {
                        html += escapeHtml(cells.slice(col, link.col).join(""));
                        const label = escapeHtml(cells.slice(link.col, link.col + link.length).join(""));
                        html += `<a href="${link.href}">${label}</a>`;
                        col = link.col + link.length;
                    }
                    return html + escapeHtml(cells.slice(col).join(""));
                })
                .join("\n") + "\n"
        );
    }

    emptyLine(n = 1): void {
        this.#currentRow += n;
    }

    drawAsciiArtCentered(name: string): void {
        const art = ascii[name];
        if (art === undefined) throw new Error(`Unknown ASCII art "${name}"`);
        const lines = art.split("\n");
        const maxLineLength = Math.max(...lines.map((line) => line.length));
        const col = Math.floor(this.cols / 2) - Math.floor(maxLineLength / 2);
        for (const line of lines) {
            this.#drawText(line, col, this.#currentRow++);
        }
    }

    drawTextCentered(text: string, link?: Link): void {
        const col = this.#centerCol(text);
        this.#drawText(text, col, this.#currentRow);
        if (link) {
            const label = link.label ?? text;
            const start = text.indexOf(label);
            if (start === -1) throw new Error(`Link label "${label}" not found in "${text}"`);
            this.#links.push({ row: this.#currentRow, col: col + start, length: label.length, href: link.href });
        }
        this.#currentRow++;
    }

    drawBinaryTextCentered(text: string): void {
        const perLine = Math.floor(this.cols / 9);
        text = text.padEnd(Math.ceil(text.length / perLine) * perLine, " ");
        const bytes = Array.from(text, (c) => c.charCodeAt(0).toString(2).padStart(8, "0"));
        for (let i = 0; i < bytes.length; i += perLine) {
            this.drawTextCentered(bytes.slice(i, i + perLine).join(" "));
        }
    }

    render(parent: Element): void {
        const pre = document.createElement("pre");
        pre.innerHTML = this.toHtml();
        parent.replaceChildren(pre);
    }

    #centerCol(text: string): number {
        return Math.floor(this.cols / 2) - Math.floor(text.length / 2);
    }

    #drawText(text: string, col: number, row: number): void {
        if (row < 0 || row >= this.rows) {
            throw new RangeError(`Card "${this.#title}": row ${row} is outside the ${this.rows} row grid`);
        }
        for (let i = 0; i < text.length; i++) {
            const c = col + i;
            if (c >= 0 && c < this.cols) this.#canvas[row][c] = text[i];
        }
    }
}
