import Ionicons from '@expo/vector-icons/Ionicons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import React from 'react';
import { ComponentProps } from 'react';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme to get the theme context

export function TabBarIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  // Get the current theme colors from the context
  const { currentColors } = useTheme();

  return (
    <Ionicons
      size={28}
      style={[{ marginBottom: -3 }, style]}
      color={currentColors.text} // Apply the text color based on the theme
      {...rest}
    />
  );
}
