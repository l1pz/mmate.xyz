import { initAscii } from "./ascii";
import { buildHomeCards } from "./cards";

document.addEventListener("DOMContentLoaded", main);

function main() {
    initAscii();
    for (const [id, card] of Object.entries(buildHomeCards())) {
        const el = document.querySelector(`#${id}`);
        if (el) card.render(el);
    }
}
