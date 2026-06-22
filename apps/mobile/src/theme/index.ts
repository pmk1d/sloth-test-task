/**
 * Design tokens taken straight from the reference (`design/Main Page.png`).
 * Centralising them keeps every component pixel-consistent with the mockup.
 */

// Colours are taken verbatim from the reference (`design/Main Page.png` SVG).
// Muted text in the reference is `#212121` at reduced opacity (a neutral grey),
// not a separate grey hex — so those tokens use rgba to match exactly over any
// background. Badge fills are the accent colour at 20% opacity.
export const colors = {
  /** SLOTH brand green — buttons, icon circles, active accents. */
  primary: '#32A25F',
  primaryPressed: '#2B8B51',
  /** Currency selector pills (reference `#E6F4EE`). */
  mint: '#E6F4EE',
  /** Whole-screen background and inset field boxes. */
  pageBg: '#FAFAFA',
  /** Calculator card surface. */
  surface: '#FFFFFF',

  /** Greeting, amounts, codes, rate values, quick-action labels, inactive tabs. */
  textPrimary: '#212121',
  /** Field labels, rate line, secondary pair code (#212121 @ 60%). */
  textMuted: 'rgba(33,33,33,0.6)',
  /** Sub-greeting (#212121 @ 80%). */
  textSubGreeting: 'rgba(33,33,33,0.8)',
  /** Tiny unit line "1,00 ¥" (#212121 @ 50%). */
  textTinyUnit: 'rgba(33,33,33,0.5)',
  /** Quick-action labels — solid in the reference. */
  textQuickAction: '#212121',

  divider: '#EEEEEE',
  white: '#FFFFFF',
  /** Muted green for disabled primary controls (CTA, swap button). */
  primaryDisabled: '#BFD8C9',

  // Percent badges (visual placeholders only — section 4.4). Reference uses the
  // accent colour at 20% opacity for the fill and full strength for the text.
  badgePositiveBg: 'rgba(50,162,95,0.2)', //  #32A25F @ 20%
  badgePositiveText: '#32A25F',
  badgeNegativeBg: 'rgba(255,71,71,0.2)', //  #FF4747 @ 20%
  badgeNegativeText: '#EE1F1F',
  badgeNeutralBg: 'rgba(93,137,247,0.2)', //  #5D89F7 @ 20%
  badgeNeutralText: '#5D89F7',
} as const;

export const radii = {
  pill: 999,
  card: 20,
  field: 14,
  button: 16,
  badge: 12,
} as const;

export const spacing = {
  screen: 20,
  card: 16,
} as const;

export const font = {
  greeting: { fontSize: 24, fontWeight: '700' as const, color: colors.textPrimary },
  subGreeting: { fontSize: 14, fontWeight: '400' as const, color: colors.textSubGreeting },
  amount: { fontSize: 26, fontWeight: '700' as const, color: colors.textPrimary },
  fieldLabel: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted },
  selector: { fontSize: 14, fontWeight: '600' as const, color: colors.textPrimary },
  rateLine: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '600' as const, color: colors.white },
  quickAction: { fontSize: 12, fontWeight: '400' as const, color: colors.textQuickAction },
  pairBig: { fontSize: 16, fontWeight: '700' as const, color: colors.textPrimary },
  pairSmall: { fontSize: 12, fontWeight: '400' as const, color: colors.textMuted },
  rateValue: { fontSize: 16, fontWeight: '700' as const, color: colors.textPrimary },
  tinyUnit: { fontSize: 11, fontWeight: '400' as const, color: colors.textTinyUnit },
  badge: { fontSize: 13, fontWeight: '600' as const },
} as const;

/** Soft shadow used only on the calculator card. */
export const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
} as const;
