import { gql } from "@apollo/client";
import client from "../client.mjs";

export default function Single({ data: { title, content, date } }) {
  return (
    <>
      <h1>{title}</h1>
      <div>Created on {date}</div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}

export async function getServerSideProps(context) {
  const seedQuery = context.query.seedQuery;

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
