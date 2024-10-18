import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const SingleDatePicker = ({ initialDate }: { initialDate?: Date }) => {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [open, setOpen] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onConfirmSingle = React.useCallback(
    (params: { date: Date | undefined }) => {
      setOpen(false);
      setDate(params.date);
    },
    []
  );

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
          Pick single date
        </Button>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          date={date}
          onDismiss={onDismissSingle}
          onConfirm={onConfirmSingle}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default SingleDatePicker;