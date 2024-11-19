/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF6A00";
const tintColorDark = "#FF6A00";

export const Colors = {
  light: {
    text: "#11181C",
    placeholder: "#8F9BB3",
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#FFFF",
    placeholder: "#C4C4C4",
    background: "#181818",
    tint: tintColorDark,
    icon: "#C4C4C4",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FF6A00"
  },
};
