import test from "ava";
import "../testing/worker.js";

test("serve /hello", async (/** @type {import("ava".ExecutionContext<{worker: import("wrangler").UnstableDevWorker}>)} */ t) => {
  const { worker } = t.context;
  const res = await worker.fetch("/hello");
  const text = await res.text();
  t.is(text, "Hello World!");
});
