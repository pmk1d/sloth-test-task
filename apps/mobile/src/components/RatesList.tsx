import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Rate } from '../api/types';
import { filterRates, type RatesTab } from '../lib/exchange';
import { colors, spacing } from '../theme';
import { RateRow } from './RateRow';
import { RatesTabs } from './RatesTabs';

/** Tabs + filtered list of all rates (spec 4.4). */
export function RatesList({ rates }: { rates: Rate[] }) {
  const [tab, setTab] = useState<RatesTab>('all');
  const visible = useMemo(() => filterRates(rates, tab), [rates, tab]);

  return (
    <View style={styles.container}>
      <RatesTabs value={tab} onChange={setTab} />
      <View style={styles.list}>
        {visible.length === 0 ? (
          <Text style={styles.empty}>Нет курсов в этой категории</Text>
        ) : (
          visible.map((r) => <RateRow key={r.id} rate={r} />)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  list: { marginTop: 8 },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
    paddingHorizontal: spacing.screen,
    paddingVertical: 24,
  },
});
