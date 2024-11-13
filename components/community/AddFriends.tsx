import React, { ReactNode, useRef } from "react";
import {
  Modal,
  ScrollView,
  View,
  Dimensions,
  PanResponder,
} from "react-native";
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
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          {...panResponder.panHandlers}
          style={{
            height: screenHeight * 0.8,
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            overflow: "hidden",
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FriendsExpandablePanel;
