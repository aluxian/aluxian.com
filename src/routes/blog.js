/**
 * @type {(url: URL) => boolean}
 */
export const match = (url) => url.pathname.startsWith("/blog/");

/**
 * @type {ExportedHandlerFetchHandler<Env>}
 */
export async function fetch(request, env) {
  const url = new URL(request.url);
  const postUrl = url.pathname.replace("/blog/", "");
  const post = await env.ALUXIAN_COM_DB.get(`blog-post:${postUrl}`, "json");

  if (post) {
    return new Response("", {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return new Response(null, { status: 404 });
}
