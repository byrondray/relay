import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const NavBar = () => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="home" size={24} color="#777" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Icon name="paper-plane" size={24} color="#777" />
        <Text style={styles.navText}>Trips</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Icon name="plus-circle" size={24} color="#ff9900" />
        <Text style={[styles.navText, { color: "#ff9900" }]}>New Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Icon name="users" size={24} color="#777" />
        <Text style={styles.navText}>Community</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Icon name="cog" size={24} color="#777" />
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});

export default NavBar;
