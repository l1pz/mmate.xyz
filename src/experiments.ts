import { mountPage } from "./core/boot";
import { experimentRows } from "./experiments-page";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("#experiments");
    if (root) {
        mountPage(root, "experiments", {
            command: "ls experiments/",
            body: experimentRows(),
            secret: "i promise i will finish this",
        });
    }
});
