import { useQuery, useMutation, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GET_PRIVATE_MESSAGE_CONVERSATION,
  CREATE_MESSAGE,
} from '@/graphql/queries';
import { MESSAGE_SENT_SUBSCRIPTION } from '@/graphql/queries';
import { Alert } from 'react-native';
import { CreateMessageMutation, Message } from '@/graphql/generated';
import { SubscriptionMessageSentArgs } from '@/graphql/generated';

export const useFetchMessages = (
  senderId: string,
  recipientId: string,
  setMessages: (messages: Message[]) => void
) => {
  const { data, loading, error, refetch } = useQuery(
    GET_PRIVATE_MESSAGE_CONVERSATION,
    {
      variables: { senderId, recipientId },
      skip: !senderId || !recipientId,
      onCompleted: async (data) => {
        const fetchedMessages = data.getPrivateMessageConversation;
        setMessages(fetchedMessages);
        await AsyncStorage.setItem(
          `messages_${recipientId}`,
          JSON.stringify(fetchedMessages)
        );
      },
      onError: async () => {
        const cachedMessages = await AsyncStorage.getItem(
          `messages_${recipientId}`
        );
        if (cachedMessages) {
          setMessages(JSON.parse(cachedMessages));
          Alert.alert('Offline Mode', 'Loaded messages from cache.');
        } else {
          Alert.alert('Error', 'Failed to load messages.');
        }
      },
    }
  );

  return { data, loading, error, refetch };
};

export const useSendMessage = (
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void,
  recipientId: string,
  messages: Message[],
  newMessage: string,
  setNewMessage: (message: string) => void
) => {
  const [createMessage] = useMutation(CREATE_MESSAGE);

  const sendMessage = async (senderId: string) => {
    if (newMessage.trim()) {
      const messageData = {
        senderId,
        recipientId,
        text: newMessage,
      };

      try {
        const result = await createMessage({ variables: messageData });
        setMessages([...messages, result.data.createMessage]);
        await AsyncStorage.setItem(
          `messages_${recipientId}`,
          JSON.stringify([...messages, result.data.createMessage])
        );
        setNewMessage('');
      } catch (error) {
        Alert.alert('Error', 'Failed to send message.');
      }
    }
  };

  return { sendMessage };
};

export const useMessageSubscription = (
  recipientId: string,
  setMessages: (messages: Message[]) => void,
  messages: Message[]
) => {
  const { data } = useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    variables: { recipientId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const newMessage: Message = subscriptionData.data.messageSent;

        setMessages([...messages, newMessage]);

        AsyncStorage.setItem(
          `messages_${recipientId}`,
          JSON.stringify([...messages, newMessage])
        );
      }
    },
  });

  return { data };
};
