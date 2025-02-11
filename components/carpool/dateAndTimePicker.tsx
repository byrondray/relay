import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Datepicker } from "@ui-kitten/components";
import { TimePickerModal } from "react-native-paper-dates";
import { useTheme } from "@/contexts/ThemeContext";
// import DateTimePicker from "@react-native-community/datetimepicker";
import ClockSvg from "../icons/ClockSvg";
import CalendarSvg from "../icons/CalendarSvg";

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
  const { currentColors } = useTheme();
  const [time, setTime] = React.useState<{
    hours: number;
    minutes: number;
  } | null>(null);

  const handleTimeConfirm = (time: { hours: number; minutes: number }) => {
    setTime(time);
    handleTimeSelect(time);
    setShowTimePicker(false);
  };
  // const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
  //   if (Platform.OS === "android") {
  //     // On Android, dismiss the picker after a time is selected or canceled
  //     if (event.type === "set" && selectedTime) {
  //       // "set" means the user selected a time
  //       setTime(selectedTime);
  //       const hours = selectedTime.getHours();
  //       const minutes = selectedTime.getMinutes();
  //       console.log("Selected Time: ", hours, minutes);
  //       handleTimeSelect({ hours, minutes });
  //     }
  //     // Hide the picker in all cases (even if "dismissed")
  //     setShowTimePicker(false);
  //   } else if (Platform.OS === "ios") {
  //     // On iOS, just update the time without hiding the picker
  //     if (selectedTime) {
  //       setTime(selectedTime);
  //       const hours = selectedTime.getHours();
  //       const minutes = selectedTime.getMinutes();
  //       console.log("Selected Time: ", hours, minutes);
  //       handleTimeSelect({ hours, minutes });
  //     }
  //   }
  // };

  return (
    <View>
      {/* Date Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <Text
          style={[
            {
              marginBottom: 5,
              marginTop: 15,
              color: "#8F9BB3",
              fontFamily: "Comfortaa-Regular",
            },
            { color: textColor },
          ]}
        >
          Date & Time of Ride
        </Text>
        <Text
          style={{
            color: textColor,
            marginTop: 15,
            marginBottom: 5,
            fontFamily: "Comfortaa-Regular",
          }}
        >
          * Required
        </Text>
      </View>
      <View
        style={{
          backgroundColor: currentColors.placeholder,
          height: 43,
          borderColor: currentColors.placeholder,
          borderWidth: 1,
          borderRadius: 15,
          paddingLeft: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CalendarSvg fill="#8F9BB3" width={24} height={24} style={styles.svg} />
        <Datepicker
          date={selectedDate || undefined}
          onSelect={(date) => {
            handleDateSelect(date);
          }}
          min={new Date()}
          style={{
            marginRight: 5,
            borderColor: "transparent",
            borderWidth: 0,
          }}
          controlStyle={{
            borderWidth: 0,
            borderColor: "transparent",
            backgroundColor: currentColors.placeholder,
          }}
          placeholder={"Select date"}
        />
      </View>

      {/* Time Section */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <View
          style={{
            backgroundColor: currentColors.placeholder,
            borderColor: currentColors.placeholder,
            height: 44,
            borderWidth: 1,
            borderRadius: 15,
            paddingLeft: 15,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <ClockSvg
            fill="#8F9BB3"
            width={36}
            height={36}
            style={[styles.svg, styles.clockSvg]}
          />
          <Text
            style={{
              marginLeft: 15,
              color: currentColors.text,
              marginRight: 25,
              fontFamily: "Comfortaa",
            }}
          >
            {selectedTime || "Select time"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Time Picker Modal
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )} */}
      <TimePickerModal
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        hours={time?.hours ?? 12}
        minutes={time?.minutes ?? 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  svg: {
    marginBottom: 2,
  },
  clockSvg: {
    marginTop: 12,
  },
});

export default RideDateTimePicker;
