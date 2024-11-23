import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect, useLocalSearchParams } from "expo-router";
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

export default function MessageScreen() {
  const { currentColors } = useTheme();
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId } = useLocalSearchParams();
  const recipientIdString = Array.isArray(userId) ? userId[0] : userId;
  const currentUser = auth.currentUser;

  const { data: recipientData, loading: recipientLoading } =
    useFetchUser(recipientIdString);
  const senderId = currentUser?.uid || "";
  const { data: senderData, loading: senderLoading } = useFetchUser(senderId);

  const { loading, error, refetch } = useFetchMessages(
    currentUser?.uid || "",
    recipientIdString,
    setMessages
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const { sendMessage } = useSendMessage(
    senderId,
    recipientIdString,
    setMessages,
    messages,
    newMessage,
    setNewMessage,
    () => {}
  );

  useMessageSubscription(currentUser?.uid || "", setMessages, messages);

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
      Notifications.removeNotificationSubscription(
        handleForegroundNotification
      );
    };
  }, [currentUser?.uid || "", messages, senderData, recipientData]);

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
        <View style={[styles.container, { flex: 1, backgroundColor: currentColors.background }]}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Message message={item} />}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          <View style={styles.inputContainer}>
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
            <TouchableOpacity onPress={() => sendMessage()}>
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
  },
  input: {
    flex: 1,
    borderWidth: 1,
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
