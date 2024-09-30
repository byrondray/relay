import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://192.168.1.85:4000/graphql', // Enter your ip address here
  cache: new InMemoryCache(),
});

export default client;
