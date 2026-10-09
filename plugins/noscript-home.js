import { createServer } from "vite";

const PLACEHOLDER = "<!-- noscript-home -->";

/**
 * Fills the <noscript> block of the home page with the same page the JS draws (src/home.ts),
 * so the no-JS version is never maintained by hand. Put PLACEHOLDER where the page goes.
 */
export default function noscriptHome() {
    let devServer;

    // src/home.ts uses Vite-only features (import.meta.glob), so it is loaded through Vite itself.
    const render = async (server) => {
        const { initAscii } = await server.ssrLoadModule("/src/ascii.ts");
        const { renderHome } = await server.ssrLoadModule("/src/home.ts");
        initAscii();
        return renderHome(new Date());
    };

    return {
        name: "noscript-home",
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
