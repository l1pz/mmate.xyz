import { initAscii } from './ascii.js';
import Card from './card.js'

document.addEventListener("DOMContentLoaded", main);
async function main() {
    await initAscii();
    const width = 41;
    const height = 32;
    const cardWIP = new Card(width, height, "work in progress", (card) => {
        card.emptyLine(2);
        card.drawAsciiArtCentered("wip");
        card.emptyLine(3);
        card.drawBinaryTextCentered("i promise i will finish this");
    });
    cardWIP.render(document.querySelector("#wip"));
}