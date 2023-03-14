/**
 * @typedef {{id: string, createdAt: string, updatedAt: string, content: string, files: string[]}} Post
 * @typedef {{content: string}} File
 */

/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname.startsWith("/bear/");

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/bear/sync") {
    if (request.method === "POST") {
      /** @type {{posts: Post[]}} */
      const body = await request.json();
      const syncPosts = body.posts || [];

      /** @type {Post[]} */
      const existingPosts = (await env.DB.get(`posts`, "json")) || [];

      // not in DB or updatedAt is different
      const needsSyncing = syncPosts.filter(
        (syncPost) =>
          !existingPosts.find(
            (existingPost) =>
              existingPost.id === syncPost.id &&
              existingPost.updatedAt === syncPost.updatedAt
          )
      );

      // in DB but not in syncPosts
      const deleted = existingPosts.filter(
        (existingPost) =>
          !syncPosts.find((syncPost) => syncPost.id === existingPost.id)
      );

      const updatedPosts = existingPosts
        // remove deleted
        .filter(
          (existingPost) =>
            !deleted.find((deletedPost) => deletedPost.id === existingPost.id)
        )
        // update with sync data
        .map((existingPost) => ({
          ...existingPost,
          ...syncPosts.find((syncPost) => syncPost.id === existingPost.id),
        }))
        // add new ones
        .concat(
          syncPosts.filter(
            (syncPost) =>
              !existingPosts.find(
                (existingPost) => existingPost.id === syncPost.id
              )
          )
        );

      // persist
      await env.DB.put(`posts`, JSON.stringify(updatedPosts));

      // response for client and tests
      const out = {
        needsSyncingIDs: needsSyncing.map((syncPost) => syncPost.id),
        deletedIDs: deleted.map((existingPost) => existingPost.id),
        totalCount: updatedPosts.length,
      };

      return new Response(JSON.stringify(out), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(null, { status: 405 });
    }
  }

  return new Response(null, { status: 404 });
}
