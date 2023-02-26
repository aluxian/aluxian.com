/**
 * @type {(url: URL) => boolean}
 */
export const match = (url) => url.pathname === "/ping";

/**
 * @type {ExportedHandlerFetchHandler<Env>}
 */
export async function fetch() {
  return new Response("pong", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
