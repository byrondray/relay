import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { auth } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/queries';
import { router } from 'expo-router';

const EXPO_PUBLIC_GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export default function AuthScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [createUser] = useMutation(CREATE_USER);

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri: makeRedirectUri({
        scheme: 'myapp',
        native: 'myapp://redirect',
      }),
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      setLoading(true);

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const firebaseUser = result.user;
          const firebaseId = firebaseUser.uid;
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem('firebaseToken', token);

          const { data } = await createUser({
            variables: {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email,
              firebaseId,
            },
          });

          console.log('User synced with DB:', data?.createUser);
          setUser(firebaseUser);
          setLoading(false);
          router.replace('/(tabs)/');
        })
        .catch((err) => {
          setLoading(false);
          setError('Google sign-up failed. Please try again.');
          console.error('Google sign-up error:', err);
        });
    }
  }, [response]);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = result.user;
      const firebaseId = firebaseUser.uid;

      const { data } = await createUser({
        variables: {
          name,
          email,
          firebaseId,
        },
      });

      if (data?.createUser) {
        await AsyncStorage.setItem(
          'firebaseToken',
          await firebaseUser.getIdToken()
        );
        setUser(firebaseUser);
        setLoading(false);
        router.replace('/(tabs)/');
      }
    } catch (err: any) {
      setLoading(false);
      if (err.code && err.message) {
        setError(`Firebase error: ${err.message}`);
      } else {
        setError('Sign-up failed. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : user ? (
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
          Welcome back {user.email}
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
          <Button title='Sign Up with Email' onPress={handleSignUp} />

          {/* <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: '#4285F4',
              borderRadius: 5,
              marginTop: 10,
              alignItems: 'center',
            }}
            onPress={handleGoogleSignIn}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Sign Up with Google
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
}
