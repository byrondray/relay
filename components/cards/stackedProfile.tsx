import React from "react";
import { View, Image } from "react-native";

interface ProfilePicturesProps {
  images: string[];
}

const StackedProfilePictures = ({ images }: ProfilePicturesProps) => {
  return (
    <View style={{ flexDirection: "row", position: "relative" }}>
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 0,
            position: "absolute",
            left: index * 10,
            top: index * 10,
            zIndex: images.length - index,
            marginLeft: index > 0 ? -20 : 9,
            marginTop: index > 0 ? -1 : 9,
          }}
        />
      ))}
    </View>
  );
};

export default StackedProfilePictures;
