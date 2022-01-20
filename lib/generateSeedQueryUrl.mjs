import { GRAPHQL_ENDPOINT } from "../constants.mjs";

/**
 Seed Query. This query gets basic info about the URL, so we can properly route it:
 @example
 ```graphql
  fragment DatabaseIdentifier on DatabaseIdentifier {
    databaseId
  }

  fragment TermNode on TermNode {
    slug
  }

  fragment ContentNode on ContentNode {
    slug
  }

  query SeedQuery {
    nodeByUri(uri: "/testing-new-post") {
      __typename
      uri
      id
      templates
      ...DatabaseIdentifier
      ...TermNode
      ...ContentNode
    }
  }
  ```
 */
export function generateSeedQueryUrl(pathname) {
  return `${GRAPHQL_ENDPOINT}?query=fragment DatabaseIdentifier on DatabaseIdentifier {%0A%20 databaseId%0A}%0A%0Afragment TermNode on TermNode {%0A%20 slug%0A}%0A%0Afragment ContentNode on ContentNode {%0A%20 slug%0A}%0A%0Aquery SeedQuery {%0A%20 nodeByUri(uri%3A "${encodeURI(
    pathname
  )}") {%0A%20%20%20 __typename%0A%20%20%20 uri%0A%20%20%20 id%0A%20%20%20 templates%0A%20%20%20 ...DatabaseIdentifier%0A%20%20%20 ...TermNode%0A%20%20%20 ...ContentNode%0A%20 }%0A}%0A&operationName=SeedQuery`;
}
