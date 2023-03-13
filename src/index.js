/// <reference types="@cloudflare/workers-types" />

import {
  getAssetFromKV,
  NotFoundError,
  MethodNotAllowedError,
} from "@cloudflare/kv-asset-handler";

import __STATIC_CONTENT_MANIFEST from "__STATIC_CONTENT_MANIFEST";

import * as bear from "./routes/bear";
import * as blog from "./routes/blog";
import * as feed from "./routes/feed";
import * as hello from "./routes/hello";
import * as medium from "./routes/medium";
import * as ping from "./routes/ping";

/** @type {Array<{match: (url: URL) => boolean, fetch: ExportedHandlerFetchHandler<any>}>} */
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
const ASSET_MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST);

/**
 * @typedef {{DB: KVNamespace, __STATIC_CONTENT: any}} Env
 * @type {ExportedHandler<Env>}
 */
export default {
  fetch: async (request, env, context) => {
    const url = new URL(request.url);

    for (const route of ROUTES) {
      if (route.match(url)) {
        return await route.fetch(request, env, context);
      }
    }

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
