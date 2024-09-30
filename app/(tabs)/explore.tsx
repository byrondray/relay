import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text } from 'react-native';
import { gql, useQuery, useMutation } from '@apollo/client';
import client from '@/graphql/client';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  CreateUserMutation,
  GetUserQuery,
  User as U,
} from '@/graphql/generated';

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export default function TabTwoScreen() {
  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery<GetUserQuery, { error: Error }>(GET_USERS, { client });

  const [
    createUser,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<CreateUserMutation, { error: Error }>(CREATE_USER, {
    client,
  });

  if (queryLoading) return <Text>Loading...</Text>;
  if (queryError) return <Text>Error :(</Text>;

  console.log('Loading:', queryLoading);
  console.log('Error:', queryError);
  console.log('Data:', queryData);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Ionicons size={310} name='code-slash' style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Explore</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      {queryLoading && <ThemedText>Loading users...</ThemedText>}

      {queryError && (
        <ThemedText>
          Error loading users: {(queryError as Error).message}
        </ThemedText>
      )}

      {queryData && (
        <View>
          {queryData.getUsers.map((user: U) => (
            <Text key={user.id}>
              {user.name} ({user.email})
            </Text>
          ))}
        </View>
      )}

      <Collapsible title='File-based routing'>
        <ThemedText>
          This app has two screens:
          <ThemedText type='defaultSemiBold'>
            app/(tabs)/index.tsx
          </ThemedText>{' '}
          and
          <ThemedText type='defaultSemiBold'>app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
