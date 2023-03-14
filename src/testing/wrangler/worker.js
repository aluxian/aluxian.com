/** @type {import("wrangler").UnstableDevWorker['fetch']} */
export async function fetch(input, init) {
  /** @type {import("ava/plugin").SharedWorker.Plugin.Protocol} */
  let shared = globalThis.shared;
  if (!shared) {
    const { registerSharedWorker } = await import("ava/plugin");
    shared = registerSharedWorker({
      filename: import.meta.url,
      supportedProtocols: ["ava-4"],
    });
    await shared.available;
    globalThis.shared = shared;
  }

  const call = serializeCall("fetch", [input, init]);
  const published = shared.publish(call);

  for await (const message of published.replies()) {
    return await deserializeResponse(message.data);
  }
}

/** @type {import("ava/plugin").SharedWorker.Factory} */
export default async ({ negotiateProtocol }) => {
  const { readFileSync } = await import("fs");
  const config = JSON.parse(readFileSync("wrangler.json", "utf-8"));

  const { unstable_dev } = await import("wrangler");
  const worker = await unstable_dev(config["main"], {
    kv: config["kv_namespaces"],
    site: config["site"]["bucket"],
    siteExclude: config["site"]["exclude"],
    experimental: { disableExperimentalWarning: true },
  });

  const main = negotiateProtocol(["ava-4"]);
  main.ready();

  for await (const message of main.subscribe()) {
    /** @type {ReturnType<serializeCall>} */
    const call = message.data;

    switch (call.fn) {
      case "fetch": {
        const res = await worker.fetch(...call.args);
        message.reply(await serializeResponse(res));
        break;
      }

      default: {
        throw new Error(`Unknown function ${call.fn}`);
      }
    }
  }

  await worker.stop();
};

function serializeCall(fn = "", args = []) {
  return { fn, args };
}

/** @param {Response} res */
async function serializeResponse(res) {
  const { Buffer } = await import("buffer");

  const arrayBuffer = await res.arrayBuffer();
  const body = Buffer.from(arrayBuffer).toString("base64");

  return {
    headers: Object.fromEntries(res.headers),
    status: res.status,
    statusText: res.statusText,
    body: body,
  };
}

/** @param {Awaited<ReturnType<serializeResponse>>} data */
async function deserializeResponse(data) {
  const { Buffer } = await import("buffer");
  const { Readable } = await import("stream");

  const buffer = Buffer.from(data.body, "base64");
  const body = Readable.from(buffer);

  return new Response(body, {
    headers: new Headers(data.headers),
    status: data.status,
    statusText: data.statusText,
  });
}
