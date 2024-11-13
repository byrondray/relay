import {
  DetailedMessage as DirectMessageType,
  GroupMessage as GroupMessageType,
} from "@/graphql/generated";
import React from "react";
import { View, Image, Text } from "react-native";
import TextWithFont from "../text/textWithFont";
import { format, isToday, isYesterday } from "date-fns";

type UnifiedMessage = {
  id: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName?: string | null;
    imageUrl?: string | null;
  };
  text?: string;
  message?: string;
};

const Message = ({ message }: { message: UnifiedMessage }) => {
  const createdAtDate = new Date(message.createdAt);
  const formattedDate = isToday(createdAtDate)
    ? `Today ${format(createdAtDate, "h:mm a")}`
    : isYesterday(createdAtDate)
    ? `Yesterday ${format(createdAtDate, "h:mm a")}`
    : format(createdAtDate, "MM/dd/yyyy");

  return (
  <View
      style={{
        marginTop: 20,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {message.sender.imageUrl && (
        <Image
          source={{ uri: message.sender.imageUrl }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            alignSelf: "flex-start",
            marginTop: 5,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 14,
              fontFamily: "Comfortaa",
              fontWeight: "600",
            }}
          >
            {message.sender.firstName}
          </Text>
          <TextWithFont
            style={{ fontSize: 10, color: "#333333", marginLeft: 5 }}
          >
            {formattedDate}
          </TextWithFont>
        </View>
        <TextWithFont style={{ color: "#000", fontSize: 11 }}>
          {message.text || message.message}{" "}
        </TextWithFont>
      </View>
    </View>
  );
};

export default Message;
