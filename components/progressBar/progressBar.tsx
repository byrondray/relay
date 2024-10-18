import * as React from "react";
import { ProgressBar, MD3Colors } from "react-native-paper";

const ProgBar = ({ color }: { color: string }) => (
  <ProgressBar progress={0.8} theme={{ colors: { primary: color } }} />
);

export default ProgBar;
