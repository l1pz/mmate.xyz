import { initAscii } from "./ascii";
import Card from "./card";

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
    cardWIP.render(document.querySelector("#wip")!);
}
