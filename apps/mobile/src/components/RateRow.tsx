import { StyleSheet, Text, View } from 'react-native';
import type { Rate } from '../api/types';
import { baseTierRate, currencyOf, formatAmount } from '../lib/exchange';
import { currencySymbol } from '../lib/currency';
import { font, spacing } from '../theme';
import { PercentBadge } from './PercentBadge';

/**
 * Deterministic placeholder % change so the badges look realistic and stable
 * across renders (the real change feed is out of scope — spec 4.4).
 */
function placeholderChange(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return Math.round((((h % 300) - 60) / 100) * 100) / 100; // ~ -0.60 .. +2.39
}

export function RateRow({ rate }: { rate: Rate }) {
  const quote = rate.quote; // full quote incl. rail, e.g. "RUB-TBANK" (so rails don't read as duplicates)
  const base = currencyOf(rate.base); // e.g. CNY
  const value = baseTierRate(rate);

  return (
    <View style={styles.row}>
      <View style={styles.pair}>
        <Text style={styles.big}>{quote}</Text>
        <Text style={styles.small}>/{base}</Text>
      </View>

      <View style={styles.values}>
        <Text style={styles.value}>{formatAmount(value)}</Text>
        <Text style={styles.unit}>1,00 {currencySymbol(base)}</Text>
      </View>

      <PercentBadge value={placeholderChange(rate.id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.screen,
  },
  pair: { flexDirection: 'row', alignItems: 'baseline', flex: 1 },
  big: { ...font.pairBig },
  small: { ...font.pairSmall, marginLeft: 2 },
  values: { alignItems: 'flex-end', marginRight: 12 },
  value: { ...font.rateValue },
  unit: { ...font.tinyUnit, marginTop: 2 },
});
