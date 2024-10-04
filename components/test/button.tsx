import React from "react";
import { Button, Text, View } from "react-native";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { ThemedText } from "../ThemedText";

const theme = createTheme({
  lightColors: {
    primary: "red",
    background: "white",
  },
  darkColors: {
    primary: "blue",
    background: "black",
  },
  components: {
    Button: {
      titleStyle: {
        color: "white",
      },
      buttonStyle: {
        backgroundColor: "yellow",
      },
    },
    Text: {
      style: {
        fontSize: 20,
        fontFamily: "Arial",
      },
    },
  },
});

export function SimpleButton() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={{ padding: 20, backgroundColor: mode === "light" ? theme.lightColors?.background : theme.darkColors?.background }}>
        <ThemedText
          style={{
            marginBottom: 20,
            color:
              mode === "light"
                ? theme.lightColors?.primary
                : theme.darkColors?.primary,
          }}
        >
          Hello
        </ThemedText>
        <Button
          title="Press Me"
          onPress={toggleMode}
          color={
            mode === "light"
              ? theme.lightColors?.primary
              : theme.darkColors?.primary
          }
        />
        <Text style={{ marginTop: 20, color: mode === "light" ? theme.lightColors?.primary : theme.darkColors?.primary }}>
          Current mode: {mode === "light" ? "Light" : "Dark"}
        </Text>
      </View>
    </ThemeProvider>
  );
}
