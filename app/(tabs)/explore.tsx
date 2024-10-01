import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { gql, useQuery, useMutation } from '@apollo/client';
import client from '@/graphql/client';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import {
  CreateUserMutation,
  GetUsersQuery,
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery<GetUsersQuery>(GET_USERS, { client });

  const [
    createUser,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<CreateUserMutation>(CREATE_USER, {
    client,
    refetchQueries: [{ query: GET_USERS }],
  });

  if (queryLoading) return <Text>Loading...</Text>;
  if (queryError) return <Text>Error :(</Text>;

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

      {mutationLoading && <Text>Creating user...</Text>}
      {mutationError && (
        <Text>Error creating user: {mutationError.message}</Text>
      )}

      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button
        title='Create User'
        onPress={() => {
          createUser({ variables: { name, email } });
          setName('');
          setEmail('');
        }}
      />

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
