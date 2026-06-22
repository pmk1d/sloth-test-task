import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radii } from '../theme';
import { formatRate } from '../lib/exchange';

/**
 * Coloured percent badge. Per spec 4.4 the % change is only a visual
 * placeholder, so the value is passed in (deterministically derived per row)
 * and the colour set is chosen by its sign.
 */
export function PercentBadge({ value }: { value: number }) {
  const tone = value > 0 ? 'pos' : value < 0 ? 'neg' : 'zero';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return (
    <View style={[styles.badge, styles[`${tone}Bg`]]}>
      <Text style={[styles.text, styles[`${tone}Text`]]}>
        {sign}
        {formatRate(Math.abs(value))}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radii.badge,
    paddingHorizontal: 12,
    height: 28,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { ...font.badge },
  posBg: { backgroundColor: colors.badgePositiveBg },
  posText: { color: colors.badgePositiveText },
  negBg: { backgroundColor: colors.badgeNegativeBg },
  negText: { color: colors.badgeNegativeText },
  zeroBg: { backgroundColor: colors.badgeNeutralBg },
  zeroText: { color: colors.badgeNeutralText },
});
