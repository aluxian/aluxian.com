import test from "ava";
import * as worker from "../testing/worker.js";

test("serve / from /index.html", async (t) => {
  const res = await worker.fetch("/");
  const text = await res.text();
  t.true(
    text.trim().startsWith("<!DOCTYPE html>"),
    "index.html should start with `<!DOCTYPE html>`"
  );
});

test("serve /index.html", async (t) => {
  const res = await worker.fetch("/index.html");
  const text = await res.text();
  t.true(
    text.trim().startsWith("<!DOCTYPE html>"),
    "index.html should start with `<!DOCTYPE html>`"
  );
});

test("serve /robots.txt", async (t) => {
  const res = await worker.fetch("/robots.txt");
  const text = await res.text();
  t.true(
    text.includes("User-agent: *"),
    "robots.txt should contain `User-agent: *`"
  );
});

test("serve /browserconfig.xml", async (t) => {
  const res = await worker.fetch("/browserconfig.xml");
  const text = await res.text();
  t.true(
    text.includes("<browserconfig>"),
    "browserconfig.xml should contain `<browserconfig>`"
  );
});

test("serve /site.webmanifest", async (t) => {
  const res = await worker.fetch("/site.webmanifest");
  const text = await res.text();
  t.true(
    text.includes("android-chrome-192x192.png"),
    "site.webmanifest should contain `android-chrome-192x192.png`"
  );
});

test("serve /*.png", async (t) => {
  const res = await worker.fetch("/android-chrome-192x192.png");
  const buffer = await res.arrayBuffer();
  t.true(
    buffer.byteLength > 1000,
    "android-chrome-192x192.png should be larger than 1000 bytes"
  );
});

test("serve /*.ico", async (t) => {
  const res = await worker.fetch("/favicon.ico");
  const buffer = await res.arrayBuffer();
  t.true(
    buffer.byteLength > 1000,
    "favicon.ico should be larger than 1000 bytes"
  );
});

test("serve /*.svg", async (t) => {
  const res = await worker.fetch("/safari-pinned-tab.svg");
  const text = await res.text();
  t.true(
    text.startsWith("<?xml"),
    "safari-pinned-tab.svg should start with `<?xml`"
  );
});
