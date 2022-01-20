import { gql } from "@apollo/client";
import client from "../client.mjs";
import Link from "next/link";

export default function Category({
  data: {
    category: { name },
    posts,
  },
}) {
  console.log(posts);
  return (
    <>
      <h1>Category: {name}</h1>

      <h2>Posts</h2>
      <ul>
        {posts.edges.map(({ node: { id, uri, title } }) => (
          <li key={id}>
            <Link href={uri}>
              <a>{title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getServerSideProps(context) {
  const seedQuery = context.query.seedQuery;

  /**
   * Avoiding using nodeByUri here as the category uri returned includes the
   * full URL, which is a bug.
   *
   * @link https://github.com/wp-graphql/wp-graphql/pull/2212
   */
  const { data } = await client.query({
    query: gql`
      query Category {
        category(id: "${seedQuery.slug}", idType: SLUG) {
          name
        }
        posts(where: {categoryName: "${seedQuery.slug}"}) {
          edges {
            node {
              id
              uri
              title
              excerpt
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      data,
    },
  };
}
