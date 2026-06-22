/**
 * Pure exchange/calculator logic.
 *
 * No React, no I/O — everything here is a deterministic function of its inputs
 * so the conversion rules (tiers, two-way editing, swap) are easy to reason
 * about and to unit-test (see `exchange.verify.ts`).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Model decisions (documented because the spec leaves room):
 *
 * 1. A `Rate` is defined as "1 BASE = rate QUOTE" (e.g. 1 CNY = 13.25 RUB).
 *
 * 2. Tier thresholds (`tier.min`) are expressed in the QUOTE currency — i.e. in
 *    RUB, the settlement currency. Every rate in the data quotes RUB
 *    (RUB-TBANK / RUB-BANKS), and the thresholds (10 000 / 50 000 / 100 000)
 *    only make business sense as ruble deal sizes — 100 000 *USDT* would be a
 *    ~9 000 000 ₽ deal. This reading is also direction-independent: rate_001
 *    (CNY/RUB) is shared by both RUB→CNY (cfg_001) and CNY→RUB (cfg_004), and
 *    the quote (RUB) is the one fixed leg across both.
 *
 * 3. "Применяется наибольший подходящий тир" → the highest tier whose `min`
 *    the deal's RUB value satisfies.
 * ───────────────────────────────────────────────────────────────────────────
 */
import type { ExchangeConfig, Rate, RateTier } from '../api/types';

/** Which of the two calculator fields the user just edited. */
export type Field = 'from' | 'to';

/**
 * Strip the payment-rail suffix from a quote id to get the bare currency.
 * "RUB-TBANK" -> "RUB", "RUB-BANKS" -> "RUB", "CNY" -> "CNY".
 */
export function currencyOf(rateLeg: string): string {
  const dash = rateLeg.indexOf('-');
  return dash === -1 ? rateLeg : rateLeg.slice(0, dash);
}

/** Find the rate matching a config's `rateBase` / `rateQuote`. */
export function findRate(rates: Rate[], config: ExchangeConfig): Rate | undefined {
  return rates.find((r) => r.base === config.rateBase && r.quote === config.rateQuote);
}

/** Tiers sorted ascending by `min` (defensive — input order is not trusted). */
function sortedTiers(tiers: RateTier[]): RateTier[] {
  return [...tiers].sort((a, b) => a.min - b.min);
}

/**
 * Highest tier whose threshold is met by `quoteAmount` (the deal's RUB value).
 * Falls back to the lowest tier (min 0) for tiny/zero amounts.
 */
export function tierForQuoteAmount(tiers: RateTier[], quoteAmount: number): RateTier {
  const asc = sortedTiers(tiers);
  let chosen = asc[0];
  for (const tier of asc) {
    if (quoteAmount >= tier.min) chosen = tier;
    else break;
  }
  return chosen;
}

/**
 * Solve the conversion when the BASE amount is the known input.
 *
 * The applied tier is decided by the QUOTE (RUB) value, which itself depends on
 * the rate — so we pick the highest tier `t` whose own threshold is met by the
 * quote it implies (`base * t.rate >= t.min`). Because the lowest tier has
 * min 0 this always resolves, and it round-trips exactly with
 * `tierForQuoteAmount` for monotonic rates.
 */
export function solveFromBase(
  tiers: RateTier[],
  baseAmount: number,
): { quote: number; tier: RateTier } {
  const desc = sortedTiers(tiers).reverse();
  for (const tier of desc) {
    const quote = baseAmount * tier.rate;
    if (quote >= tier.min) return { quote, tier };
  }
  const lowest = sortedTiers(tiers)[0];
  return { quote: baseAmount * lowest.rate, tier: lowest };
}

/**
 * A resolved, ready-to-use view of the active pair: which calculator side is
 * the rate's base vs. quote, plus the tier list.
 */
export interface ActivePair {
  config: ExchangeConfig;
  rate: Rate;
  baseCurrency: string; // e.g. "CNY"
  quoteCurrency: string; // e.g. "RUB"
  /** True when the "from" field holds the BASE currency of the rate. */
  fromIsBase: boolean;
  tiers: RateTier[];
}

/** Resolve everything needed to compute conversions for a config. */
export function resolvePair(config: ExchangeConfig, rates: Rate[]): ActivePair | undefined {
  const rate = findRate(rates, config);
  if (!rate) return undefined;
  const baseCurrency = currencyOf(rate.base);
  const quoteCurrency = currencyOf(rate.quote);
  return {
    config,
    rate,
    baseCurrency,
    quoteCurrency,
    fromIsBase: config.fromCurrency === baseCurrency,
    tiers: rate.tiers,
  };
}

export interface CalcResult {
  from: number;
  to: number;
  /** The tier rate currently applied (quote per 1 base). */
  rate: number;
  /** Pre-formatted human rate line, e.g. "1 CNY = 13.40 RUB". */
  rateLine: string;
  baseCurrency: string;
  quoteCurrency: string;
}

/**
 * Recompute the calculator after the user edits one field.
 *
 * `amount` is the new value of `edited`; the opposite field is derived. The
 * applied tier (and therefore the displayed rate) is always decided by the
 * QUOTE (RUB) value of the deal, regardless of which side was edited.
 */
