import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test("serve /hello", async (t) => {
  const res = await worker.fetch("/hello");
  const text = await res.text();
  t.is(text, "Hello World!");
});
