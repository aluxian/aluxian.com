import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test.serial("serve /feed.json (empty)", async (t) => {
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
  t.is(feed.items.length, 0);
});

test.serial("serve /feed.json (1 post)", async (t) => {
  async function sync(payload) {
    const res = await worker.fetch("/bear/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "test123",
      },
      body: JSON.stringify(payload),
    });
    t.is(res.status, 200);
    return await res.json();
  }

  t.deepEqual(
    await sync({
      posts: [
        {
          id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
          title: "Hello World",
          html: "<p>Hello World</p>",
          createdAt: "2021-01-01T00:00:00.000Z",
          modifiedAt: "2021-01-01T00:00:00.000Z",
        },
      ],
    }),
    {
      posts: [
        {
          id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
          title: "Hello World",
          html: "<p>Hello World</p>",
          createdAt: "2021-01-01T00:00:00.000Z",
          modifiedAt: "2021-01-01T00:00:00.000Z",
        },
      ],
      missingFiles: [],
      files: [],
    },
    "should return 1 post"
  );

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
  t.is(feed.items.length, 1);
  t.truthy(feed.items[0].id);
  t.truthy(feed.items[0].url);
  t.truthy(feed.items[0].title);
  t.truthy(feed.items[0].content_html);
  t.truthy(feed.items[0].date_published);

  t.deepEqual(
    await sync({
      posts: [],
    }),
    {
      posts: [],
      missingFiles: [],
      files: [],
    },
    "should clear db"
  );
});
