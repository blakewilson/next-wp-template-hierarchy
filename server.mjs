import { createServer } from "http";
import next from "next";
import { parse } from "url";
import { getTemplate } from "./lib/getTemplate.mjs";
import { setSeedQueryOnReq } from "./lib/modifySeedQueryOnReq.mjs";
import { getSeedQueryForUri } from "./lib/seedQueryCache.mjs";

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
     * Use a seed query to determine basic info about the WordPress URI and make
     * routing decisions from there.
     */
    const { nodeByUri } = await getSeedQueryForUri(pathname);

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
      `> Possible templates for "${pathname}": `,
      templates.map((template) => `pages/${template}.js`)
    );
    console.log(`> Using template "pages/${template}.js"`);

    /**
     * Set the seed query on the request object so we can access it
     * in getServerSideProps with getSeedQueryFromContext.
     */
    req = setSeedQueryOnReq(req, nodeByUri);

    /**
     * Render the request with the template determined above. Typically, this
     * third argument would be the appropriate "page" to render in Next.js.
     * We instead do our own routing, and disable Next's routing in next.config.js.
     *
     * @link https://github.com/vercel/next.js/issues/10071
     */
    app.render(req, res, `/${template}`, query);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
