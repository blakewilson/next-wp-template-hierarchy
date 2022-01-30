import { client } from "../client.mjs";
import { SEED_QUERY_CACHE_SECONDS } from "../constants.mjs";
import { SEED_QUERY } from "../queries/SEED_QUERY.mjs";

/**
 * Store the seed query data where the key is the uri, and the value is
 * an object with "data" and "expires" keys.
 *
 * @example
 * ```js
 * {
 *   "/": {
 *     expires: 1643506233,
 *     data: {...}
 *   }
 * }
 * ```
 */
export const _cache = {};

/**
 * Get the seed query data for the given uri if it exists in the cache.
 *
 * @param {string} uri The WordPress uri. e.g. "/about/".
 * @returns {object|null|undefined} The seed query data for the given uri if it exists.
 */
export function getUriFromCache(uri) {
  return _cache[uri];
}

/**
 * Get a unix timestamp
 *
 * @link https://en.wikipedia.org/wiki/Unix_time
 */
export function getUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Get the seed query for a given uri.
 * If the seed query is in the cache and not expired, it will be returned.
 * Otherwise, the seed query will be fetched and cached.
 *
 * @param {string} uri The WordPress uri. e.g. "/about/".
 * @returns {object|null} The seed query data for the given uri.
 */
export async function getSeedQueryForUri(uri) {
  const cachedUri = getUriFromCache(uri);

  if (cachedUri && cachedUri.expires > getUnixTimestamp()) {
    console.log(`> Seed query cache hit for "${uri}"`);
    return cachedUri.data;
  }

  const { data } = await client.query({
    query: SEED_QUERY,
    variables: {
      pathname: uri,
    },
  });

  console.log(`> Seed query cache miss for "${uri}"`);
  return setSeedQueryForUri(uri, data);
}

/**
 * Set the seed query data in the cache for a given uri.
 *
 * @param {string} uri The WordPress uri. e.g. "/about/".
 * @param {object|null} data The seed query data for the given uri.
 *
 * @returns {object|null} data The seed query data for the given uri.
 */
export function setSeedQueryForUri(uri, data) {
  _cache[uri] = {
    expires: getUnixTimestamp() + SEED_QUERY_CACHE_SECONDS,
    data,
  };

  return data;
}
