import * as React from "react";
import { Button } from "react-native-paper";

const TextButton = () => (
  <Button icon="camera" mode="text" onPress={() => console.log("Camera")}>
    Press me
  </Button>
);

export default TextButton;
