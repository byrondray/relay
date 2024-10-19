import React from "react";
import { View, Text } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const InputDatePicker = () => {
  const [inputDate, setInputDate] = React.useState<Date | undefined>(undefined);

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <DatePickerInput
          locale="en"
          label="Birthdate"
          value={inputDate}
          onChange={(d) => setInputDate(d)}
          inputMode="start"
        />
      </View>
    </SafeAreaProvider>
  );
};

export default InputDatePicker;