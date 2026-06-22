import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ExchangeConfig } from '../../src/api/types';
import { usingNetwork } from '../../src/api/client';
import { Calculator } from '../../src/components/Calculator';
import { Header } from '../../src/components/Header';
import { QuickActions, type QuickAction } from '../../src/components/QuickActions';
import { RatesList } from '../../src/components/RatesList';
import { useAppData } from '../../src/hooks/useAppData';
import { swapIcon, historyIcon, supportIcon, referralIcon } from '../../src/icons/svg';
import { colors } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { status, data, error, reload } = useAppData();

  const actions: QuickAction[] = [
    { key: 'exchange', label: 'Обменять', svg: swapIcon, onPress: () => router.push('/create-order') },
    { key: 'history', label: 'История', svg: historyIcon, onPress: () => router.push('/orders') },
    { key: 'support', label: 'Поддержка', svg: supportIcon, onPress: () => router.push('/support') },
    { key: 'referral', label: 'Рефералы', svg: referralIcon, onPress: () => router.push('/referral') },
  ];

  const onCreateDeal = (_config: ExchangeConfig) => router.push('/create-order');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Не удалось загрузить данные</Text>
          <Text style={styles.errorSub}>{error?.message}</Text>
          <Pressable style={styles.retry} onPress={reload}>
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      )}

      {status === 'ready' && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBlock}>
            <Header
              firstName={data.user.firstName}
              onPressSettings={() => router.push('/settings')}
            />
          </View>

          <View style={styles.quickBlock}>
            <QuickActions actions={actions} />
          </View>

          {data.configs.length > 0 ? (
            <Calculator configs={data.configs} rates={data.rates} onCreateDeal={onCreateDeal} />
          ) : (
            <Text style={styles.noPairs}>Нет доступных валютных пар</Text>
          )}

          <View style={styles.ratesBlock}>
            <RatesList rates={data.rates} />
          </View>

          {usingNetwork && <Text style={styles.networkHint}>● данные из API</Text>}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.pageBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  errorSub: { fontSize: 13, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  retry: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: { color: colors.white, fontWeight: '600' },
  headerBlock: { marginTop: 16 },
  quickBlock: { marginTop: 24, marginBottom: 24 },
  ratesBlock: { marginTop: 20 },
  noPairs: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  networkHint: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 11,
    marginTop: 16,
  },
});
