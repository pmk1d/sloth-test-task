import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { font, spacing } from '../theme';
import { gearIcon } from '../icons/svg';

const GEAR = 56;

/**
 * Greeting + settings button. Shows "Привет, Иван!" when the user's first name
 * is known, otherwise "Привет!" (spec 4.1).
 */
export function Header({ firstName, onPressSettings }: { firstName?: string; onPressSettings?: () => void }) {
  const greeting = firstName ? `Привет, ${firstName}!` : 'Привет!';
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.sub}>Добро пожаловать в SLOTH</Text>
      </View>
      <Pressable
        onPress={onPressSettings}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Настройки"
        style={({ pressed }) => pressed && styles.pressed}
      >
        <SvgXml xml={gearIcon} width={GEAR} height={GEAR} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
  },
  textBlock: { flex: 1, paddingRight: 12 },
  greeting: { ...font.greeting },
  sub: { ...font.subGreeting, marginTop: 4 },
  pressed: { opacity: 0.7 },
});
