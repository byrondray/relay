import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import CameraButton from "@/components/button/CameraButton";
import { Image, View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { auth } from "@/firebaseConfig";
import { useFetchGroupMessages, useSendGroupMessage, useGroupMessageSubscription } from "../../../../hooks/messages/useGroupMessages";
import { GroupMessage } from "@/graphql/generated";
import Message from "@/components/messaging/message";
import { Spinner } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

export default function GroupMessageScreen() {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(Camera.Constants.Type.back);
  const [flash, setFlash] = useState<Camera.Constants.FlashMode>(Camera.Constants.FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const { groupId } = useLocalSearchParams() as { groupId?: string | string[] };
  const groupIdString = Array.isArray(groupId) ? groupId[0] : groupId;
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || "";
  const { currentColors } = useTheme();

  const { loading, refetch } = useFetchGroupMessages(groupIdString, setMessages);

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
    (async () => {
      try {
        const mediaPermission = await MediaLibrary.requestPermissionsAsync();
        const cameraPermission = await Camera.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === "granted" && mediaPermission.status === "granted");
      } catch (error) {
        console.error("Permission error:", error);
      }
    })();
  }, []);

  const takePicture = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    const handleForegroundNotification = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as Record<string, any>;
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
          const uniqueMessages = Array.from(new Map(updatedMessages.map((msg) => [msg.id, msg])).values());
          AsyncStorage.setItem(`group_messages_${groupIdString}`, JSON.stringify(uniqueMessages));
          return uniqueMessages;
        });
      }
    });

    requestNotificationPermission();

    return () => {
      Notifications.removeNotificationSubscription(handleForegroundNotification);
    };
  }, [groupId, messages]);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Message message={item} />}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
  
          <View style={[styles.inputContainer, { backgroundColor: currentColors.background }]}>
            {hasCameraPermission && (
              !image ? (
                <Camera
                  style={styles.camera}
                  type={cameraType}
                  flashMode={flash}
                  ref={cameraRef}
                />
              ) : (
                <Image source={{ uri: image }} style={styles.camera} />
              )
            )}
            <CameraButton
              icon="camera"
              onPress={takePicture}
              title="Take Picture"
              color={currentColors.text}
            />
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={[
                styles.input,
                {
                  backgroundColor: currentColors.background,
                  color: currentColors.text,
                },
              ]}
              placeholder="Message..."
              placeholderTextColor={currentColors.placeholder}
            />
            <TouchableOpacity onPress={() => sendMessage()}>
              <Text style={[styles.sendButtonText, { color: currentColors.text }]}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}  