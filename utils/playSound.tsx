import { Audio } from "expo-av";

export const playNotificationSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sound/notif-sound.mp3")
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
