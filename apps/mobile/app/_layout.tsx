import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' },
          headerShadowVisible: false,
          // Show only the back chevron — hide the previous route's name
          // (it was falling back to the "(tabs)" group label).
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.pageBg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-order" options={{ title: 'Создать сделку' }} />
        <Stack.Screen name="orders" options={{ title: 'История' }} />
        <Stack.Screen name="support" options={{ title: 'Поддержка' }} />
        <Stack.Screen name="referral" options={{ title: 'Рефералы' }} />
        <Stack.Screen name="settings" options={{ title: 'Настройки' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
