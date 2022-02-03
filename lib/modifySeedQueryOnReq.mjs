/**
 * Set the seed query data on the request object.
 *
 * @param {object} req The request object
 * @param {object|null} seedQuery The seed query data fetched via getSeedQueryForUri
 */
export function setSeedQueryOnReq(req, seedQuery) {
  req.__seedQuery = seedQuery;

  return req;
}

/**
 * Get the seed query data on the request object.
 *
 * @param {object} req The request object
 * @returns {object|null} The seed query data
 */
export function getSeedQueryFromReq(req) {
  if (!req.__seedQuery) {
    throw new Error("Seed query not set on request");
  }

  return req.__seedQuery;
}
