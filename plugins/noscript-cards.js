import { createServer } from "vite";

const PLACEHOLDER = "<!-- noscript-cards -->";

/**
 * Fills the <noscript> block of a page with the same cards the JS draws (src/cards.ts),
 * so the no-JS version is never maintained by hand. Put PLACEHOLDER where the cards go.
 */
export default function noscriptCards() {
    let devServer;

    // src/cards.ts uses Vite-only features (import.meta.glob), so it is loaded through Vite itself.
    const render = async (server) => {
        const { initAscii } = await server.ssrLoadModule("/src/ascii.ts");
        const { buildHomeCards } = await server.ssrLoadModule("/src/cards.ts");
        const { renderHomeHead, renderHomeEnd } = await server.ssrLoadModule("/src/home.ts");
        initAscii();
        const cards = Object.entries(buildHomeCards())
            .map(([id, card]) => `<div class="card" id="${id}">\n<pre>\n${card.toHtml()}</pre>\n</div>`)
            .join("\n");
        return `${renderHomeHead(new Date())}\n<div class="card-container">\n${cards}\n</div>\n${renderHomeEnd()}`;
    };

    return {
        name: "noscript-cards",
        configureServer(server) {
            devServer = server;
        },
        transformIndexHtml: {
            order: "pre",
            async handler(html) {
                if (!html.includes(PLACEHOLDER)) return html;
                if (devServer) return html.replace(PLACEHOLDER, await render(devServer));
                // Production build: no dev server exists, so start a throwaway one just to load the modules.
                const server = await createServer({
                    configFile: false,
                    appType: "custom",
                    logLevel: "silent",
                    server: { middlewareMode: true },
                });
                try {
                    return html.replace(PLACEHOLDER, await render(server));
                } finally {
                    await server.close();
                }
            },
        },
    };
}
