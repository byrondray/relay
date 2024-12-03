import React, { useMemo } from "react";
import { View, Text, Image } from "react-native";
import { RequestWithParentAndChild } from "@/graphql/generated";
import TimeCard from "../cards/timeCard";
import { useTheme } from "@/contexts/ThemeContext";
import OrangePin from "@/assets/images/orangePin.svg";
import TimeIcon from "@/assets/images/timeIcon.svg";

// Request Card Component
const RequestCard = ({
  request,
  index,
  isCurrentUser,
  isDriver,
  startTime,
  endTime,
}: {
  request: RequestWithParentAndChild;
  index: number;
  isCurrentUser: boolean;
  isDriver: boolean;
  startTime: string;
  endTime: string;
}) => {
  const { currentColors } = useTheme();

  const hardcodedCodes: { [key: string]: string[] } = {
    dlKJ2KqPEzc4wHStEOPOkK6fin33: ["4", "2", "8", "7", "2", "6"],
    VQDrhC1urNVkssfgLc8jZWVRpo32: ["1", "9", "3", "7", "9", "7"],
    JDUp6wskgdN2QxnLrV646NxlY2E3: ["5", "5", "3", "0", "1", "2"],
    r5nff8t7UYWfzPv9hCuuOWHZFt52: ["8", "4", "3", "9", "6", "2"],
  };

  const code = useMemo(() => {
    if (request.parent.id in hardcodedCodes) {
      return hardcodedCodes[request.parent.id];
    } else {
      const randomNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      return randomNumber.split("");
    }
  }, [request.parent.id]);

  return (
    <View
      style={{
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: currentColors.background,
        borderColor: isCurrentUser ? currentColors.tint : undefined,
        shadowColor: currentColors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {request.child.imageUrl && (
            <Image
              source={{ uri: request.child.imageUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 12,
              }}
            />
          )}
          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Comfortaa",
                color: currentColors.text + "80",
              }}
            >
              Passenger {index + 1}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Comfortaa",
                color: currentColors.text,
              }}
            >
              {request.child.firstName}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#3366FF",
            borderRadius: 16,
            paddingHorizontal: 18,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <TimeIcon width={16} height={16} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Comfortaa",
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Waiting
          </Text>
        </View>
      </View>

      {((isCurrentUser && code) || (isDriver && code)) && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              marginBottom: 8,
              fontFamily: "Comfortaa",
              color: currentColors.text,
            }}
          >
            Your security matching code
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            {code.map((digit, idx) => (
              <View
                key={idx}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                  backgroundColor: currentColors.tint,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Comfortaa",
                    color: "#FFFFFF",
                  }}
                >
                  {digit}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 14,
            marginBottom: 4,
            fontFamily: "Comfortaa",
            color: currentColors.text + "80",
          }}
        >
          Pick up Location - Point {index + 1}
        </Text>
        <View
          style={{
            marginTop: 5,
            flexDirection: "row",
            marginBottom: -10,
            alignContent: "center",
          }}
        >
          <OrangePin width={20} height={20} style={{ marginRight: 8 }} />
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Comfortaa",
              color: currentColors.text + "80",
              flexShrink: 1,
            }}
          >
            {request.startAddress}
          </Text>
        </View>
      </View>

      {/* Pass the start and end times dynamically */}
      <TimeCard startTime={startTime} endTime={endTime} />
    </View>
  );
};

export default RequestCard;
