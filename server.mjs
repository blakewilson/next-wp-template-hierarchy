import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { generateSeedQueryUrl } from "./lib/generateSeedQueryUrl.mjs";
import { getTemplate } from "./lib/getTemplate.mjs";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // If Next is serving a "_next" asset, handle it separately.
    if (pathname.startsWith("/_next")) {
      handle(req, res, parsedUrl);
      return;
    }

    /**
     * Generate a seed query to determine basic info about the WordPress URI and route
     * from there. Based on Jason Bahl's Seed Query Template Hierarchy Example
     *
     * @link https://github.com/jasonbahl/headless-wp-template-hierarchy/blob/master/express/app.js#L7
     */
    const seedQueryUrl = generateSeedQueryUrl(pathname);
    const nodeByUriRes = await fetch(seedQueryUrl);
    const json = await nodeByUriRes.json();

    const { nodeByUri } = json?.data;

    /**
     * If the nodeByUri response was null, a node does not exist for the given
     * uri. Return a 404.
     */
    if (nodeByUri === null) {
      app.render(req, res, "/404", query);
      return;
    }

    /**
     * The possible templates for this route, enabled by the FaustWP plugin.
     *
     * @link https://wordpress.org/plugins/faustwp/
     */
    const { templates } = nodeByUri;

    /**
     * Determine the most related template that exists for this route
     */
    const template = getTemplate(templates);

    /**
     * If there is no template found, either throw an error if on dev, or
     * render a 404 if on prod.
     */
    if (template === null) {
      if (dev) {
        throw new Error(
          `No template found for "${pathname}". Possible templates are: ${templates
            .map((template) => `pages/${template}.js`)
            .join(", ")}`
        );
      } else {
        app.render(req, res, "/404", query);
        return;
      }
    }

    console.log(
      `Possible templates for "${pathname}": `,
      templates.map((template) => `pages/${template}.js`)
    );
    console.log(`Using template "pages/${template}.js"`);

    /**
     * Render the request with the template determined above. Typically, this
     * third argument would be the appropriate "page" to render in Next.js.
     * We instead do our own routing, and disable Next's routing in next.config.js.
     *
     * Additionally, we merge in the seedQuery data from the nodeByUri response
     * to the query object so we can access it in getServerSideProps.
     * Unfortunately, this is not possible in getStaticProps, as query can not be
     * passed as expected.
     *
     * @link https://github.com/vercel/next.js/issues/10071
     */
    app.render(req, res, `/${template}`, {
      ...query,
      seedQuery: json?.data?.nodeByUri,
    });
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
