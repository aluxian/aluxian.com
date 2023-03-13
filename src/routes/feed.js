/// <reference types="@cloudflare/workers-types" />

/** @type {(url: URL) => boolean} */
export const match = (url) => url.pathname === "/feed.json";

/** @type {ExportedHandlerFetchHandler<Env>} */
export async function fetch() {
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
    items: [
      {
        id: "{{ absolutePostUrl }}",
        url: "{{ absolutePostUrl }}",
        title: "{{ post.data.title }}",
        content_html: "",
        date_published: "{{ post.date | dateToRfc3339 }}",
      },
    ],
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
