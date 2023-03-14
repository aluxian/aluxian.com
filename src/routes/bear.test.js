import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test.serial(
  "POST to /bear/sync should upsert/delete posts from db",
  async (t) => {
    async function sync(payload) {
      const res = await worker.fetch("/bear/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      t.is(res.status, 200);
      return await res.json();
    }

    // empty sync
    t.deepEqual(
      await sync({
        posts: [],
      }),
      {
        posts: [],
        missingFiles: [],
        files: [],
      },
      "should return 0 posts (empty db)"
    );

    // upsert
    t.deepEqual(
      await sync({
        posts: [
          {
            id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
            modifiedAt: "2021-01-01T00:00:00.000Z",
            files: ["cat-pic.png"],
          },
        ],
      }),
      {
        posts: [
          {
            id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
            modifiedAt: "2021-01-01T00:00:00.000Z",
            files: ["cat-pic.png"],
          },
        ],
        missingFiles: ["cat-pic.png"],
        files: [],
      },
      "should return 1 post (empty db -> 1 post)"
    );

    // delete
    t.deepEqual(
      await sync({
        posts: [],
      }),
      {
        posts: [],
        missingFiles: [],
        files: [],
      },
      "should return 0 posts (1 post -> empty db)"
    );
  }
);

test.serial("POST to /bear/file should save file in db", async (t) => {
  async function sync(payload) {
    const res = await worker.fetch("/bear/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    t.is(res.status, 200);
    return await res.json();
  }

  async function uploadFile(name, payload) {
    const res = await worker.fetch(`/bear/file?name=${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
      },
      body: payload,
    });
    t.is(res.status, 200);
    return await res.text();
  }

  // upsert
  t.deepEqual(
    await sync({
      posts: [
        {
          id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
          modifiedAt: "2021-01-01T00:00:00.000Z",
          files: ["cat-pic.png"],
        },
      ],
    }),
    {
      posts: [
        {
          id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
          modifiedAt: "2021-01-01T00:00:00.000Z",
          files: ["cat-pic.png"],
        },
      ],
      missingFiles: ["cat-pic.png"],
      files: [],
    },
    "should return 1 post"
  );

  // upload
  t.deepEqual(
    await uploadFile("cat-pic.png", "catpng123"),
    "",
    "should save file"
  );

  // sync
  t.deepEqual(
    await sync({
      posts: [
        {
          id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
          modifiedAt: "2021-01-01T00:00:00.000Z",
          files: ["cat-pic.png"],
        },
      ],
    }),
    {
      posts: [
        {
          id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
          modifiedAt: "2021-01-01T00:00:00.000Z",
          files: ["cat-pic.png"],
        },
      ],
      missingFiles: [],
      files: ["cat-pic.png"],
    },
    "should return 1 post and 1 file"
  );
});
