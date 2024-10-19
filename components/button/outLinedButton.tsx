import * as React from "react";
import { Button } from "react-native-paper";

const OutLinedButton = () => (
  <Button icon="camera" mode="outlined" onPress={() => console.log("Camera")}>
    Press me
  </Button>
);

export default OutLinedButton;
