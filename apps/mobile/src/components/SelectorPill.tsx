import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, font, radii } from '../theme';

/** The "USDT ⌄" currency selector pill inside a calculator field. */
export function SelectorPill({
  code,
  onPress,
  disabled,
}: {
  code: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Валюта: ${code}`}
      style={({ pressed }) => [styles.pill, pressed && !disabled && styles.pressed]}
    >
      <Text style={styles.code}>{code}</Text>
      {!disabled && (
        <Ionicons name="chevron-down" size={16} color={colors.textPrimary} style={styles.chevron} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: radii.pill,
    paddingLeft: 14,
    paddingRight: 10,
    height: 36,
  },
  code: { ...font.selector },
  chevron: { marginLeft: 4 },
  pressed: { opacity: 0.7 },
});
