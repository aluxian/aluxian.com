/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname.startsWith("/blog/");

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request, env) {
  const url = new URL(request.url);

  /**
   * @type {{id: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}[]}
   */
  const posts = (await env.DB.get(`blog:posts`, "json")) || [];

  // list all posts
  if (url.pathname === "/blog/") {
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

  // show a post
  const slug = url.pathname.replace("/blog/", "");
  const post = posts.find((post) => post.id === slug);

  if (post) {
    return new Response(post.html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return new Response(null, { status: 404 });
}
