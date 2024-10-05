import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebaseConfig';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearStorage } from '@/utils/ClearAsyncStorage';

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      setUser(user);
      await AsyncStorage.setItem('firebaseToken', token);
      console.log('User signed in with Google:', user.email);
    } catch (err) {
      console.error('Error occurred during Google sign-in:', err);
      setError('Google sign-in failed. Please try again.');
    }
  };

  // clearStorage();

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      {user ? (
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
          Welcome back {user.email}
        </Text>
      ) : (
        <View>
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
          <Link
            href='/Register/register'
            style={[
              styles.link,
              isDarkMode ? styles.linkDark : styles.linkLight,
            ]}
          >
            Don't have an account? Register
          </Link>
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.googleButton,
              isDarkMode ? styles.buttonDark : styles.buttonLight,
            ]}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  linkLight: {
    color: 'blue',
  },
  linkDark: {
    color: 'lightblue',
  },
  googleButton: {
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonLight: {
    backgroundColor: '#4285F4',
  },
  buttonDark: {
    backgroundColor: '#357ae8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
