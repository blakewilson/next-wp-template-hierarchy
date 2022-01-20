import { gql } from "../client.mjs";

/**
 * Based on @jasonbahl Seed Query Template Hierarchy Example
 *
 * @link https://github.com/jasonbahl/headless-wp-template-hierarchy/blob/master/express/app.js#L7
 */
export const SEED_QUERY = gql`
  fragment DatabaseIdentifier on DatabaseIdentifier {
    databaseId
  }

  fragment TermNode on TermNode {
    slug
  }

  fragment Category on Category {
    slug
  }

  fragment ContentNode on ContentNode {
    slug
  }

  query SeedQuery($pathname: String!) {
    nodeByUri(uri: $pathname) {
      __typename
      uri
      id
      templates
      ...DatabaseIdentifier
      ...TermNode
      ...ContentNode
      ...Category
    }
  }
`;
