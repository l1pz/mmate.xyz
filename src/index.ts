import { initAscii } from "./ascii";
import { bootPage } from "./core/boot";
import { getPage } from "./core/site";
import { renderHome } from "./home";

document.addEventListener("DOMContentLoaded", () => {
    initAscii();
    const root = document.querySelector("#home");
    if (root) root.innerHTML = renderHome(new Date());
    bootPage(getPage("home"));
});
