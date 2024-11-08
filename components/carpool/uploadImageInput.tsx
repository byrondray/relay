import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import UploadIcon from "@/assets/images/uploadIcon.svg";

interface ImageUploadProps {
  profileImage: string | null;
  pickImage: () => Promise<void>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  profileImage,
  pickImage,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <UploadIcon width={80} height={40} />
            <Text style={styles.uploadText}>Take or Upload your image</Text>
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
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Comfortaa",
  },
});

export default ImageUpload;
