import apollo from "@apollo/client";
import { GRAPHQL_ENDPOINT } from "./constants.mjs";
const { ApolloClient, InMemoryCache, gql } = apollo;

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

export { client, gql };
