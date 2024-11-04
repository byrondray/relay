import React from "react";
import { Text, StyleSheet } from "react-native";

import { TextProps } from "react-native";

interface TextWithFontProps extends TextProps {
  children: React.ReactNode;
  style?: object;
}

export default function TextWithFont({
  children,
  style,
  ...props
}: TextWithFontProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Comfortaa",
  },
});
