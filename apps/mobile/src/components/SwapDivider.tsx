import { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

/**
 * Horizontal divider between the two fields with a centered swap button
 * (spec 4.3). Disabled when the swapped pair has no valid config.
 */
export function SwapDivider({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (disabled) return;
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    onPress();
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Поменять валюты местами"
        accessibilityState={{ disabled: !!disabled }}
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="swap-vertical" size={20} color={colors.white} />
        </Animated.View>
      </Pressable>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  buttonDisabled: { backgroundColor: colors.primaryDisabled },
  pressed: { opacity: 0.85 },
});
