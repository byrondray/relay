/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF6A00";
const tintColorDark = "#FF6A00";

/* "rgba(228, 77, 74, 0.3)", "rgba(255, 136, 52, 0.3)" */

export const Colors = {
  light: {
    text: "#11181C",
    placeholder: "#f0f0f0",
    placeholderText: "#8F9BB3",
    headBackground: "rgba(247, 176, 96, 0.2)",
    background: "#FFF",
    gradient: ["rgba(247, 176, 96, 0.2)", "rgba(230, 87, 76, 0.1)"],
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#FFF",
    placeholder: "#333333",
    placeholderText: "#8F9BB3",
    headBackground: "rgba(0, 0, 0, 1)",
    background: "#181818",
    gradient: ["#FF8834", "#E44D4A"],
    tint: tintColorDark,
    icon: "#C4C4C4",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FF6A00"
  },
};
