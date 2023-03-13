import anyTest from "ava";
import * as wranglerConfig from "../../wrangler.json" assert { type: "json" };
import { Miniflare, LogLevel, Log } from "miniflare";
import * as esbuild from "esbuild";

/**
 * @type {import("ava").TestFn<AvaCtx>}
 */
const test = anyTest;

class AvaMiniflareLog /*extends Log*/ {
  /** @type {import("ava").ExecutionContext<AvaCtx>} */
  #t;

  constructor(/** @type {import("ava").ExecutionContext<AvaCtx>} */ t) {
    // super();
    this.#t = t;
  }

  log(message) {
    this.logWithLevel(LogLevel.NONE, message);
  }

  logWithLevel(level, message) {
    switch (level) {
      case LogLevel.ERROR:
        return this.#t.log("error", message);
      case LogLevel.WARN:
        return this.#t.log("warn", message);
      case LogLevel.INFO:
        return this.#t.log("info", message);
      case LogLevel.DEBUG:
        return this.#t.log("debug", message);
      case LogLevel.VERBOSE:
        return this.#t.log("verbose", message);
      default:
        return this.#t.log(message);
    }
  }

  error(message) {
    this.logWithLevel(LogLevel.ERROR, message);
  }

  warn(message) {
    this.logWithLevel(LogLevel.WARN, message);
  }

  info(message) {
    this.logWithLevel(LogLevel.INFO, message);
  }

  debug(message) {
    this.logWithLevel(LogLevel.DEBUG, message);
  }

  verbose(message) {
    this.logWithLevel(LogLevel.VERBOSE, message);
  }
}

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
    log: new AvaMiniflareLog(t),
    compatibilityDate: wranglerConfig.compatibility_date,
    modules: true,
    bindings: {},
    kvNamespaces: ["MOLIN_KV_DB"],
  });
});

// {

//   "main": "dist/index.js",

//   "account_id": "4ff4a37f04d54fb2a610ab6ba66cfcfe",
//   "workers_dev": true,
//   "route": {
//     "pattern": "aluxian.com",
//     "custom_domain": true,
//     "zone_id": "451d1cf4276042d2b4540d78118c74b9"
//   },
//   "kv_namespaces": [
//     {
//       "binding": "ALUXIAN_COM_DB",
//       "id": "ebc374008579473b95a4be2603627cba",
//       "preview_id": "517115c84e464df3b24089f7065bd54b"
//     }
//   ],
//   "site": {
//     "bucket": "./public",
//     "exclude": ["node_modules", ".DS_Store"]
//   },
//   "vars": {},
//   "build": {
//     "command": "npm run build"
//   }
// }

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

test("worker should serve /robots.txt", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch("http://localhost:8787/robots.txt");
  const text = await res.text();
  t.true(text.includes("User-agent: *"));
});

test("worker should serve /browserconfig.xml", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch(
    "http://localhost:8787/browserconfig.xml"
  );
  const text = await res.text();
  t.true(text.includes("<browserconfig>"));
});

test("worker should serve /site.webmanifest", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch(
    "http://localhost:8787/site.webmanifest"
  );
  const text = await res.text();
  t.true(text.includes("android-chrome-192x192.png"));
});

test("worker should serve /*.png", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch(
    "http://localhost:8787/android-chrome-192x192.png"
  );
  const buffer = await res.arrayBuffer();
  t.true(buffer.byteLength > 1000);
});

test("worker should serve /*.ico", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch(
    "http://localhost:8787/favicon.ico"
  );
  const buffer = await res.arrayBuffer();
  t.true(buffer.byteLength > 1000);
});

test("worker should serve /*.svg", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch(
    "http://localhost:8787/safari-pinned-tab.svg"
  );
  const text = await res.text();
  t.true(text.startsWith("<?xml"));
});

test("worker should serve /", async (t) => {
  const { miniflare } = t.context;
  const res = await miniflare.dispatchFetch("http://localhost:8787/");
  const text = await res.text();
  t.true(text.trim().startsWith("<!DOCTYPE html>"));
});
