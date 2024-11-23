import * as React from "react";
import { ProgressBar } from "react-native-paper";
import { useTheme } from "@/contexts/ThemeContext";

const ProgBar = ({ color }: { color?: string }) => {
  const { currentColors } = useTheme();
  
  return (
    <ProgressBar
      progress={0.8}
      theme={{ colors: { primary: color || currentColors.tint } }}
    />
  );
};

export default ProgBar;
