import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { gql, useMutation } from '@apollo/client';
import { CreateUserMutation } from '@/graphql/generated';
import client from '@/graphql/client';

const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $firebaseUserId: String!
  ) {
    createUser(name: $name, email: $email, firebaseUserId: $firebaseUserId) {
      id
      name
      email
    }
  }
`;

export default function AuthScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [
    createUser,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<CreateUserMutation, { error: Error }>(CREATE_USER, {
    client,
  });

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);

      await createUser({
        variables: {
          name,
          email: firebaseUser.email,
          firebaseUserId: firebaseUser.uid,
        },
      });
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <Text>Welcome {user.email}</Text>
      ) : (
        <View>
          <TextInput
            placeholder='Name'
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <Button title='Sign Up' onPress={handleSignUp} />
          <Button title='Sign In' onPress={handleSignIn} />
        </View>
      )}
    </View>
  );
}
