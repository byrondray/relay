import * as React from "react";
import { Button } from "react-native-paper";

type ButtonMode = "text" | "outlined" | "contained";

const PropButton = ({ mode }: { mode: ButtonMode }) => (
  <Button icon="camera" mode={mode} onPress={() => console.log("Camera")}>
    Press me
  </Button>
);

export default PropButton;
