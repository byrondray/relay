import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GetUserQuery, User as U } from '@/graphql/generated';

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
    }
  }
`;

export default function TabTwoScreen() {
  const { loading, error, data } = useQuery<GetUserQuery, { error: Error }>(
    GET_USERS,
    { client }
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Data:', data);

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

      {loading && <ThemedText>Loading users...</ThemedText>}

      {error && (
        <ThemedText>Error loading users: {(error as Error).message}</ThemedText>
      )}

      {data && (
        <View>
          {data.getUsers.map((user: U) => (
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
