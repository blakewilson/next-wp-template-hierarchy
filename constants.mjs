/**
 * Set the URL to the graphql endpoint on WordPress set in WP GraphQL.
 */
export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  "https://blakewilson77.wpengine.com/graphql";

/**
 * Set the amount of time to cache each seed query.
 * This is the query that is ran for each uri to determine the template to render.
 */
export const SEED_QUERY_CACHE_SECONDS = 60 * 5;
