import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
  InteractionManager,
  Image,
} from "react-native";
import { Camera } from "expo-camera"; // Import Camera
import * as MediaLibrary from "expo-media-library"; // Import Media Library
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { auth } from "@/firebaseConfig";
import {
  useFetchGroupMessages,
  useSendGroupMessage,
  useGroupMessageSubscription,
} from "../../../../hooks/messages/useGroupMessages";
import { GroupMessage } from "@/graphql/generated";
import Message from "@/components/messaging/message";
import { Spinner } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

export default function GroupMessageScreen() {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false); // State to toggle camera
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null); // Camera permission
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Captured image
  const cameraRef = useRef<typeof Camera>(null);
  const { groupId } = useLocalSearchParams();
  const groupIdString = Array.isArray(groupId) ? groupId[0] : groupId;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || "";
  const flatListRef = useRef<FlatList>(null);
  const isUserScrolling = useRef(false);
  const { currentColors } = useTheme();
  const { loading, refetch } = useFetchGroupMessages(
    groupIdString,
    setMessages
  );

  const { sendMessage } = useSendGroupMessage(
    groupIdString,
    userId,
    setMessages,
    messages,
    newMessage,
    setNewMessage,
    () => {}
  );

  useGroupMessageSubscription(groupIdString, setMessages);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(
        status === "granted" && mediaStatus.status === "granted"
      );
    })();
  }, []);

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri); // Store captured image
        setIsCameraVisible(false); // Close camera after capture
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
    }
  };

  // Automatically scroll to the bottom unless the user is scrolling
  useEffect(() => {
    const scrollToBottom = () => {
      if (
        flatListRef.current &&
        !isUserScrolling.current &&
        isReady &&
        messages.length
      ) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    };

    scrollToBottom();

    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      scrollToBottom
    );
    const keyboardHideListener = Keyboard.addListener(
      "keyboardDidHide",
      scrollToBottom
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [messages]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  }, []);

  const handleScrollBeginDrag = () => {
    isUserScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    isUserScrolling.current = false;
  };

  if (loading || !isReady) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner />
      </View>
    );
  }

  // Render the camera view if camera is visible
  if (isCameraVisible) {
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          ref={cameraRef}
          type={Camera.Constants.Type.back}
        />
        <TouchableOpacity style={styles.captureButton} onPress={handleCameraCapture}>
          <Text style={styles.captureButtonText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flexContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <LinearGradient
        colors={["#E6574C1A", "#F7B06033"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.91, y: 1 }}
        style={styles.gradientBackground}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { backgroundColor: currentColors.background },
          ]}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Message message={item} />}
            contentContainerStyle={{ paddingBottom: 10 }}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEnabled={true}
          />

          {capturedImage && (
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          )}

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: currentColors.background },
            ]}
          >
            <TouchableOpacity onPress={() => setIsCameraVisible(true)}>
              <Text style={styles.openCameraText}>Open Camera</Text>
            </TouchableOpacity>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={[
                styles.input,
                {
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                  borderColor: currentColors.placeholder,
                  borderWidth: 1,
                },
              ]}
              placeholder="Message..."
              placeholderTextColor={currentColors.placeholder}
            />
            <TouchableOpacity onPress={() => sendMessage()}>
              <Text
                style={[styles.sendButtonText, { color: currentColors.tint }]}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ... previous styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "red",
    borderRadius: 10,
    padding: 10,
  },
  captureButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  openCameraText: {
    fontSize: 16,
    color: "blue",
    marginRight: 10,
  },
  capturedImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
});
