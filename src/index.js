import {
  getAssetFromKV,
  NotFoundError,
  MethodNotAllowedError,
} from "@cloudflare/kv-asset-handler";

// import __STATIC_CONTENT_MANIFEST from "__STATIC_CONTENT_MANIFEST";
// todo: can i get that from env? or dynamic import?

import * as bear from "./routes/bear";
import * as blog from "./routes/blog";
import * as feed from "./routes/feed";
import * as hello from "./routes/hello";
import * as medium from "./routes/medium";
import * as ping from "./routes/ping";

/**
 * @type {Array<{match: (url: URL) => boolean, fetch: import("@cloudflare/workers-types").ExportedHandlerFetchHandler<any>}>}
 */
const ROUTES = [
  hello, // GET /hello
  ping, // GET /ping
  bear, // POST /bear (Bear API)
  blog, // GET /blog/:slug (blog posts)
  feed, // GET /feed.json (RSS feed)
  medium, // GET /:slug (redirect old Medium posts)
];

/**
 * @type {import("@cloudflare/kv-asset-handler").Options["ASSET_MANIFEST"]}
 */
// const ASSET_MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST);

/**
 * @typedef {{ALUXIAN_COM_DB: import("@cloudflare/workers-types").KVNamespace, __STATIC_CONTENT: any}} Env
 * @type {import("@cloudflare/workers-types").ExportedHandler<Env>}
 */
export default {
  fetch: async (request, env, context) => {
    const url = new URL(request.url);

    // try match a route
    for (const route of ROUTES) {
      if (route.match(url)) {
        return await route.fetch(request, env, context);
      }
    }

    /**
     * Miniflare does not yet support dynamic imports (only required during development).
     * @see https://github.com/cloudflare/wrangler2/issues/2326
     */
    const staticContentManifestJSON = await import(
      "__STATIC_CONTENT_MANIFEST"
    ).catch(() => "{}");
    const ASSET_MANIFEST = JSON.parse(
      (staticContentManifestJSON && staticContentManifestJSON.default) ||
        staticContentManifestJSON
    );

    // const ASSET_MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST);

    // try match a static asset
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: (promise) => context.waitUntil(promise),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: ASSET_MANIFEST,
        }
      );
    } catch (err) {
      if (err instanceof NotFoundError) {
        return new Response(null, { status: 404 });
      }
      if (err instanceof MethodNotAllowedError) {
        return new Response(null, { status: 405 });
      }
      return new Response(null, { status: 500 });
    }
  },
};
