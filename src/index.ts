import { initAscii } from "./ascii";
import { borders } from "./borders";
import { buildHomeCards } from "./cards";

document.addEventListener("DOMContentLoaded", main);

function main() {
    initAscii();
    for (const [id, card] of Object.entries(buildHomeCards(borders.rounded))) {
        const el = document.querySelector(`#${id}`);
        if (el) card.render(el);
    }
}
