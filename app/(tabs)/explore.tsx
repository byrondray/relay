import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GetUserQuery, User as U } from '@/graphql/generated';

type User = {
  id: string;
  name: string;
  email: string;
};

// Define the GraphQL query to get users
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
  // Execute the query and get loading, error, and data states
  const { loading, error, data } = useQuery(GET_USERS, { client });

  // Log the results to the console
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

      {/* Check if the query is loading */}
      {loading && <ThemedText>Loading users...</ThemedText>}

      {/* Display an error message if the query failed */}
      {error && <ThemedText>Error loading users: {error.message}</ThemedText>}

      {/* Display the users if data is available */}
      {data && (
        <View>
          {data.getUsers.map((user: U) => (
            <Text key={user.id}>
              {user.name} ({user.email})
            </Text>
          ))}
        </View>
      )}

      {/* Other collapsible content */}
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
      {/* Other collapsible content */}
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
