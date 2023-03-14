/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname === "/bear/";

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request) {
  const url = new URL(request.url);

  if (url.pathname === "/bear/sync") {
    if (request.method === "POST") {
      // const body = await request.json();

      // const kv = env.DB;

      // save all to db

      // get all
      // const list = await kv.search({ prefix: "blog-post:" });
      // const posts = await Promise.all(
      //   list.keys.map((key) => kv.get(key.name, "json"))
      // );

      return new Response(JSON.stringify({ todo: 1 }), {
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
