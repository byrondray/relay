import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useLoginHooks } from "../../hooks/auth/useLogin";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import { useFonts } from "expo-font";
import { useTheme } from "@/contexts/ThemeContext";
import RelayhwSvg from "@/components/icons/RelayhwSvg";
import GoogleSvg from "@/components/icons/GoogleSvg";
import FacebookSvg from "@/components/icons/FacebookSvg";

export default function LoginScreen(): JSX.Element {

  const [fontsLoaded] = useFonts({
    ComfortaaLight: require("../../assets/fonts/Comfortaa-Light.ttf"),
    ComfortaaRegular: require("../../assets/fonts/Comfortaa-Regular.ttf"),
    ComfortaaMedium: require("../../assets/fonts/Comfortaa-Medium.ttf"),
    ComfortaaSemiBold: require("../../assets/fonts/Comfortaa-SemiBold.ttf"),
    ComfortaaBold: require("../../assets/fonts/Comfortaa-Bold.ttf"),
  });
  
  const { currentColors } = useTheme();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleEmailPasswordSignIn,
  } = useLoginHooks();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >

      <View style={styles.mainContainer}>

        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />


        {/* <ImageBackground
      source={require("../../assets/images/bg_video.png")}
      style={styles.background}
      resizeMode="cover"
    > */}

        <LinearGradient
          colors={["rgba(43,38,51,0.6)", "rgba(226, 74, 74 ,0.6)"]}
          style={styles.gradient}
        >
          <View style={styles.container}>
            <RelayhwSvg width={120} height={120} />
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.form}>
                {/* Email Input */}
                <Text style={styles.labelText}>
                  Email
                </Text>
                <TextInput
                  value={email.toLowerCase()}
                  onChangeText={setEmail}
                  style={styles.inputText}
                  placeholder="Email"
                  placeholderTextColor={currentColors.placeholderText}
                />

                <Text style={styles.labelText}>
                  Password
                </Text>

                {/* Password Input */}
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.inputText}
                  placeholder="Password"
                  placeholderTextColor={currentColors.placeholderText}
                />

                <Text style={styles.ForgotPassword}>
                  Forgot Password?
                </Text>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={handleEmailPasswordSignIn}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    Sign In
                  </Text>
                </TouchableOpacity>


                <View style={styles.otherSignIn}>
                  <View style={[styles.signInWithLine, { marginRight: 10 }]}>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#fff",
                      }} 
                    />
                  </View>

                  <Text style={styles.signInWithText}>
                    Or Sign In With
                  </Text>

                  <View style={[styles.signInWithLine, { marginLeft: 10 }]}>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#fff",
                      }} 
                    />
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginVertical: 20,
                    width: 350,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity>
                    <View style={styles.signInButton}>
                      <GoogleSvg width={24} height={24} style={styles.svg} />
                      <Text style={styles.googleText}>Google</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <View style={styles.signInButton}>
                      <FacebookSvg width={24} height={24} style={styles.svg} />
                      <Text style={styles.googleText}>Facebook</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: "center", width: 350, marginTop: 50 }}>
                  <Text style={styles.haveAccountText}>Don't have an account?</Text>
                  <Link
                    href="/Register/register"
                    style={[styles.link, { color: "#FFCB8A"}]}
                  >Sign Up</Link>
                </View>

                {error ? (
                  <View style={styles.errBgBox}>
                    <Text style={styles.errText}>
                      {error}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
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
    width: "90%",
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    width: 140,
    height: 140,
    marginTop: 50,
    marginBottom: 50,
    resizeMode: "contain",
  },
  form: {
    width: 350,
    alignItems: "center",
    marginTop: 40,
  },
  labelText: {
    color: "white",
    alignSelf: "flex-start",
    width: 350,
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 10,
    fontFamily: "ComfortaaRegular",
  },
  ForgotPassword: {
    alignSelf: "flex-end",
    marginTop: 0,
    marginBottom: 30,
    marginLeft: 10,
    marginRight: 16,
    color: "#F4C542",
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
  },
  inputText: {
    width: 350,
    height: 44,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
    borderColor: "#D3D3D3",
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    color: "#000r",
    fontSize: 13,
    fontFamily: "ComfortaaRegular",
  },
  button: {
    width: 350, // Ensure button takes up full width
    height: 44, // Match button height with input height
    backgroundColor: "#F4C542",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  buttonText: {
    width: '100%',
    color: "black",
    textAlign: "center",
    letterSpacing: -0.5,
    fontSize: 14,
    fontFamily: "ComfortaaBold",
  },
  otherSignIn: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'center',
    alignContent: 'center',
    width: 350,
  },
  signInWithLine: {
    width: '25%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  signInWithText: {
    width: '40%',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
    color: "#FFFFFF",
  },
  haveAccountText: {
    marginRight: 5,
    letterSpacing: -0.5,
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
    color: "#FFFFFF",
  },
  link: {
    letterSpacing: -0.5,
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  linkText: {
    color: "blue",
  },
  errBgBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    padding: 20,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: '#E24949',
  },
  errText: {
    textAlign: 'center',
    color: '#ffffff',
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  socialButtonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  svg: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  googleText: {
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "ComfortaaBold",
    fontSize: 15,
    letterSpacing: -0.2
    ,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: 168,
    height: 44,
    borderRadius: 25,
  }
});
