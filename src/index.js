import { html } from "./html";

/** @type {import('@cloudflare/workers-types').ExportedHandler} */
export default {
  fetch: async (request, env, context) => {
    const url = new URL(request.url);

    if (url.pathname === "/hello") {
      return new Response("Hello World!");
    }

    if (url.pathname === "/") {
      return new Response(
        html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />

    <title>AR</title>

    <meta name="title" content="Molin AI — Your partner in writing" />
    <meta
      name="description"
      content="Molin is an AI that writes unique and high quality content for you."
    />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/favicon-16x16.png"
    />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="apple-mobile-web-app-title" content="Molin" />
    <meta name="application-name" content="Molin" />
    <meta name="msapplication-TileColor" content="#5bbad5" />
    <meta name="theme-color" content="#ffffff" />

    <!-- TODO: add back but only for / -->
    <link rel="canonical" href="https://molin.ai/" />

    <!-- TODO: use https://fontsource.org/docs/variable-fonts -->
    <!-- TODO: use something similar to bundle the SVG of MD icons -->

    <script type="module" src="/bundles/index.js"></script>
    <script type="module" src="/bundles/login.js"></script>

    <link rel="stylesheet" href="/bundles/index.css" />
  </head>
  <body></body>
    <m-cookie-banner></m-cookie-banner>
  </body>
</html>
    `,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    if (url.pathname === "/feed.json") {
      return new Response(
        JSON.stringify({
          version: "https://jsonfeed.org/version/1.1",
          title: "AR.Blog()",
          language: "en",
          home_page_url: "https://www.aluxian.com/",
          feed_url: "https://www.aluxian.com/feed.json",
          description:
            "A blog about web development, programming, and other stuff.",
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
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (url.pathname === "/blog/api/sync" && request.method === "POST") {
      const body = await request.json();

      /** @type {import('@cloudflare/workers-types').KVNamespace} */
      const kv = env.KV;

      // save all to db

      // get all
      const list = await kv.search({ prefix: "blog-post:" });
      const posts = await Promise.all(
        list.keys.map((key) => kv.get(key.name, "json"))
      );
    }

    if (url.pathname.startsWith("/blog/")) {
      const postUrl = url.pathname.replace("/blog/", "");
      const post = await env.KV.get(`blog-post:${postUrl}`, "json");

      if (post) {
        return new Response(html``, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      }

      return new Response("Not Found", { status: 404 });
    }

    return new Response("Not Found", { status: 404 });
  },
};

// redir URLs
// https://medium.com/ar-blog/slides-from-droidcon-london-2019-78c7b746170b
