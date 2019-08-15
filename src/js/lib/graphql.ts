import ApolloClient, { InMemoryCache } from 'apollo-boost';

export function initGraphql() {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
    cache
  });

  return client;
}
