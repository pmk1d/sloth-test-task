import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ExchangeConfig, Rate } from '../api/types';
import {
  calculate,
  type CalcResult,
  type Field,
  findConfig,
  firstConfigFrom,
  formatAmount,
  fromCurrencies,
  parseAmount,
  resolvePair,
  swapTarget,
  toCurrenciesFor,
} from '../lib/exchange';
import { colors, font, radii, spacing, cardShadow } from '../theme';
import { CurrencyField } from './CurrencyField';
import { CurrencyPickerSheet } from './CurrencyPickerSheet';
import { PrimaryButton } from './PrimaryButton';
import { SwapDivider } from './SwapDivider';

const DEFAULT_FROM_AMOUNT = 134000; // → exactly 10 000 ¥ at the top tier

type Picker = 'from' | 'to' | null;

export function Calculator({
  configs,
  rates,
  onCreateDeal,
}: {
  configs: ExchangeConfig[];
  rates: Rate[];
  onCreateDeal: (config: ExchangeConfig) => void;
}) {
  const [config, setConfig] = useState<ExchangeConfig>(
    () => [...configs].sort((a, b) => a.sortOrder - b.sortOrder)[0],
  );
  const pair = useMemo(() => resolvePair(config, rates), [config, rates]);

  // Seed the fields once from the default send amount.
  const initial = useMemo(
    () => (pair ? calculate(pair, 'from', DEFAULT_FROM_AMOUNT) : null),
    // Only for the initial config; later edits drive the state below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [fromText, setFromText] = useState(initial ? formatAmount(initial.from) : '');
  const [toText, setToText] = useState(initial && initial.to > 0 ? formatAmount(initial.to) : '');
  // The single source of truth for the rate line / CTA: the exact result of the
  // last edit, so the rate, "from" and "to" are always one consistent triple
  // (never re-derived from the rounded display text).
  const [result, setResult] = useState<CalcResult | null>(initial);
  const [picker, setPicker] = useState<Picker>(null);

  const fromNum = parseAmount(fromText);

  const fromOptions = useMemo(() => fromCurrencies(configs), [configs]);
  const toOptions = useMemo(
    () => toCurrenciesFor(configs, config.fromCurrency),
    [configs, config.fromCurrency],
  );
  const canSwap = pair != null && swapTarget(configs, config) != null;

  /** Recompute the opposite field + the result after `edited` changed. */
  function recompute(edited: Field, value: number) {
    if (!pair) {
      setResult(null);
      return;
    }
    const r = calculate(pair, edited, value);
    if (edited === 'from') setToText(value > 0 ? formatAmount(r.to) : '');
    else setFromText(value > 0 ? formatAmount(r.from) : '');
    setResult(r);
  }

  const handleFromChange = (text: string) => {
    setFromText(text);
    recompute('from', parseAmount(text));
  };
  const handleToChange = (text: string) => {
    setToText(text);
    recompute('to', parseAmount(text));
  };
  // Normalise a field to the grouped format when it loses focus.
  const formatOnBlur = (which: Field) => () => {
    const reformat = (t: string) => {
      const n = parseAmount(t);
      return n > 0 ? formatAmount(n) : '';
    };
    if (which === 'from') setFromText(reformat);
    else setToText(reformat);
  };

  const applyConfig = (next: ExchangeConfig, keepFrom: number) => {
    const nextPair = resolvePair(next, rates);
    setConfig(next);
    if (!nextPair) {
      setFromText('');
      setToText('');
      setResult(null);
      return;
    }
    const r = calculate(nextPair, 'from', keepFrom);
    setFromText(keepFrom > 0 ? formatAmount(keepFrom) : '');
    setToText(keepFrom > 0 ? formatAmount(r.to) : '');
    setResult(r);
  };

  const selectFrom = (code: string) => {
    setPicker(null);
    if (code === config.fromCurrency) return;
    const next = firstConfigFrom(configs, code);
    if (next) applyConfig(next, fromNum);
  };
  const selectTo = (code: string) => {
    setPicker(null);
    if (code === config.toCurrency) return;
    const next = findConfig(configs, config.fromCurrency, code);
    if (next) applyConfig(next, fromNum);
  };

  const swap = () => {
    const target = swapTarget(configs, config);
    if (!target) return;
    const newFrom = parseAmount(toText); // swap amounts too (spec 4.3)
    applyConfig(target, newFrom);
  };

  const createDisabled = !result || result.from <= 0;

  return (
    <View style={styles.card}>
      <CurrencyField
        label="Отправляю"
        code={config.fromCurrency}
        value={fromText}
        onChangeText={handleFromChange}
        onBlur={formatOnBlur('from')}
        onPressSelector={() => setPicker('from')}
        selectorDisabled={fromOptions.length <= 1}
      />

      <SwapDivider onPress={swap} disabled={!canSwap} />

      <CurrencyField
        label="Получаю"
        code={config.toCurrency}
        value={toText}
        onChangeText={handleToChange}
        onBlur={formatOnBlur('to')}
        onPressSelector={() => setPicker('to')}
        selectorDisabled={toOptions.length <= 1}
      />

      <Text style={styles.rateLine}>
        {result ? `Курс: ${result.rateLine}` : 'Курс недоступен'}
      </Text>

      <PrimaryButton
        label="Создать сделку"
        onPress={() => onCreateDeal(config)}
        disabled={createDisabled}
      />

      <CurrencyPickerSheet
        visible={picker === 'from'}
        title="Отправляю"
        options={fromOptions}
        selected={config.fromCurrency}
        onSelect={selectFrom}
        onClose={() => setPicker(null)}
      />
      <CurrencyPickerSheet
        visible={picker === 'to'}
        title="Получаю"
        options={toOptions}
        selected={config.toCurrency}
        onSelect={selectTo}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 20,
    marginHorizontal: spacing.card,
    ...cardShadow,
  },
  rateLine: { ...font.rateLine, marginTop: 14, marginBottom: 16 },
});
