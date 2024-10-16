import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { auth } from '@/firebaseConfig';
import {
  useFetchMessages,
  useSendMessage,
  useMessageSubscription,
  useFetchUser,
} from '../../../hooks/messages/useMessages';
import { Message } from '@/graphql/generated';

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<null | any>(null);
  const { userId, recipientId } = useLocalSearchParams();
  const userIdString = Array.isArray(userId) ? userId[0] : userId;
  const recipientIdString = Array.isArray(recipientId)
    ? recipientId[0]
    : recipientId;

  const [isMessageSent, setIsMessageSent] = useState(false);

  const router = useRouter();
  const senderId = auth.currentUser?.uid || '';

  const { data: recipientData, loading: recipientLoading } =
    useFetchUser(recipientIdString);

  const { loading, error, refetch } = useFetchMessages(
    userIdString,
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
    setIsMessageSent
  );

  useMessageSubscription(userIdString, setMessages, messages, isMessageSent);

  useEffect(() => {
    const loadUser = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        router.replace('/Login/login');
      } else {
        setUser(firebaseUser);
      }
    };

    loadUser();
  }, [userId]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    const handleForegroundNotification =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        const { senderId: messageSenderId, text } = data;

        if (messageSenderId === userId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text,
              senderId: messageSenderId,
              id: new Date().getTime().toString(),
              createdAt: new Date().toISOString(),
              recipientId: userIdString,
            },
          ]);

          AsyncStorage.setItem(
            `messages_${userId}`,
            JSON.stringify([...messages, { text, senderId: messageSenderId }])
          );
        } else {
          Alert.alert('New Message', `Message from another user: ${text}`);
        }
      });

    requestNotificationPermission();

    return () => {
      Notifications.removeNotificationSubscription(
        handleForegroundNotification
      );
    };
  }, [userId, messages]);

  if (recipientLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading recipient information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recipientData && (
        <Text style={styles.recipientName}>
          Chat with {recipientData.getUser.name.split(' ')[0]}
        </Text>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View
              style={[
                styles.message,
                item.senderId === userIdString && styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          );
        }}
      />

      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder='Type a message...'
      />
      <Button title='Send' onPress={() => sendMessage()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  otherMessage: {
    backgroundColor: '#e1f5fe',
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    marginBottom: 10,
  },
});
