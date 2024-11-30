import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const MultipleDatePicker = () => {
  const [dates, setDates] = React.useState<Date[]>([]);
  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onConfirm = React.useCallback((params: { dates: Date[] }) => {
    setOpen(false);
    setDates(params.dates);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
          Pick multiple dates
        </Button>
        <DatePickerModal
          locale="en"
          mode="multiple"
          visible={open}
          onDismiss={onDismiss}
          dates={dates}
          onConfirm={onConfirm}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default MultipleDatePicker;
