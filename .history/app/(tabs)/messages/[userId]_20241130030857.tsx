import React, { useState, useEffect, useCallback, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebaseConfig";
import {
  useFetchMessages,
  useSendMessage,
  useMessageSubscription,
  useFetchUser,
} from "../../../hooks/messages/useMessages";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

export default function MessageScreen() {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { userId } = useLocalSearchParams();
  const recipientIdString = Array.isArray(userId) ? userId[0] : userId;
  const currentUser = auth.currentUser;
  const flatListRef = useRef<FlatList>(null);

  const { data: recipientData } = useFetchUser(recipientIdString);
  const { data: senderData } = useFetchUser(currentUser?.uid || "");

  const openMediaLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
    }
  };

  const sendMessageWithImage = async () => {
    if (!newMessage && !selectedImage) return;

    const timestamp = new Date().toISOString();
    const message = {
      id: new Date().getTime().toString(),
      text: newMessage,
      imageUrl: selectedImage || null,
      createdAt: timestamp,
      sender: {
        id: currentUser?.uid || "",
        firstName: senderData?.getUser?.firstName || "Unknown",
        lastName: senderData?.getUser?.lastName || "",
        imageUrl: senderData?.getUser?.imageUrl || "",
      },
      recipient: {
        id: recipientIdString,
        firstName: recipientData?.getUser?.firstName || "Recipient",
        lastName: recipientData?.getUser?.lastName || "",
        imageUrl: recipientData?.getUser?.imageUrl || "",
      },
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
    setSelectedImage(null);

    // Persist messages locally
    await AsyncStorage.setItem(
      `messages_${currentUser?.uid || ""}`,
      JSON.stringify(messages)
    );
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    };

    scrollToBottom();

    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", scrollToBottom);
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", scrollToBottom);

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.flexContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <LinearGradient
        colors={[`${currentColors.tint}1A`, `${currentColors.tint}33`]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.91, y: 1 }}
        style={styles.gradientBackground}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={styles.senderName}>
                  {item.sender.firstName} {item.sender.lastName}
                </Text>
                <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
                )}
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.removeImageButton}
              >
                <Text style={{ color: "white" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={openMediaLibrary} style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 20, color: currentColors.tint }}>+</Text>
            </TouchableOpacity>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={[
                styles.input,
                {
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.placeholder,
                  color: currentColors.text,
                },
              ]}
              placeholder="Message..."
              placeholderTextColor={currentColors.placeholder}
            />
            <TouchableOpacity onPress={sendMessageWithImage}>
              <Text style={[styles.sendButtonText, { color: currentColors.tint }]}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 15,
  },
  senderName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButtonText: {
    fontSize: 16,
  },
});
