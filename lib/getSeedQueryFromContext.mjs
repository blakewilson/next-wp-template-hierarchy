import { getSeedQueryFromReq } from "./modifySeedQueryOnReq.mjs";

/**
 * Get the seed query data from the Next.js SSG context.
 *
 * @param {object} ctx The getServerSideProps context in Next.js
 * @returns {object|null} The seed query data
 */
export function getSeedQueryFromContext(ctx) {
  // Loosely check for getStaticProps
  if (!ctx.req || (!ctx.resolvedUrl && ctx.params)) {
    throw new Error(
      "Using getStaticProps when retrieving the seed query is not supported. Please use getServerSideProps instead."
    );
  }

  return getSeedQueryFromReq(ctx.req);
}
