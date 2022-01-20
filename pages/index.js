import { client, gql } from "../client.mjs";
import Head from "next/head";
import Link from "next/link";

export default function Home({ data: { posts, pages } }) {
  return (
    <>
      <Head>
        <title>My Headless WordPress Site</title>
      </Head>

      <h1>My Home Page Template</h1>

      <h2>Pages</h2>
      <ul>
        {pages?.nodes?.map(({ id, uri, title }) => (
          <li key={id}>
            <Link href={uri}>{title}</Link>
          </li>
        ))}
      </ul>

      <h2>Posts</h2>
      <ul>
        {posts?.nodes?.map(({ id, uri, title }) => (
          <li key={id}>
            <Link href={uri}>{title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getServerSideProps(context) {
  const { data } = await client.query({
    query: gql`
      query HomePage {
        posts {
          nodes {
            id
            uri
            title
          }
        }
        pages {
          nodes {
            id
            uri
            title
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
