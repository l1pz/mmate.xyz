import { createServer } from "vite";

const FEED_PATH = "/feed.xml";

/**
 * Generates `feed.xml` from the blog posts (src/features/blog/feed.ts): emitted into `dist/` on build,
 * served by a middleware in dev. Never written by hand.
 */
export default function rssFeed() {
    // feed.ts and posts.ts use Vite-only features (import.meta.glob), so they are loaded through Vite itself.
    const render = async (server) => {
        const { SITE_URL } = await server.ssrLoadModule("/src/core/site.ts");
        const { getPosts } = await server.ssrLoadModule("/src/features/blog/posts.ts");
        const { buildFeed } = await server.ssrLoadModule("/src/features/blog/feed.ts");
        return buildFeed(getPosts(), {
            url: SITE_URL,
            title: "1000110.xyz",
            description: "Posts from 1000110.xyz",
        });
    };

    return {
        name: "rss-feed",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url?.split("?")[0] !== FEED_PATH) return next();
                try {
                    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
                    res.end(await render(server));
                } catch (error) {
                    next(error);
                }
            });
        },
        async generateBundle() {
            // Production build: no dev server exists, so start a throwaway one just to load the modules.
            const server = await createServer({
                configFile: false,
                appType: "custom",
                logLevel: "silent",
                server: { middlewareMode: true },
            });
            try {
                this.emitFile({ type: "asset", fileName: "feed.xml", source: await render(server) });
            } finally {
                await server.close();
            }
        },
    };
}
