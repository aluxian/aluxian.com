import test from "ava";
import "../testing/worker.js";

test("redirect old Medium paths", async (/** @type {import("ava".ExecutionContext<{worker: import("wrangler").UnstableDevWorker}>)} */ t) => {
  const { worker } = t.context;
  const res = await worker.fetch(
    "/slides-from-droidcon-london-2019-78c7b746170b"
  );
  const text = await res.text();
  t.is(text, "");
  const location = res.headers.get("location");
  t.is(
    location,
    "https://medium.com/ar-blog/slides-from-droidcon-london-2019-78c7b746170b"
  );
});
