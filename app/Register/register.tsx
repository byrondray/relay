import React from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useAuthHooks } from '../../hooks/auth/useRegister';

export default function AuthScreen(): JSX.Element {
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    error,
    loading,
    handleSignUp,
    promptAsync,
    user,
  } = useAuthHooks();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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
          <Button title='Sign Up with Google' onPress={() => promptAsync()} />
        </View>
      )}
    </View>
  );
}
