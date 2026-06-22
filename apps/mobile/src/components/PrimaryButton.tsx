import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radii } from '../theme';

/** Full-width green CTA with a trailing chevron (the "Создать сделку" button). */
export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.spacer} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.spacer}>
        <Ionicons name="chevron-forward" size={20} color={colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
  disabled: { backgroundColor: colors.primaryDisabled },
  pressed: { backgroundColor: colors.primaryPressed },
  spacer: { width: 24, alignItems: 'flex-end' },
  label: { ...font.button, flex: 1, textAlign: 'center' },
});
