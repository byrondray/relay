import React from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Datepicker } from "@ui-kitten/components";
import { TimePickerModal } from "react-native-paper-dates";
import DateTimePicker from "@react-native-community/datetimepicker";

const RideDateTimePicker = ({
  selectedDate,
  handleDateSelect,
  selectedTime,
  handleTimeSelect,
  textColor,
}: {
  selectedDate: Date | null;
  handleDateSelect: (date: Date) => void;
  selectedTime: string;
  handleTimeSelect: (time: { hours: number; minutes: number }) => void;
  textColor: string;
}) => {
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [time, setTime] = React.useState<Date | undefined>(undefined);

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      console.log("Selected Time: ", hours, minutes);
      handleTimeSelect({ hours, minutes });
    }
  };

  return (
    <View>
      {/* Date Section */}
      <Text
        style={{
          marginBottom: 5,
          marginTop: 15,
          color: "#8F9BB3",
          fontFamily: "Comfortaa",
        }}
      >
        Date & Time of Ride
      </Text>
      <View
        style={{
          backgroundColor: "#F7F9FC",
          height: 43,
          borderColor: "#E4E9F2",
          borderWidth: 1,
          borderRadius: 15,
          paddingLeft: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("@/assets/images/calendar-icon.png")}
          style={{ marginLeft: 10 }}
        />
        <Datepicker
          date={selectedDate || undefined}
          onSelect={handleDateSelect}
          style={{ marginRight: 5 }}
        />
      </View>

      {/* Time Section */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <View
          style={{
            backgroundColor: "#F7F9FC",
            height: 43,
            borderColor: "#E4E9F2",
            borderWidth: 1,
            borderRadius: 15,
            paddingLeft: 25,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <Image
            source={require("@/assets/images/calendar-icon.png")}
            style={{ marginTop: 2 }}
          />
          <Text
            style={{
              marginLeft: 15,
              color: textColor,
              marginRight: 25,
              fontFamily: "Comfortaa",
            }}
          >
            {selectedTime ? selectedTime : "Select Date & Time"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default RideDateTimePicker;
