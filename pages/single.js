import { client, gql } from "../client.mjs";
import Head from "next/head";
import { getSeedQueryFromContext } from "../lib/getSeedQueryFromContext.mjs";

export default function Single({ data: { title, content, date } }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <div>Created on {date}</div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}

export async function getServerSideProps(context) {
  const seedQuery = getSeedQueryFromContext(context);

  const { data } = await client.query({
    query: gql`
      query Post {
        nodeByUri(uri: "${seedQuery.uri}") {
          ... on Post {
            title
            content
            date
          }
        }
      }
    `,
  });

  return {
    props: {
      data: data?.nodeByUri,
    },
  };
}
