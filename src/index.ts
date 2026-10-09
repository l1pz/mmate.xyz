import { initAscii } from "./ascii";
import { buildHomeCards } from "./cards";
import { keyAction, moveFocus } from "./keynav";
import { mountStatusBar } from "./statusbar";

document.addEventListener("DOMContentLoaded", main);

function main() {
    initAscii();
    const cards = buildHomeCards();
    const ids = Object.keys(cards);
    const elements: HTMLElement[] = [];
    for (const [id, card] of Object.entries(cards)) {
        const el = document.querySelector<HTMLElement>(`#${id}`);
        if (!el) continue;
        card.render(el);
        elements.push(el);
    }

    let focused: number | null = null;
    const bar = document.querySelector("#status");
    const setActive = bar ? mountStatusBar(bar, ids, (i) => focus(i)) : () => {};

    function focus(index: number | null) {
        focused = index;
        elements.forEach((el, i) => {
            el.classList.toggle("focused", i === index);
        });
        setActive(index);
        if (index !== null) elements[index]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target instanceof HTMLElement && /^(input|textarea|select)$/i.test(e.target.tagName)) return;
        const action = keyAction(e.key, focused !== null, elements.length);
        if (!action) return;
        e.preventDefault();
        if (action.type === "clear") focus(null);
        else if (action.type === "jump") focus(action.index);
        else if (action.type === "open") {
            const link = focused === null ? null : elements[focused].querySelector("a");
            if (link) location.href = link.href;
        } else {
            const boxes = elements.map((el) => el.getBoundingClientRect());
            focus(moveFocus(boxes, focused, action.dir));
        }
    });
}
