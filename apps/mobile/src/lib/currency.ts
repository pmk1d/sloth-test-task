/** Display helpers for currencies (symbols shown on the green coin badges). */

const SYMBOLS: Record<string, string> = {
  RUB: '₽',
  CNY: '¥',
  THB: '฿',
  USDT: '₮',
  USD: '$',
  KZT: '₸',
  UZS: 'soʻm',
  VND: '₫',
  BTC: '₿',
  ETH: 'Ξ',
};

/** Symbol for the coin badge / rate line; falls back to the first letter. */
export function currencySymbol(code: string): string {
  return SYMBOLS[code] ?? code.charAt(0);
}
