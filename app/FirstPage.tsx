import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Transition from "../components/Transition";
import { useRouter } from "expo-router";
const FirstPage = () => {
  const router = useRouter();
  return (
    <Transition>
      <View style={styles.container}>
        <Text style={styles.title}>First Page</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/SecondPage")}
        >
          <Text style={styles.buttonText}>Go to Second Page</Text>
        </TouchableOpacity>
      </View>
    </Transition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
  },
});

export default FirstPage;
