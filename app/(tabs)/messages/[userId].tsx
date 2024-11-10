import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
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

export default function MessageScreen() {
  const [messages, setMessages] = useState<DetailedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId } = useLocalSearchParams();
  const recipientIdString = Array.isArray(userId) ? userId[0] : userId;
  const currentUser = auth.currentUser;

  const { data: recipientData, loading: recipientLoading } =
    useFetchUser(recipientIdString);
  const senderId = auth.currentUser?.uid || "";
  const { data: senderData, loading: senderLoading } = useFetchUser(senderId);

  const { loading, error, refetch } = useFetchMessages(
    currentUser?.uid || "",
    recipientIdString,
    setMessages
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
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {recipientData && (
            <Text style={styles.recipientName}>
              Chat with {recipientData.getUser.firstName}
            </Text>
          )}

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <Message message={item} />;
            }}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={styles.input}
              placeholder="Type a message..."
            />
            <Button title="Send" onPress={() => sendMessage()} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
});
