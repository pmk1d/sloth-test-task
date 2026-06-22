import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font } from '../theme';
import { CurrencyBadge } from './CurrencyBadge';

/** Bottom-sheet currency picker. */
export function CurrencyPickerSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop propagation so taps inside the sheet don't close it. */}
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {options.map((code) => {
            const active = code === selected;
            return (
              <Pressable
                key={code}
                onPress={() => onSelect(code)}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <CurrencyBadge code={code} size={36} />
                <Text style={[styles.code, active && styles.codeActive]}>{code}</Text>
                {active && <Ionicons name="checkmark" size={22} color={colors.primary} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  pressed: { opacity: 0.6 },
  code: { ...font.selector, fontSize: 16, flex: 1 },
  codeActive: { color: colors.primary, fontWeight: '700' },
});
