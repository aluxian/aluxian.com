import test from "ava";
import * as worker from "../testing/wrangler/worker.js";

test("redirect old Medium paths", async (t) => {
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
