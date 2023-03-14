import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test.serial("/blog/ should return list of posts", async (t) => {
  const res = await worker.fetch("/blog/");
  const html = await res.text();
  t.true(html.includes("<h1>Blog</h1>"), "should contain <h1> title");
});
