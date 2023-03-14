import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test("respond to ping", async (t) => {
  const res = await worker.fetch("/ping");
  const text = await res.text();
  t.is(text, "pong");
});
