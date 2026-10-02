import { initAscii } from "./ascii";
import { borders } from "./borders";
import { buildHomeCards } from "./cards";
import { loadBorder, nextBorder, saveBorder } from "./settings";

document.addEventListener("DOMContentLoaded", main);

function main() {
    initAscii();
    let border = loadBorder();
    const toggle = document.querySelector<HTMLButtonElement>("#border-toggle");

    const render = () => {
        for (const [id, card] of Object.entries(buildHomeCards(borders[border]))) {
            const el = document.querySelector(`#${id}`);
            if (el) card.render(el);
        }
        if (toggle) toggle.textContent = `[b] border: ${border}`;
    };

    const cycle = () => {
        border = nextBorder(border);
        saveBorder(border);
        render();
    };

    toggle?.addEventListener("click", cycle);
    document.addEventListener("keydown", (e) => {
        if (e.key === "b" && !e.ctrlKey && !e.metaKey && !e.altKey) cycle();
    });
    render();
}
