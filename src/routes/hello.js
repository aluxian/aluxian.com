/// <reference types="@cloudflare/workers-types" />

/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname === "/hello";

/** @type {ExportedHandlerFetchHandler<Env>} */
export async function fetch() {
  return new Response("Hello World!", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
