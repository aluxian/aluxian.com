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
     * @type {{id: string, shortId: string, slug: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}[]}
     */
    const posts = (await env.DB.get(`blog:posts`, "json")) || [];

    const html = `
      <h1>Blog</h1>
      <ul>
        ${posts
          .map(
            (post) => `
          <li>
            <a href="/blog/${post.slug}">${post.title}</a>
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
    if (!name) {
      return new Response(null, { status: 404 });
    }

    const ext = name.split(".").pop();
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
    if (!mimeType) {
      return new Response("unknown mime type for extension", { status: 500 });
    }

    const file = await env.DB.get(`blog:file:${name}`, "stream");
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
     * @type {{id: string, shortId: string, slug: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}[]}
     */
    const posts = (await env.DB.get(`blog:posts`, "json")) || [];

    const slug = url.pathname.replace("/blog/", "");
    if (!slug) {
      return new Response(null, { status: 404 });
    }

    const shortId = slug.split("-").pop();
    if (!shortId) {
      return new Response(null, { status: 404 });
    }

    const post = posts.find((post) => post.shortId === shortId);
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
