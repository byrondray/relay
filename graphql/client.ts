import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpUrl = process.env.EXPO_PUBLIC_IS_DEV
  ? `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:4000/graphql`
  : `${process.env.EXPO_PUBLIC_API_URL}/graphql`;

const wsUrl = process.env.EXPO_PUBLIC_IS_DEV
  ? `ws://${process.env.EXPO_PUBLIC_IP_ADDRESS}:4000/subscriptions`
  : `wss://${process.env.EXPO_PUBLIC_API_URL}/subscriptions`;

const httpLink = createHttpLink({
  uri: httpUrl,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,

    on: {
      connected: () => console.log('WebSocket connected'),
      closed: () => console.log('WebSocket closed'),
      error: (err) => console.error('WebSocket error:', err),
    },
  })
);

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('firebaseToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
