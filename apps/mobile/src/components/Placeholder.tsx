import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

/** Shared "screen under construction" body for the stub destinations. */
export function Placeholder({
  icon,
  title,
  subtitle = 'Раздел в разработке',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageBg,
    padding: 24,
  },
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
});
