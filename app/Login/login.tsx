import React from "react";
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

        {Platform.OS === "ios" || Platform.OS === "android" ? (
          <Video
            source={require('../../assets/images/bg_video.mp4')}
            rate={1.0}
            volume={1.0}
            resizeMode={ResizeMode.COVER}
            isMuted = {true}
            isLooping
            shouldPlay
            style={styles.backgroundVideo}
            onError={(e) => console.error('Video Error: ', e)}
          />
        ) : (
          <ImageBackground
            source={require('../../assets/images/bg_video.png')}
            style={styles.background}
            resizeMode="cover"
          />
        )}


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
            <Image
              source={require("../../assets/images/relay_logo.png")}
              style={styles.logo}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.form}>
                {/* Email Input */}
                <Text style={styles.LabelText}>
                  Email
                </Text>
                <TextInput
                  value={email.toLowerCase()}
                  onChangeText={setEmail}
                  style={styles.inputText}
                  placeholder="Email"
                  placeholderTextColor={currentColors.placeholder }
                />

                <Text style={styles.LabelText}>
                  Password
                </Text>

                {/* Password Input */}
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.inputText}
                  placeholder="Password"
                  placeholderTextColor="#8F9BB3"
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
                  <View
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      width: '100%',
                      marginRight: 20,
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: "#fff",
                      }} 
                    />
                  </View>

                  <Text style={{ display: 'flex', width: "100%", justifyContent: 'center', alignContent: 'center', color: '#fff', fontSize: 12, fontFamily: "ComfortaaBold" }}>
                    Or Sign In With
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      width: '100%',
                      marginLeft: 20,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '100%',
                        height: 1,
                        backgroundColor: "#fff",
                      }} />
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginVertical: 20,
                    marginLeft: 60,
                  }}
                >
                  <TouchableOpacity style={{}}>
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

                  <TouchableOpacity style={{}}>
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

                <View style={{ display: "flex", flexDirection: "row", width: "100%", marginTop: 50 }}>
                  <Text style={styles.buttonText}>Don't have an account?</Text>
                  <Link
                    href="/Register/register"
                    style={[styles.link, { color: "#FFCB8A", marginTop: 40 }]}
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

        {/* </ImageBackground> */}
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
    width: "85%",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginTop: 50,
    marginBottom: 50,
    resizeMode: "contain",
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  LabelText: {
    color: "white",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 10,
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
    width: 300,
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
    color: "#111",
    fontSize: 13,
    fontFamily: "ComfortaaRegular",
  },
  button: {
    width: 300, // Ensure button takes up full width
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
    fontSize: 16,
    fontFamily: "ComfortaaBold",
  },
  otherSignIn: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'center',
    alignContent: 'center',
    width: 80,
  },
  link: {
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  linkText: {
    color: "blue",
  },
  errBgBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
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
  }
});
