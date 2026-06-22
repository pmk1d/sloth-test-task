import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { font, spacing } from '../theme';

export interface QuickAction {
  key: string;
  label: string;
  /** Raw Figma tile SVG (includes its own mint background). */
  svg: string;
  onPress: () => void;
}

const TILE = 56;

/** Four icon tiles in a row (spec 4.2). */
export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <View style={styles.row}>
      {actions.map((a) => (
        <Pressable
          key={a.key}
          onPress={a.onPress}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          style={styles.item}
        >
          {({ pressed }) => (
            <>
              <View style={pressed && styles.pressed}>
                <SvgXml xml={a.svg} width={TILE} height={TILE} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {a.label}
              </Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
  },
  item: { alignItems: 'center', width: 64 },
  pressed: { opacity: 0.7 },
  label: {
    ...font.quickAction,
    marginTop: 8,
  },
});
