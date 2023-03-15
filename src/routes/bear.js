import base from "base-x";

/** @type {(array: Uint8Array) => string} */
const base36 = base("0123456789abcdefghijklmnopqrstuvwxyz");

/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname.startsWith("/bear/");

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace, AUTH_SECRET: string}>} */
export async function fetch(request, env) {
  const url = new URL(request.url);

  if (request.headers.get("Authorization") !== env.AUTH_SECRET) {
    return new Response(null, { status: 401 });
  }

  if (url.pathname === "/bear/sync") {
    if (request.method === "POST") {
      /** @type {{posts: Array<{tags: string[], files: string[]}>}} */
      const body = await request.json();
      const posts = body.posts || [];

      // fix arrays (Siri Shortcuts limitation)
      for (const post of posts) {
        post.files = post.files.filter((file) => !!file);
        post.tags = post.tags.filter((file) => !!file);
      }

      // generate short ids
      for (const post of posts) {
        const myDigest = await crypto.subtle.digest(
          { name: "SHA-1" },
          new TextEncoder().encode(post.id)
        );

        post.shortId = base36.encode(new Uint8Array(myDigest)).substring(0, 6);

        // check for collisions
        if (posts.some((p) => p.shortId === post.shortId && p.id !== post.id)) {
          return new Response("shortId collision", { status: 500 });
        }
      }

      // generate slugs
      for (const post of posts) {
        post.slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        post.slug += "-" + post.shortId;
      }

      // persist posts (overwrite)
      await env.DB.put(`blog:posts`, JSON.stringify(posts));

      // query all existing files
      const fileList = await env.DB.list({ prefix: "blog:file:" });
      if (!fileList.list_complete) {
        return new Response("KV list_complete = false", { status: 500 });
      }

      // remove files that are not referenced by any post
      const filesToDelete = fileList.keys
        .map((key) => key.name)
        .filter(
          (name) =>
            !posts.some((post) =>
              (post.files || []).includes(name.replace("blog:file:", ""))
            )
        );
      await Promise.all(filesToDelete.map((name) => env.DB.delete(name)));

      // send back list of files that are missing
      const missingFiles = posts.flatMap((post) =>
        (post.files || []).filter(
          (file) =>
            !fileList.keys.some((key) => key.name === `blog:file:${file}`)
        )
      );

      // send back list of all files
      const files = fileList.keys
        .filter((key) => !filesToDelete.includes(key.name))
        .map((key) => key.name.replace("blog:file:", ""));

      // pretty print output
      const output = {
        posts,
        files,
        missingFiles,
      };
      const outputJSON = JSON.stringify(output, null, 2);

      return new Response(outputJSON, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(null, { status: 405 });
    }
  }

  if (url.pathname === "/bear/file") {
    if (request.method === "POST") {
      const url = new URL(request.url);

      const name = url.searchParams.get("name");
      if (!name) {
        return new Response(null, { status: 400 });
      }

      /**
       * @type {{files: string[]}[]}
       */
      const posts = (await env.DB.get(`blog:posts`, "json")) || [];

      // check if file is referenced by any post
      if (!posts.some((post) => (post.files || []).includes(name))) {
        return new Response("file not referenced by any posts", {
          status: 400,
        });
      }

      // save file
      await env.DB.put(`blog:file:${name}`, request.body);

      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 405 });
    }
  }

  return new Response(null, { status: 404 });
}
