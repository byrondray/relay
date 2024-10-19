import React from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useLoginHooks } from "../../hooks/auth/useLogin";
import * as WebBrowser from "expo-web-browser";
// import { onGoogleButtonPress } from "../../hooks/auth/useLogin";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen(): JSX.Element {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleEmailPasswordSignIn,
    promptAsync,
  } = useLoginHooks();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={{ padding: 20, marginTop: 60 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "lightgray" : "gray",
            }}
            placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "lightgray" : "gray",
            }}
            placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
          />
          <Button
            title="Sign in with Email"
            onPress={handleEmailPasswordSignIn}
          />
          {/* <Button title="Sign in with Google" onPress={() => promptAsync()} /> */}

          <Link
            href="/Register/register"
            style={[
              styles.link,
              isDarkMode ? styles.linkDark : styles.linkLight,
            ]}
          >
            Don't have an account? Register
          </Link>
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  linkLight: {
    color: "blue",
  },
  linkDark: {
    color: "lightblue",
  },
});
