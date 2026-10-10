export default {
    id: "tools",
    page: { path: "/tools/", mount: (el: Element) => import("./page").then((m) => m.mount(el)) },
};
