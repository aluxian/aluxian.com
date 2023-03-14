/** @type {import("ava/plugin").SharedWorker.Plugin.Protocol} */
let shared;

/** @type {(input?: RequestInfo, init?: RequestInit) => Promise<Response>} */
export async function fetch(input, init) {
  if (!shared) {
    const { registerSharedWorker } = await import("ava/plugin");
    shared = registerSharedWorker({
      filename: import.meta.url,
      supportedProtocols: ["ava-4"],
    });
  }

  await shared.available;

  const published = shared.publish({ input, init });

  for await (const message of published.replies()) {
    const ser = message.data;

    const { Readable } = await import("stream");
    const body = Readable.from([ser.body]);

    return new Response(body, {
      headers: new Headers(ser.headers),
      status: ser.status,
      statusText: ser.statusText,
    });
  }
}

/** @type {import("ava/plugin").SharedWorker.Factory} */
export default async ({ negotiateProtocol }) => {
  const main = negotiateProtocol(["ava-4"]);

  const { unstable_dev } = await import("wrangler");

  const worker = await unstable_dev("src/index.js", {
    kv: [{ binding: "DB", preview_id: "517115c84e464df3b24089f7065bd54b" }],
    site: "public/",
    siteExclude: ["node_modules", ".DS_Store"],
    experimental: { disableExperimentalWarning: true },
  });

  main.ready();

  for await (const message of main.subscribe()) {
    /** @type {{input?: RequestInfo, init?: RequestInit}} */
    const data = message.data;
    const res = await worker.fetch(data.input, data.init);
    message.reply({
      headers: Object.fromEntries(res.headers),
      status: res.status,
      statusText: res.statusText,
      body: await res.text(),
    });
  }
};
