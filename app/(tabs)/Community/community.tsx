import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Community = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>This will be the Community page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Community;
