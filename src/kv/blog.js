/**
 * @param {KVNamespace<string>} kv
 * @param {string} slug
 */
export async function getPostBySlug(kv, slug) {
  const post = await kv.get(`blog-post:${slug}`, "json");
  return post;
}
