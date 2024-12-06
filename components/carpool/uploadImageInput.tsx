import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import UploadIcon from "@/assets/images/uploadIcon.svg";
import { useTheme } from "@/contexts/ThemeContext";

interface ImageUploadProps {
  profileImage: string | null;
  pickImage: () => Promise<void>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  profileImage,
  pickImage,
}) => {
  const { currentColors } = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: currentColors.background, borderColor: currentColors.tint}]}>
      <TouchableOpacity onPress={pickImage} style={[styles.uploadButton, {backgroundColor: currentColors.background}]}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={[styles.profileImage, {backgroundColor: currentColors.text}]} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <UploadIcon width={80} height={40} />
            <Text style={[styles.uploadText, {color: currentColors.text}]}>Take or Upload your image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 108,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F7F9FC",
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "ComfortaaRegular",
    letterSpacing: -0.3,
  },
});

export default ImageUpload;
