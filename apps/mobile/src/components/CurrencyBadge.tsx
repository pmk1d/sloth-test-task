import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { currencySymbol } from '../lib/currency';
import { COIN_SVG, coinCropped } from '../icons/svg';

/**
 * The round green "coin" badge. The full Figma coin (circle + glyph) is drawn by
 * one SVG, so the symbol is always centred inside its own circle. The View
 * behind only supplies the green drop shadow (reliable on both platforms).
 * Currencies without a coin in COIN_SVG fall back to the symbol drawn as text.
 */
// Memoised: the coin never changes for a given currency, so it no longer
// re-parses its SVG while the user types amounts (which re-renders the parent).
export const CurrencyBadge = memo(function CurrencyBadge({
  code,
  size = 32,
}: {
  code: string;
  size?: number;
}) {
  const svg = COIN_SVG[code];
  return (
    <View
      style={[
        styles.coin,
        styles.shadow,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {svg ? (
        <SvgXml xml={coinCropped(svg, code)} width={size} height={size} />
      ) : (
        <Text style={[styles.glyph, { fontSize: size * 0.5 }]} numberOfLines={1}>
          {currencySymbol(code)}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  coin: {
    backgroundColor: '#32A25F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Mirrors the coins' baked-in green drop shadow (tint #1D5E37).
  shadow: {
    shadowColor: '#1D5E37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  glyph: {
    color: '#E6F9EF', // matches the design coins' near-white glyph
    fontWeight: '700',
    includeFontPadding: false,
  },
});
