# Next.js WordPress Template Hierarchy Routing

This Next.js app replicates the [WordPress Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/#visual-overview), but in JavaScript!

## Getting Started

Install dependencies:

```bash
npm install
```

Set your WordPress GraphQL endpoint:

```bash
export NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-wp-instance.com/graphql
```

Run the dev server:

```bash
npm run dev
```

Now, navigate to any route (i.e. `http://localhost:3000/sample-page`), and in your server's `stdout`, you can see the possible templates to create! For example, "single" is a possible template for posts. In that case you would create `pages/single.js`, and all posts will be routed to that page. Additionally, you can also get more granular. For example, if a post is named "Hello World" with a slug of "hello-world", you could create `pages/single-sample-page.js` and the post with that slug will be routed to that page.

[Check out the WordPress template hierarchy for more info.](https://developer.wordpress.org/themes/basics/template-hierarchy/#visual-overview)

## How it works

This example project works by first disabling the native file based routing in Next.js, and then using a Next.js custom server to handle the routing ourselves. From there, we make a `nodeByUri` GraphQL request based on the server's `Request` url to get some basic info about the route: the `id`, `slug`, `templates`, etc. From there, we determine what templates are available from the `pages` directory, and render the most specific template available.

## Caveats

1. Currently, this approach does not support Static Site Generation (SSG). The `render()` method used in the a Next custom server will not properly pass the `query` argument to `getStaticProps`, which is needed to properly pass the `seedQuery`
2. A Next.js custom server is needed for this to work. This means you can not deploy to Vercel, Netlify. However, you can leverage a provider like [WP Engine Atlas](https://wpengine.com/atlas), which operates as a node server, not serverless functions like Vercel, Netlify, etc.
