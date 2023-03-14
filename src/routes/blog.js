/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname.startsWith("/blog/");

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request, env) {
  const url = new URL(request.url);

  // list all posts
  if (url.pathname === "/blog/") {
    return new Response("list", {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  // show a post
  const slug = url.pathname.replace("/blog/", "");
  const posts = await env.DB.get(`blog:posts`, "json");
  const post = posts.find((post) => post.slug === slug);

  if (post) {
    return new Response(JSON.stringify(post), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return new Response(null, { status: 404 });
}
