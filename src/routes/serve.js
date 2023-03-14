import {
  getAssetFromKV,
  NotFoundError,
  MethodNotAllowedError,
} from "@cloudflare/kv-asset-handler";

/** @type {(url: URL) => boolean} */
export const match = () => true;

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace, __STATIC_CONTENT: any}>} */
export async function fetch(request, env, context) {
  /** @type {string} */
  const staticContentManifestJSON = await import(
    "__STATIC_CONTENT_MANIFEST"
  ).catch(() => "{}");

  /** @type {import("@cloudflare/kv-asset-handler").Options["ASSET_MANIFEST"]} */
  const ASSET_MANIFEST = JSON.parse(
    (staticContentManifestJSON && staticContentManifestJSON.default) ||
      staticContentManifestJSON
  );

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
}
