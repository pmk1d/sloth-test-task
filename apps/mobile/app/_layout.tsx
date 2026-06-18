import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="orders" options={{ title: 'Заявки' }} />
            <Stack.Screen name="create-order" options={{ title: 'Новая заявка' }} />
            <Stack.Screen name="support" options={{ title: 'Поддержка' }} />
            <Stack.Screen name="referral" options={{ title: 'Реферальная программа' }} />
        </Stack>
    );
}
