import React from "react";
import { View, Image, ImageSourcePropType } from "react-native";

interface ProfilePicturesProps {
  images: Array<string | ImageSourcePropType>; // Support both local and remote images
}

const StackedProfilePictures = ({ images }: ProfilePicturesProps) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
      {images.map((image, index) => (
        <Image
          key={index}
          source={typeof image === "string" ? { uri: image } : image} 
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginLeft: index === 0 ? 0 : -10,
            zIndex: index,
          }}
        />
      ))}
    </View>
  );
};

export default StackedProfilePictures;
