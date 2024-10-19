import React, { useState, useEffect } from "react";
import { Calendar, Text, Layout } from "@ui-kitten/components";
import { ActivityIndicator } from "react-native";
import { SimpleButton } from "@/components/test/button";
import { ScrollView } from "react-native";
import { View } from "react-native";
import SearchBar from "@/components/search/searchBar";
import TextButton from "@/components/button/textButton";
import OutLinedButton from "@/components/button/outLinedButton";
import PropButton from "@/components/button/propedButton";
import ProgBar from "@/components/progressBar/progressBar";
import SingleDatePicker from "@/components/datePicker/singleDatePicker";
import RangeDatePicker from "@/components/datePicker/rangeDatePicker";
import InputDatePicker from "@/components/datePicker/inputDatePicker";
import MultipleDatePicker from "@/components/datePicker/multipleDatePicker";

export default function Sandbox() {
  const [date, setDate] = useState(new Date());
  const [CardAccessoriesShowcase, setCardAccessoriesShowcase] =
    useState<React.FC | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      const component = await import("../../../components/card");
      setCardAccessoriesShowcase(() => component.CardAccessoriesShowcase);
      setLoading(false);
    };

    loadComponent();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <ScrollView>
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text category="h6" style={{ marginBottom: 16 }}>
          Selected date: {date.toLocaleDateString()}
        </Text>

        <Calendar
          date={date}
          onSelect={(nextDate) => setDate(nextDate)}
          style={{ marginBottom: 20 }}
        />
        <SingleDatePicker initialDate={new Date()} />
        <RangeDatePicker />
        <InputDatePicker />
        <MultipleDatePicker />
        <View style={{ marginBottom: 20, flex: 1, justifyContent: "center" }}>
          {CardAccessoriesShowcase && <CardAccessoriesShowcase />}
        </View>
        <SearchBar />
        <View style={{ marginBottom: 20 }} />
        <Text category="h6" style={{ marginBottom: 6 }}>
          Bunch of Buttons
        </Text>
        <SimpleButton />
        <TextButton />
        <OutLinedButton />
        <PropButton mode="contained" />
        <ProgBar color="red" />
      </Layout>
    </ScrollView>
  );
}
