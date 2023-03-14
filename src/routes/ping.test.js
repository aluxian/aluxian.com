import test from "ava";
import "../testing/worker.js";

test("respond to ping", async (/** @type {import("ava".ExecutionContext<{worker: import("wrangler").UnstableDevWorker}>)} */ t) => {
  const { worker } = t.context;
  const res = await worker.fetch("/ping");
  const text = await res.text();
  t.is(text, "pong");
});
