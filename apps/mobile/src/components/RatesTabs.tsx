import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RatesTab } from '../lib/exchange';
import { colors, spacing } from '../theme';

const TABS: { key: RatesTab; label: string }[] = [
  { key: 'all', label: 'Все валюты' },
  { key: 'fiat', label: 'Фиат' },
  { key: 'crypto', label: 'Крипто' },
];

export function RatesTabs({ value, onChange }: { value: RatesTab; onChange: (t: RatesTab) => void }) {
  return (
    <View style={styles.row}>
      {TABS.map((t) => {
        const active = t.key === value;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} hitSlop={8}>
            <Text style={[styles.tab, active && styles.active]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: spacing.screen,
    marginBottom: 4,
  },
  tab: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary, // inactive tabs are solid #212121 in the reference
  },
  active: {
    color: colors.primary,
    fontWeight: '600',
  },
});
