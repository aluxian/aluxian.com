/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname === "/feed.json";

/** @type {ExportedHandlerFetchHandler<{DB: KVNamespace}>} */
export async function fetch(request, env) {
  /**
   * @type {{id: string, shortId: string, slug: string, title: string, text: string, tags: string[], link: string, createdAt: string, modifiedAt: string, html: string, files: string[]}[]}
   */
  const posts = (await env.DB.get(`blog:posts`, "json")) || [];

  const data = {
    version: "https://jsonfeed.org/version/1.1",
    title: "AR.Blog()",
    language: "en",
    home_page_url: "https://www.aluxian.com/",
    feed_url: "https://www.aluxian.com/feed.json",
    description: "A blog about web development, programming, and other stuff.",
    author: {
      name: "Alexandru Rosianu",
      url: "https://www.aluxian.com/",
    },
    items: posts.map((post) => ({
      id: post.id,
      url: `https://www.aluxian.com/${post.id}`,
      title: post.title,
      content_html: post.html,
      date_published: post.createdAt,
    })),
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
