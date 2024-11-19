import React, { ReactNode, useRef } from "react";
import { Modal, ScrollView, View, Dimensions, PanResponder, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme for theming
import { Layout } from "@ui-kitten/components";

interface ExpandablePanelProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const FriendsExpandablePanel = ({
  isVisible,
  onClose,
  children,
}: ExpandablePanelProps) => {
  const screenHeight = Dimensions.get("window").height;
  const { currentColors } = useTheme(); // Access current theme colors

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <View
        style={[
          styles.modalOverlay,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Use dark overlay color
        ]}
      >
        <View
          {...panResponder.panHandlers}
          style={[
            styles.panelContainer,
            {
              height: screenHeight * 0.8,
              backgroundColor: currentColors.background, // Use current background color
            },
          ]}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              backgroundColor: currentColors.background, // Consistent background color
            }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  panelContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    overflow: "hidden",
  },
});

export default FriendsExpandablePanel;
