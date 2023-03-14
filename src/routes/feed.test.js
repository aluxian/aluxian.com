import test from "ava";
import "../testing/worker.js";

test("serve /feed.json", async (/** @type {import("ava".ExecutionContext<{worker: import("wrangler").UnstableDevWorker}>)} */ t) => {
  const { worker } = t.context;
  const res = await worker.fetch("/feed.json");
  const feed = await res.json();
  t.truthy(feed.version);
  t.truthy(feed.title);
  t.truthy(feed.language);
  t.truthy(feed.home_page_url);
  t.truthy(feed.feed_url);
  t.truthy(feed.description);
  t.truthy(feed.author.name);
  t.truthy(feed.author.url);
  t.truthy(feed.items);
  t.truthy(feed.items[0].id);
  t.truthy(feed.items[0].url);
  t.truthy(feed.items[0].title);
  t.truthy(feed.items[0].content_html);
  t.truthy(feed.items[0].date_published);
});
