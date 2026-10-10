import tools from "./features/tools";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("#tools");
    if (root) void tools.page.mount(root);
});
