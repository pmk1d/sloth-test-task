/**
 * Data access layer.
 *
 * By default the app reads the bundled mock JSON (the same files the NestJS API
 * in `apps/api` serves). To switch to the real network API, set
 * `EXPO_PUBLIC_API_URL` (e.g. http://localhost:3001) — nothing else changes,
 * because the mock files and the HTTP responses share the exact same shape.
 *
 *   EXPO_PUBLIC_API_URL=http://localhost:3001 npx expo start
 */
import type { ExchangeConfig, Rate, User } from './types';

// Bundled mock data (Metro inlines these at build time). Assigning each import
// to a typed const validates the mock shape against the API types at compile time.
import usersMeJson from '../../mock/GET_users_me.json';
import exchangeConfigJson from '../../mock/GET_exchange-config.json';
import ratesJson from '../../mock/GET_rates.json';

const usersMe: User = usersMeJson;
const exchangeConfig: ExchangeConfig[] = exchangeConfigJson;
const rates: Rate[] = ratesJson;

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

/** Whether the app is talking to a live backend instead of bundled mocks. */
export const usingNetwork = Boolean(BASE_URL);

async function get<T>(endpoint: string, fallback: T): Promise<T> {
  if (!BASE_URL) return fallback;
  const res = await fetch(`${BASE_URL}/api/${endpoint}`);
  if (!res.ok) throw new Error(`GET /api/${endpoint} failed: ${res.status}`);
  return (await res.json()) as T;
}

export function getUsersMe(): Promise<User> {
  return get<User>('users/me', usersMe);
}

export function getExchangeConfig(): Promise<ExchangeConfig[]> {
  return get<ExchangeConfig[]>('exchange-config', exchangeConfig);
}

export function getRates(): Promise<Rate[]> {
  return get<Rate[]>('rates', rates);
}

export interface AppData {
  user: User;
  configs: ExchangeConfig[];
  rates: Rate[];
}

/** Load everything the home screen needs in one shot. */
export async function loadAppData(): Promise<AppData> {
  const [user, configs, rates] = await Promise.all([
    getUsersMe(),
    getExchangeConfig(),
    getRates(),
  ]);
  return { user, configs, rates };
}
