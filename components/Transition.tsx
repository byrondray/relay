import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

function Transition({ children }: { children: any }): React.JSX.Element {
  const position = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(position, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [position]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: position }] }]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Similar to bg-gray-100
  },
});

export default Transition;
