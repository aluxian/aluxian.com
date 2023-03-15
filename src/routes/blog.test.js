import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test("/blog/ should return list of posts", async (t) => {
  const res = await worker.fetch("/blog/");
  const html = await res.text();
  t.true(html.includes("<h1>Blog</h1>"), "should contain <h1> title");
});

test("/blog should redirect to /blog/", async (t) => {
  const res = await worker.fetch("/blog");
  t.is(res.status, 301);
  t.is(res.headers.get("Location"), "/blog/");
});
