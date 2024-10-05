import React, { useState } from 'react';
import { View, TextInput, Button, Text, useColorScheme } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/queries';
import { router } from 'expo-router';

export default function AuthScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'light';

  const [createUser] = useMutation(CREATE_USER);

  const handleSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User created:', result.user);
      const firebaseUser = result.user;
      const firebaseId = firebaseUser.uid;

      const { data } = await createUser({
        variables: {
          name,
          email,
          firebaseId,
        },
      });

      console.log('Data:', data);

      const userData = data?.createUser;

      if (userData) {
        console.log('User synced with DB:', userData);
        await AsyncStorage.setItem(
          'firebaseToken',
          await firebaseUser.getIdToken()
        );
        console.log('Firebase token stored');
        router.replace('/(tabs)/');
      }
    } catch (err: any) {
      if (err.code && err.message) {
        console.error(`Firebase error: ${err.code} - ${err.message}`);
        setError(`Firebase error: ${err.message}`);
      } else {
        console.error('Error during sign-up:', err);
        setError('Sign-up failed. Please try again.');
      }
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      {user ? (
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
          Welcome {user.email}
        </Text>
      ) : (
        <View>
          <TextInput
            placeholder='Name'
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? 'lightgray' : 'gray',
            }}
            placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
          />
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? 'lightgray' : 'gray',
            }}
            placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
          />
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? 'lightgray' : 'gray',
            }}
            placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <Button title='Sign Up' onPress={handleSignUp} />
        </View>
      )}
    </View>
  );
}
