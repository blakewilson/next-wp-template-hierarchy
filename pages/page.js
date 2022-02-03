import { client, gql } from "../client.mjs";
import Head from "next/head";
import { getSeedQueryFromContext } from "../lib/getSeedQueryFromContext.mjs";

export default function Page({ data: { title, content } }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}

export async function getServerSideProps(context) {
  const seedQuery = getSeedQueryFromContext(context);

  const { data } = await client.query({
    query: gql`
      query Page {
        nodeByUri(uri: "${seedQuery.uri}") {
          ... on Page {
            title
            content
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
