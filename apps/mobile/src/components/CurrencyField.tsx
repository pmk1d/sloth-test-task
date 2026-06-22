import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, font, radii } from '../theme';
import { CurrencyBadge } from './CurrencyBadge';
import { SelectorPill } from './SelectorPill';

/**
 * One calculator field: label, green coin badge, numeric amount input and the
 * currency selector pill. Fully controlled — the parent owns the text so the
 * two fields can recompute each other.
 */
export function CurrencyField({
  label,
  code,
  value,
  onChangeText,
  onBlur,
  onPressSelector,
  selectorDisabled,
}: {
  label: string;
  code: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onPressSelector: () => void;
  selectorDisabled?: boolean;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <CurrencyBadge code={code} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType="numeric"
          inputMode="decimal"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          selectTextOnFocus
        />
        <SelectorPill code={code} onPress={onPressSelector} disabled={selectorDisabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...font.fieldLabel, marginBottom: 8 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pageBg,
    borderRadius: radii.field,
    height: 64,
    paddingHorizontal: 12,
  },
  input: {
    ...font.amount,
    flex: 1,
    marginHorizontal: 12,
    padding: 0,
  },
});