export function calculate(pair: ActivePair, edited: Field, amount: number): CalcResult {
  const { tiers, baseCurrency, quoteCurrency, fromIsBase } = pair;
  const value = Number.isFinite(amount) && amount > 0 ? amount : 0;

  let baseAmount: number;
  let quoteAmount: number;
  let tier: RateTier;

  const editedIsBase = (edited === 'from') === fromIsBase;
  if (editedIsBase) {
    baseAmount = value;
    const solved = solveFromBase(tiers, baseAmount);
    quoteAmount = solved.quote;
    tier = solved.tier;
  } else {
    quoteAmount = value;
    tier = tierForQuoteAmount(tiers, quoteAmount);
    baseAmount = tier.rate > 0 ? quoteAmount / tier.rate : 0;
  }

  const fromVal = fromIsBase ? baseAmount : quoteAmount;
  const toVal = fromIsBase ? quoteAmount : baseAmount;

  return {
    from: fromVal,
    to: toVal,
    rate: tier.rate,
    rateLine: `1 ${baseCurrency} = ${formatRate(tier.rate)} ${quoteCurrency}`,
    baseCurrency,
    quoteCurrency,
  };
}

/** Unique `fromCurrency` values, preserving config sort order. */
export function fromCurrencies(configs: ExchangeConfig[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of bySortOrder(configs)) {
    if (!seen.has(c.fromCurrency)) {
      seen.add(c.fromCurrency);
      out.push(c.fromCurrency);
    }
  }
  return out;
}

/** `toCurrency` options available for a given `fromCurrency`. */
export function toCurrenciesFor(configs: ExchangeConfig[], fromCurrency: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of bySortOrder(configs)) {
    if (c.fromCurrency === fromCurrency && !seen.has(c.toCurrency)) {
      seen.add(c.toCurrency);
      out.push(c.toCurrency);
    }
  }
  return out;
}

export function findConfig(
  configs: ExchangeConfig[],
  fromCurrency: string,
  toCurrency: string,
): ExchangeConfig | undefined {
  return bySortOrder(configs).find(
    (c) => c.fromCurrency === fromCurrency && c.toCurrency === toCurrency,
  );
}

export function firstConfigFrom(
  configs: ExchangeConfig[],
  fromCurrency: string,
): ExchangeConfig | undefined {
  return bySortOrder(configs).find((c) => c.fromCurrency === fromCurrency);
}

/**
 * Resolve the target config when the user presses the swap button.
 *
 * Per spec: prefer the exact reverse pair if it exists in the config, otherwise
 * take the first available pair for the new `fromCurrency`. Returns `undefined`
 * when neither exists (the new from-currency isn't sold) — callers should treat
 * the swap as unavailable in that case rather than enter an invalid state.
 */
export function swapTarget(
  configs: ExchangeConfig[],
  current: ExchangeConfig,
): ExchangeConfig | undefined {
  const newFrom = current.toCurrency;
  const newTo = current.fromCurrency;
  return findConfig(configs, newFrom, newTo) ?? firstConfigFrom(configs, newFrom);
}

function bySortOrder(configs: ExchangeConfig[]): ExchangeConfig[] {
  return [...configs].sort((a, b) => a.sortOrder - b.sortOrder);
}

// ── Rates-list helpers (section 4.4) ──────────────────────────────────────

/** Currencies treated as crypto for fiat/crypto tab filtering. */
const CRYPTO = new Set(['USDT', 'BTC', 'ETH', 'USDC', 'TON']);

export function isCrypto(currency: string): boolean {
  return CRYPTO.has(currencyOf(currency));
}

export type RatesTab = 'all' | 'fiat' | 'crypto';

/**
 * Filter rates by the active tab:
 *  - all    → everything
 *  - fiat   → base is NOT crypto
 *  - crypto → base OR quote is USDT (crypto)
 */
export function filterRates(rates: Rate[], tab: RatesTab): Rate[] {
  if (tab === 'fiat') return rates.filter((r) => !isCrypto(r.base));
  if (tab === 'crypto') return rates.filter((r) => isCrypto(r.base) || isCrypto(r.quote));
  return rates;
}

/** First-tier (min 0) rate value used as the "current rate" in the list. */
export function baseTierRate(rate: Rate): number {
  return tierForQuoteAmount(rate.tiers, 0).rate;
}

// ── Formatting ────────────────────────────────────────────────────────────

/** Rate value with up to 2 decimals, trailing zeros trimmed: 13.1 -> "13.1". */
export function formatRate(value: number): string {
  return trimZeros(value.toFixed(2));
}

/**
 * Amount formatter for the calculator fields: groups thousands with a thin
 * space (RU convention) and keeps up to 2 decimals when present.
 */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 100) / 100;
  const [intPart, fracPart] = rounded.toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return fracPart === '00' ? grouped : `${grouped},${fracPart}`;
}

function trimZeros(s: string): string {
  return s.replace(/\.?0+$/, '');
}

/** Parse a user-typed amount that may contain spaces or a comma decimal. */
export function parseAmount(text: string): number {
  const normalized = text.replace(/[\s  ]/g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}
