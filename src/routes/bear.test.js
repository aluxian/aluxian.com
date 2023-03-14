import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test.serial(
  "POST to /bear/sync should create and update posts not in db",
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
        needsSyncingIDs: [],
        deletedIDs: [],
        totalCount: 0,
      },
      "should return 0 IDs (empty db)"
    );

    // add new
    t.deepEqual(
      await sync({
        posts: [
          {
            id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
            updatedAt: "2021-01-01T00:00:00.000Z",
          },
        ],
      }),
      {
        needsSyncingIDs: ["1e4eebf5-5961-417e-9418-041b7bec6de6"],
        deletedIDs: [],
        totalCount: 1,
      },
      "should return ID of post that needs syncing (empty db -> 1 post)"
    );

    // add same
    t.deepEqual(
      await sync({
        posts: [
          {
            id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
            updatedAt: "2021-01-01T00:00:00.000Z",
          },
        ],
      }),
      {
        needsSyncingIDs: [],
        deletedIDs: [],
        totalCount: 1,
      },
      "should not return ID of post that does not need syncing (1 post -> 1 post with same updatedAt)"
    );

    // add updated
    t.deepEqual(
      await sync({
        posts: [
          {
            id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
            updatedAt: "2021-01-02T00:00:00.000Z",
          },
        ],
      }),
      {
        needsSyncingIDs: ["1e4eebf5-5961-417e-9418-041b7bec6de6"],
        deletedIDs: [],
        totalCount: 1,
      },
      "should return ID of post that needs syncing (1 post -> 1 post with different updatedAt)"
    );

    // delete
    t.deepEqual(
      await sync({
        posts: [],
      }),
      {
        needsSyncingIDs: [],
        deletedIDs: ["1e4eebf5-5961-417e-9418-041b7bec6de6"],
        totalCount: 0,
      },
      "should return IDs of posts that were deleted (1 post -> empty db)"
    );
  }
);

test.serial(
  "POST to /bear/sync should delete posts not in request",
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

    // add new
    t.deepEqual(
      await sync({
        posts: [
          {
            id: "1e4eebf5-5961-417e-9418-041b7bec6de6",
            updatedAt: "2021-01-01T00:00:00.000Z",
          },
        ],
      }),
      {
        needsSyncingIDs: ["1e4eebf5-5961-417e-9418-041b7bec6de6"],
        deletedIDs: [],
        totalCount: 1,
      },
      "should return ID of post that needs syncing (empty db -> 1 post)"
    );

    // delete
    t.deepEqual(
      await sync({
        posts: [],
      }),
      {
        needsSyncingIDs: [],
        deletedIDs: ["1e4eebf5-5961-417e-9418-041b7bec6de6"],
        totalCount: 0,
      },
      "should return IDs of posts that were deleted (1 post -> empty db)"
    );
  }
);
