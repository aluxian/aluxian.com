import * as bear from "./routes/bear";
import * as blog from "./routes/blog";
import * as feed from "./routes/feed";
import * as hello from "./routes/hello";
import * as medium from "./routes/medium";
import * as ping from "./routes/ping";
import * as serve from "./routes/serve";

/** @type {Array<{match: (url: URL) => boolean, fetch: ExportedHandlerFetchHandler}>} */
const ROUTES = [
  hello, // GET /hello
  ping, // GET /ping
  bear, // POST /bear (Bear API)
  blog, // GET /blog/:slug (blog posts)
  feed, // GET /feed.json (RSS feed)
  medium, // GET /:slug (redirect old Medium posts)
  serve, // GET /:file (static assets)
];

/** @type {ExportedHandler} */
export default {
  fetch: async (request, env, context) => {
    const url = new URL(request.url);

    for (const route of ROUTES) {
      if (route.match(url)) {
        return await route.fetch(request, env, context);
      }
    }

    return new Response(null, { status: 404 });
  },
};
