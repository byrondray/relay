import {
  useQuery,
  useMutation,
  useSubscription,
  ApolloError,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GET_PRIVATE_MESSAGE_CONVERSATION,
  CREATE_MESSAGE,
} from "@/graphql/messages/queries";
import { MESSAGE_SENT_SUBSCRIPTION } from "@/graphql/messages/queries";
import { GET_USER } from "@/graphql/user/queries";
import { Alert } from "react-native";
import { DetailedMessage } from "@/graphql/generated";
import { useEffect } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export const useFetchMessages = (
  senderId: string,
  recipientId: string,
  setMessages: (messages: DetailedMessage[]) => void
) => {
  const { data, loading, error, refetch } = useQuery(
    GET_PRIVATE_MESSAGE_CONVERSATION,
    {
      variables: { senderId, recipientId },
      skip: !senderId || !recipientId,
      fetchPolicy: "network-only",
      onCompleted: async (data: {
        getPrivateMessageConversation: DetailedMessage[];
      }) => {
        const fetchedMessages = data.getPrivateMessageConversation;

        const uniqueMessages = Array.from(
          new Map(fetchedMessages.map((msg) => [msg.id, msg])).values()
        );
        setMessages(uniqueMessages);

        // await AsyncStorage.setItem(
        //   `messages_${recipientId}`,
        //   JSON.stringify(uniqueMessages)
        // );
      },
      onError: async (error: ApolloError) => {
        console.error("Failed to fetch messages:", error);

        const cachedMessages = await AsyncStorage.getItem(
          `messages_${recipientId}`
        );
        if (cachedMessages) {
          const cachedMessagesParsed: DetailedMessage[] =
            JSON.parse(cachedMessages);
          const uniqueMessages: DetailedMessage[] = Array.from(
            new Map(
              cachedMessagesParsed.map((msg: DetailedMessage) => [msg.id, msg])
            ).values()
          );
          setMessages(uniqueMessages);
        } else {
          Alert.alert(
            "Error",
            "Failed to load messages. Please check your network."
          );
        }
      },
    }
  );

  useFocusEffect(
    useCallback(() => {
      if (senderId && recipientId) {
        refetch();
      }
    }, [senderId, recipientId])
  );

  return { data, loading, error, refetch };
};

export const useFetchUser = (userId: string) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: "network-only",
    onError: (error) => {
      console.error("Failed to fetch user:", error);
      Alert.alert("Error", "Failed to load user information.");
    },
  });

  return { data, loading, error };
};

export const useSendMessage = (
  senderId: string,
  recipientId: string,
  setMessages: (
    messages:
      | DetailedMessage[]
      | ((prevMessages: DetailedMessage[]) => DetailedMessage[])
  ) => void,
  messages: DetailedMessage[],
  newMessage: string,
  setNewMessage: (message: string) => void,
  setIsMessageSent: (status: boolean) => void
) => {
  const [createMessage] = useMutation(CREATE_MESSAGE);

  const sendMessage = async () => {
    if (newMessage) {
      const messageData = {
        senderId,
        recipientId,
        text: newMessage,
      };

      try {
        console.log("Sending message:", messageData);
        const { data } = await createMessage({ variables: messageData });

        const createdMessage = data?.createMessage;

        if (createdMessage) {
          setNewMessage("");
          setIsMessageSent(true);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: createdMessage.id,
              text: createdMessage.text,
              createdAt: createdMessage.createdAt,
              sender: createdMessage.sender,
              recipient: createdMessage.recipient,
            },
          ]);

          AsyncStorage.setItem(
            `messages_${recipientId}`,
            JSON.stringify([...messages, createdMessage])
          );
        } else {
          console.error("Failed to create message: No message returned");
          Alert.alert("Error", "Message creation failed on the server.");
        }
      } catch (error) {
        console.error("Send message error:", error);
        Alert.alert(
          "Error",
          (error as Error).message || "Failed to send message."
        );
      }
    }
  };

  return { sendMessage };
};

export const useMessageSubscription = (
  recipientId: string,
  setMessages: (
    messages:
      | DetailedMessage[]
      | ((prevMessages: DetailedMessage[]) => DetailedMessage[])
  ) => void,
  messages: DetailedMessage[]
) => {
  const { data, error } = useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    variables: { recipientId },
    skip: !recipientId,
  });

  useEffect(() => {
    if (data?.messageSent) {
      const newMessage = data.messageSent;

      setMessages((prevMessages: DetailedMessage[]) => [
        ...prevMessages,
        newMessage,
      ]);

      AsyncStorage.setItem(
        `messages_${recipientId}`,
        JSON.stringify([...messages, newMessage])
      );
    }
  }, [data]);

  if (error) {
    console.error("Subscription error:", error);
  }

  return { data };
};
