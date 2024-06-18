import { ascii } from "./ascii.js";

export default class Card {
    #cols;
    #rows;
    #title;
    #canvas;
    #currentRow;
    #links = {}

    constructor(cols, rows, title, draw) {
        this.#cols = cols;
        this.#rows = rows;
        this.#title = title;
        this.#canvas = new Array(this.#rows);
        this.#currentRow = 3;
        for (let i = 0; i < rows; i++) {
            this.#canvas[i] = new Array(cols);
        }
        this.#setLayout();
        draw(this);
    }

    #setLayout() {
        this.#fill(" ");
        // this.#drawLineH(0, this.#cols - 1, 0);
        // this.#drawLineH(0, this.#cols - 1, this.#rows - 1);
        // this.#drawLineV(0, this.#rows - 1, 0);
        // this.#drawLineV(0, this.#rows - 1, this.#cols - 1);
        // this.#drawLineH(0, this.#cols - 1, 2);
        this.#drawTextCentered(this.#title, 1);
    }

    log() {
        console.log(this.toString());
        console.log(ascii);
    }

    toString() {
        let str = "";
        for (let row = 0; row < this.#rows; row++) {
            str += this.#canvas[row].join('') + "\n";
        }
        return str;
    }

    #fill(char) {
        for (let row = 0; row < this.#rows; row++) {
            for (let col = 0; col < this.#cols; col++) {
                this.#canvas[row][col] = char;
            }
        }
    }

    #drawAsciiArt(name, col, row) {
        const lines = ascii[name].split('\n');
        for (let line of lines) {
            this.#drawText(line, col, row);
            row++;
        }
    }

    drawAsciiArtCentered(name) {
        console.log(ascii);
        const lines = ascii[name].split('\n');
        const maxLineLength = Math.max(...lines.map(line => line.length));
        const col = Math.floor(this.#cols / 2) - Math.floor(maxLineLength / 2);
        this.#drawAsciiArt(name, col, this.#currentRow)
        this.#currentRow += lines.length;
    }

    #drawText(text, col, row) {
        for (let i = 0; i < text.length; i++) {
            this.#canvas[row][col + i] = text[i];
        }
    }

    #drawTextCentered(text, row) {
        const col = Math.floor(this.#cols / 2) - Math.floor(text.length / 2);
        this.#drawText(text, col, row);
    }

    emptyLine(n = 1) {
        this.#currentRow += n;
    }

    drawBinaryTextCentered(text) {
        const binaries = [];
        const binariesInOneLine = Math.floor(this.#cols / 9);
        for (let i = 0; i < text.length % binariesInOneLine; i++) {
            text += " ";
        }
        for (let i = 0; i < text.length; i++) {
            binaries.push(text[i].charCodeAt(0).toString(2).padStart(8, "0"));
        }
        const binaryLines = Array.from({ length: Math.ceil(binaries.length / binariesInOneLine) }, () => binaries.splice(0, binariesInOneLine));
        const binaryStrings = binaryLines.map(binaryLine => binaryLine.join(" "));
        for (const binaryString of binaryStrings) {
            this.drawTextCentered(binaryString);
        }
    }

    drawTextCentered(text, link) {
        console.log(text, link)
        this.drawTextCentered(text, text, link);
    }

    drawTextCentered(text, linkText, link) {
        if (link) {
            this.#links[linkText] = link;
        } else if (linkText) {
            this.#links[text] = linkText;
        }
        const col = Math.floor(this.#cols / 2) - Math.floor(text.length / 2);
        this.#drawText(text, col, this.#currentRow);
        this.#currentRow++;
    }

    #drawLineH(startCol, endCol, row) {
        this.#canvas[row][startCol] = '0';
        this.#canvas[row][endCol] = '0';
        for (let col = startCol + 1; col < endCol; col++) {
            this.#canvas[row][col] = '-';
        }
    }

    #drawLineV(startRow, endRow, col) {
        this.#canvas[startRow][col] = '0';
        this.#canvas[endRow][col] = '0';
        for (let row = startRow + 1; row < endRow; row++) {
            this.#canvas[row][col] = '|';
        }
    }

    render(parent) {
        let text = this.toString();
        for (const [key, link] of Object.entries(this.#links)) {
            text = text.replace(key, `<a href="${link}">${key}</a>`);
        }
        const pre = document.createElement("pre");
        pre.innerHTML = text;
        parent.innerHtml = "";
        parent.appendChild(pre);
    }
}