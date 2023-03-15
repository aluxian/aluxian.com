/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname.startsWith("/blog");

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/blog") {
    return new Response(null, { status: 301, headers: { Location: "/blog/" } });
  }

  if (url.pathname === "/blog/") {
    /**
     * @type {{id: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}[]}
     */
    const posts = (await env.DB.get(`blog:posts`, "json")) || [];

    const html = `
      <h1>Blog</h1>
      <ul>
        ${posts
          .map(
            (post) => `
          <li>
            <a href="/blog/${post.id}">${post.title}</a>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (url.pathname.startsWith("/blog/file/")) {
    const name = url.pathname.replace("/blog/file/", "");
    console.log("hey", "name", name);
    if (!name) {
      return new Response(null, { status: 404 });
    }

    const ext = name.split(".").pop();
    console.log("hey", "ext", ext);
    if (!ext) {
      return new Response(null, { status: 404 });
    }

    // blog:file:B4DF8BC4-BC48-4A44-A996-CD17BE8B86E4-11047-000005765D2DE37A/IMG_3495.png
    // blog:file:87D2E03B-3CA0-4C22-A373-35E3EF8B1DD3-11047-000005765D2FD621/IMG_3495.png

    // B4DF8BC4-BC48-4A44-A996-CD17BE8B86E4-11047-000005765D2DE37A

    const mimeType = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      txt: "text/plain",
      pdf: "application/pdf",
    }[ext];
    console.log("hey", "mimeType", mimeType);
    if (!mimeType) {
      return new Response("unknown mime type for extension", { status: 500 });
    }

    const file = await env.DB.get(`blog:file:${name}`, "stream");
    console.log("hey", "file", file);
    if (!file) {
      return new Response(null, { status: 404 });
    }

    return new Response(file, {
      headers: {
        "Content-Type": mimeType,
      },
    });
  }

  if (url.pathname.startsWith("/blog/")) {
    /**
     * @type {{id: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}[]}
     */
    const posts = (await env.DB.get(`blog:posts`, "json")) || [];

    const id = url.pathname.replace("/blog/", "");
    if (!id) {
      return new Response(null, { status: 404 });
    }

    const post = posts.find((post) => post.id === id);
    if (!post) {
      return new Response(null, { status: 404 });
    }

    return new Response(post.html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return new Response(null, { status: 404 });
}
