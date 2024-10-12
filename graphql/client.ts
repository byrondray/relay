import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = process.env.EXPO_PUBLIC_IS_DEV
  ? `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:4000/graphql`
  : `${process.env.EXPO_PUBLIC_API_URL}/graphql`;

const httpLink = createHttpLink({
  uri: url,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('firebaseToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
