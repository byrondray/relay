import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";

interface ChildImageProps {
  imageUrl: string;
  isSelected: boolean;
  onPress: () => void;
  
}

const ChildImage: React.FC<ChildImageProps> = ({
  imageUrl,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ position: "relative", opacity: isSelected ? 1 : 0.5 }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 90, height: 90, borderRadius: 50 }}
        />
        {isSelected && (
          <Image
            source={require("../../assets/images/checkmark-circle-icon.png")}
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              width: 30,
              height: 30,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChildImage;
