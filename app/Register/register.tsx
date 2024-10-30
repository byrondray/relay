import React from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthHooks } from "../../hooks/auth/useRegister";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function RegisterScreen(): JSX.Element {
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
  } = useAuthHooks();

  return (
    <ImageBackground
      source={require("../../assets/images/bg_video.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(43,38,51,0.6)", "rgba(226, 74, 74 ,0.6)"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/relay_logo.png")}
            style={styles.logo}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.form}>
              <Text
                style={{
                  color: "white",
                  alignSelf: "flex-start",
                  marginBottom: 5,
                  marginLeft: 10,
                }}
              >
                Name
              </Text>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={[styles.input, { marginBottom: 10 }]}
                placeholderTextColor="#b0b0b0"
              />

              <Text
                style={{
                  color: "white",
                  alignSelf: "flex-start",
                  marginBottom: 5,
                  marginLeft: 10,
                }}
              >
                Email
              </Text>
              <TextInput
                placeholder="Email"
                value={email.toLowerCase()}
                onChangeText={setEmail}
                style={[styles.input, { marginBottom: 10 }]}
                placeholderTextColor="#b0b0b0"
              />

              <Text
                style={{
                  color: "white",
                  alignSelf: "flex-start",
                  marginBottom: 5,
                  marginLeft: 10,
                }}
              >
                Password
              </Text>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#b0b0b0"
              />

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, { marginTop: 20 }]}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              {/* Social Sign Up */}
              <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#fff",
                    marginHorizontal: 10,
                  }}
                />
                <Text style={{ color: "white" }}>Or Sign Up With</Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#fff",
                    marginHorizontal: 10,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginVertical: 20,
                  marginLeft: 60,
                }}
              >
                <TouchableOpacity onPress={() => promptAsync()}>
                  <Image
                    source={require("../../assets/images/google_signin.png")}
                    style={{
                      width: 200,
                      height: 45,
                      resizeMode: "contain",
                      marginLeft: 40,
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image
                    source={require("../../assets/images/fb_signin.png")}
                    style={{
                      width: 200,
                      height: 45,
                      resizeMode: "contain",
                      marginRight: 100,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Link
                href="/Login/login"
                style={[styles.link, { color: "#FFCB8A", marginTop: 40 }]}
              >
                Already have an account? Sign In
              </Link>

              {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            </View>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "85%",
    alignItems: "center",
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
    resizeMode: "contain",
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  input: {
    width: 300,
    height: 45,
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderColor: "#D3D3D3",
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  button: {
    width: 300,
    height: 45,
    backgroundColor: "#F4C542",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  link: {
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});
