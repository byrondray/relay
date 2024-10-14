import { TextInput, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TextInputProps } from 'react-native';
import React from 'react';

export function ThemedInput({ style, ...restProps }: TextInputProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <TextInput
      style={[styles.input, { backgroundColor, color: textColor }, style]}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
