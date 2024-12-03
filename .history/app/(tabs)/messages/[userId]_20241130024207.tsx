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
} from "react-native";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { auth } from "@/firebaseConfig";
import {
  useFetchMessages,
  useSendMessage,
  useMessageSubscription,
  useFetchUser,
} from "../../../hooks/messages/useMessages";
import { DetailedMessage } from "@/graphql/generated";
import Message from "@/components/messaging/message";
import { Spinner } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function MessageScreen() {
  const { currentColors } = useTheme();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { userId } = useLocalSearchParams();
  const recipientIdString = Array.isArray(userId) ? userId[0] : userId;
  const currentUser = auth.currentUser;

  const flatListRef = useRef<FlatList>(null); // Ref for the FlatList

  // State to store selected image URI
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  // Function to open the media library and select an image
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

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri); // Store the selected image URI
      console.log("Selected Image URI:", result.assets[0].uri);
    }
  };

  const { data: recipientData, loading: recipientLoading } = useFetchUser(recipientIdString);
  const senderId = currentUser?.uid || "";
  const { data: senderData, loading: senderLoading } = useFetchUser(senderId);

  const { loading, error, refetch } = useFetchMessages(currentUser?.uid || "", recipientIdString, setMessages);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const sendMessage = async () => {
    if (!newMessage && !selectedImageUri) {
      return; // Don't send an empty message or image
    }

    try {
      let imageUri: string | null = null;

      // If an image is selected, upload it and get the URL
      if (selectedImageUri) {
        imageUri = await uploadImageToFirebase(selectedImageUri); // Upload the image and get URL
      }

      const messageData = {
        text: newMessage,
        imageUri, // Attach the image URI or URL to the message
        createdAt: new Date().toISOString(),
        sender: {
          id: senderId,
          firstName: senderData?.getUser.firstName || "Unknown",
          lastName: senderData?.getUser.lastName || "",
          email: senderData?.getUser.email || "",
          imageUrl: senderData?.getUser.imageUrl || "",
        },
        recipient: {
          id: recipientIdString,
          firstName: recipientData?.getUser.firstName || "Recipient",
          lastName: recipientData?.getUser.lastName || "",
          email: recipientData?.getUser.email || "",
          imageUrl: recipientData?.getUser.imageUrl || "",
        },
      };

      await sendMessageToServer(messageData); // Replace with your function to send the message to the backend

      // Clear the inputs after sending the message
      setNewMessage("");
      setSelectedImageUri(null); // Reset the selected image
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Firebase function to upload image and get URL
  const uploadImageToFirebase = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const imageRef = ref(storage, `images/${uuidv4()}`); // Generate a unique name for each image
    await uploadBytes(imageRef, blob);

    const imageUrl = await getDownloadURL(imageRef); // Get the image URL
    return imageUrl;
  };

  useMessageSubscription(currentUser?.uid || "", setMessages, messages);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    const handleForegroundNotification = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      const { senderId: messageSenderId, text } = data;

      if (messageSenderId && text) {
        const newMessage = {
          id: new Date().getTime().toString(),
          text,
          createdAt: new Date().toISOString(),
          sender: {
            id: messageSenderId,
            firstName: senderData?.getUser.firstName || "Unknown",
            lastName: senderData?.getUser.lastName || "",
            email: senderData?.getUser.email || "",
            imageUrl: senderData?.getUser.imageUrl || "",
          },
          recipient: {
            id: currentUser?.uid || "",
            firstName: recipientData?.getUser.firstName || "Recipient",
            lastName: recipientData?.getUser.lastName || "",
            email: recipientData?.getUser.email || "",
            imageUrl: recipientData?.getUser.imageUrl || "",
          },
        };

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          const uniqueMessages = Array.from(
            new Map(updatedMessages.map((msg) => [msg.id, msg])).values()
          );
          AsyncStorage.setItem(
            `messages_${currentUser?.uid || ""}`,
            JSON.stringify(uniqueMessages)
          );
          return uniqueMessages;
        });
      }
    });

    requestNotificationPermission();

    return () => {
      Notifications.removeNotificationSubscription(handleForegroundNotification);
    };
  }, [currentUser?.uid || "", messages, senderData, recipientData]);

  useFocusEffect(
    useCallback(() => {
      const recipientName = recipientData?.getUser?.firstName || "Message";
      // @ts-ignore
      navigation.setParams({ recipientName });
    }, [recipientData, navigation])
  );

  useEffect(() => {
    const scrollToBottom = () => {
      if (flatListRef.current) {
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

  if (recipientLoading || senderLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner />
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
        colors={[`${currentColors.tint}1A`, `${currentColors.tint}33`]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.91, y: 1 }}
        style={styles.gradientBackground}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { flex: 1, backgroundColor: currentColors.background },
          ]}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Message message={item} />}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={openMediaLibrary} style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 20, color: currentColors.tint }}>+</Text>
            </TouchableOpacity>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={[
                styles.input,
                { backgroundColor: currentColors.inputBackground },
              ]}
              placeholder="Type a message"
              placeholderTextColor={currentColors.inputPlaceholder}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={{ color: currentColors.tint }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: { flex: 1 },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
});
