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
  useFetchGroupMessages,
  useSendGroupMessage,
  useGroupMessageSubscription,
} from "../../../../hooks/messages/useGroupMessages";
import { GroupMessage } from "@/graphql/generated";
import Message from "@/components/messaging/message";
import { Spinner } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";

export default function GroupMessageScreen() {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { groupId } = useLocalSearchParams();
  const groupIdString = Array.isArray(groupId) ? groupId[0] : groupId;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || "";

  const { loading, error, refetch } = useFetchGroupMessages(
    groupIdString,
    setMessages
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            const uniqueMessages = Array.from(
              new Map(updatedMessages.map((msg) => [msg.id, msg])).values()
            );
            AsyncStorage.setItem(
              `group_messages_${groupIdString}`,
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
  }, [groupId, messages]);

  if (loading) {
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
        <View style={[styles.container, { flex: 1 }]}>
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
              style={[styles.input, { backgroundColor: "white" }]}
              placeholder="Message..."
            />
            <TouchableOpacity onPress={() => sendMessage()}>
              <Text style={styles.sendButtonText}>Send</Text>
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
    color: "#FB812A",
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
  recipientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    borderColor: "#ddd",
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
