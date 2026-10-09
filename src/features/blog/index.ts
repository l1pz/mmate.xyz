export default {
    id: "blog",
    // Loaded on demand so the home page does not carry the Markdown renderer.
    page: { path: "/blog/", mount: (el: Element) => import("./page").then((m) => m.mount(el)) },
};
