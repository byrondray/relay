import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  title,
  ...restProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'tint'
  );
  const textColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[{ backgroundColor, padding: 10, borderRadius: 5 }, style]}
      activeOpacity={0.8}
      {...restProps}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
