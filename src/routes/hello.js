/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname === "/hello";

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch() {
  return new Response("Hello World!", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
