import test from "ava";
import { unstable_dev } from "wrangler";

test.before(
  async (
    /** @type {import("ava".ExecutionContext<{worker: import("wrangler").UnstableDevWorker}>)} */ t
  ) => {
    const worker = await unstable_dev("src/index.js", {
      kv: [{ binding: "DB", preview_id: "517115c84e464df3b24089f7065bd54b" }],
      site: "public/",
      siteExclude: ["node_modules", ".DS_Store"],
      experimental: { disableExperimentalWarning: true },
    });
    t.context.worker = worker;
  }
);

test.after(
  async (
    /** @type {import("ava".ExecutionContext<{worker: import("wrangler").UnstableDevWorker}>)} */ t
  ) => {
    const { worker } = t.context;
    await worker.stop();
  }
);
