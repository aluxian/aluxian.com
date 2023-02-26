/// <reference types="ava" />

import anyTest from "ava";

import * as wranglerConfig from "../../wrangler.json" assert { type: "json" };

/**
 * @type {import("ava").TestFn<AvaCtx>}
 */
const test = anyTest;

import { Miniflare, LogLevel, Log } from "miniflare";
import * as esbuild from "esbuild";

test.before(async (t) => {
  t.context.bundle = await esbuild.build({
    entryPoints: [new URL("../../src/index.js", import.meta.url).pathname],
    bundle: true,
    minify: true,
    sourcemap: "inline",
    target: "es2022",
    platform: "neutral",
    mainFields: ["es2015", "browser", "module", "main"],
    conditions: ["browser", "module", "import"],
    external: ["__STATIC_CONTENT_MANIFEST"],
    treeShaking: true,
    write: false,
  });
});

test.beforeEach((t) => {
  t.context.miniflare = new Miniflare({
    script: t.context.bundle.outputFiles[0].text,
    sourceMap: true,
    port: 8787,
    name: wranglerConfig.name,
    sitePath: new URL("../../public", import.meta.url).pathname,
    siteExclude: ["node_modules", ".DS_Store"],
    compatibilityDate: wranglerConfig.compatibility_date,
    modules: true,
    bindings: {},
    kvNamespaces: ["MOLIN_KV_DB"],
  });
});

test.afterEach(async (t) => {
  const { miniflare } = t.context;
  await miniflare.dispose();
});

test("worker should respond to ping", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch("http://localhost:8787/ping");
  const text = await res.text();
  t.is(text, "pong");
});
