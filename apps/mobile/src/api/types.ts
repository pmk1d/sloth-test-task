/**
 * Domain types. These mirror the JSON returned by the API exactly
 * (see `mock/GET_*.json` and `apps/api`), so swapping the mock data
 * source for live HTTP requests requires no changes here.
 */

/** `GET /api/users/me` */
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  referralCode: string;
}

export interface PaymentMethod {
  value: string;
  label: string;
  /** When set, this payment method swaps the rate quote (e.g. RUB-TBANK -> RUB-BANKS). */
  rateQuoteOverride?: string;
}

export interface ReceivePlatform {
  value: string;
  label: string;
}

/** One entry of `GET /api/exchange-config` — a single supported currency pair. */
export interface ExchangeConfig {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  /** Base currency of the rate used for this pair (e.g. "CNY"). */
  rateBase: string;
  /** Quote of the rate used for this pair, incl. payment rail (e.g. "RUB-TBANK"). */
  rateQuote: string;
  paymentMethods: PaymentMethod[];
  receivePlatforms: ReceivePlatform[];
  /** Minimum amount of `fromCurrency` allowed for a deal. */
  minAmount: number;
  sortOrder: number;
}

/**
 * A single rate tier: once the deal's value reaches `min`, this `rate` applies.
 * `min` is expressed in the QUOTE (settlement) currency — RUB — see the model
 * note at the top of `src/lib/exchange.ts`.
 */
export interface RateTier {
  min: number;
  rate: number;
}

/** One entry of `GET /api/rates` — a tiered rate for a base/quote pair. */
export interface Rate {
  id: string;
  base: string;
  quote: string;
  updatedAt: string;
  tiers: RateTier[];
}
