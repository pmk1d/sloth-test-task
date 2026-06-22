import { Stack } from 'expo-router';

/** The home group has no chrome — it draws its own status pill + header. */
export default function TabsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
