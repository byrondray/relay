import React, { useState, useEffect, useRef, useCallback } from "react";
//add imagepicker
import * as ImagePicker from "expo-image-picker";
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
  const [isReady, setIsReady] = useState(false); // Add a flag for layout readiness
  const { groupId } = useLocalSearchParams();
   //add selected image state
   const [selectedImage, setSelectedImage] = useState<string | null>(null); 
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

  //add media library function
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
      setSelectedImage(result.assets[0].uri); // Set selected image URI
    }
  };

  //add send message with image function
  const sendMessageWithImage = async () => {
    if (!newMessage && !selectedImage) return;

    const timestamp = new Date().toISOString();
    const message = {
      id: new Date().getTime().toString(),
      text: newMessage,
      imageUrl: selectedImage || null,
      createdAt: timestamp,
      sender: {
        id: senderId,
        firstName: senderData?.getUser?.firstName || "Unknown",
        lastName: senderData?.getUser?.lastName || "",
        imageUrl: senderData?.getUser?.imageUrl || "",
        email: senderData?.getUser?.email || "sender@example.com",
      },
      recipient: {
        id: recipientIdString,
        firstName: recipientData?.getUser?.firstName || "Recipient",
        lastName: recipientData?.getUser?.lastName || "",
        imageUrl: recipientData?.getUser?.imageUrl || "",
        email: recipientData?.getUser?.email || "recipient@example.com",
      },
    };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    const handleForegroundNotification =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        const { senderId: messageSenderId, text } = data;

        if (senderId && text) {
          const newMessage: GroupMessage = {
            groupId: groupIdString,
            message: text,
            createdAt: new Date().toISOString(),
            id: new Date().getTime().toString(),
            sender: {
              email: currentUser?.email || "",
              firstName: currentUser?.displayName || "",
              id: currentUser?.uid || "",
            },
          };

          
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

    requestNotificationPermission();

    return () => {
      Notifications.removeNotificationSubscription(
        handleForegroundNotification
      );
    };
  }, [groupId, messages]);

  if (loading || !isReady) {
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

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: currentColors.background },
            ]}
          >
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
  flexContainer: {
    flex: 1,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: "Comfortaa",
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
