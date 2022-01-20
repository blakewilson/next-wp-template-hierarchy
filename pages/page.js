import { gql } from "@apollo/client";
import client from "../client.mjs";
import Head from "next/head";

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
  const seedQuery = context.query.seedQuery;

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
