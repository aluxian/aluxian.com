/**
 * @typedef {{id: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}} Post
 */

/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname.startsWith("/bear/");

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/bear/sync") {
    if (request.method === "POST") {
      /** @type {{posts: Post[]}} */
      const body = await request.json();
      const posts = body.posts || [];

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
              post.files.includes(name.replace("blog:file:", ""))
            )
        );
      await Promise.all(filesToDelete.map((name) => env.DB.delete(name)));

      // send back list of files that are missing
      const missingFiles = posts.flatMap((post) =>
        post.files.filter(
          (file) =>
            !fileList.keys.some((key) => key.name === `blog:file:${file}`)
        )
      );

      // send back list of all files
      const files = fileList.keys
        .filter((key) => !filesToDelete.includes(key.name))
        .map((key) => key.name.replace("blog:file:", ""));

      const output = {
        posts,
        files,
        missingFiles,
      };

      return new Response(JSON.stringify(output), {
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

      await env.DB.put(`blog:file:${name}`, request.body);

      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 405 });
    }
  }

  return new Response(null, { status: 404 });
}
