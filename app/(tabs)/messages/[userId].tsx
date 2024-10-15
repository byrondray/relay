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
} from '../../../hooks/messages/useMessages';
import { Message } from '@/graphql/generated';

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<null | any>(null);
  const { userId, recipientId } = useLocalSearchParams();
  const userIdString = Array.isArray(userId) ? userId[0] : userId;

  const [isMessageSent, setIsMessageSent] = useState(false);

  const router = useRouter();
  const senderId = auth.currentUser?.uid || '';
  const recipientIdString = recipientId;

  const { loading, error, refetch } = useFetchMessages(
    userIdString,
    recipientId as string,
    setMessages
  );

  const { sendMessage } = useSendMessage(
    setMessages,
    userIdString,
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
          ).then(() =>
            console.log('Notification message saved to AsyncStorage')
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

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.text}</Text>
        )}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder='Type a message...'
      />
      <Button title='Send' onPress={() => sendMessage(senderId)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    marginBottom: 10,
  },
});
