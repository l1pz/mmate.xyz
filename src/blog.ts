import blog from "./features/blog";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("#blog");
    if (root) void blog.page.mount(root);
});
