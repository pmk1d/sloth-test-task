/* Ad-hoc verification of the exchange math against the real mock data.
 * Run: node --experimental-strip-types src/lib/exchange.verify.ts
 * (Not a unit-test framework — just assertions printed to stdout.) */
import {
  resolvePair,
  calculate,
  swapTarget,
  filterRates,
  baseTierRate,
  fromCurrencies,
  toCurrenciesFor,
  findConfig,
} from './exchange.ts';
import type { ExchangeConfig, Rate } from '../api/types.ts';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const load = (f: string) => JSON.parse(readFileSync(join(here, '../../mock', f), 'utf8'));
const configs = load('GET_exchange-config.json') as ExchangeConfig[];
const rates = load('GET_rates.json') as Rate[];

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    pass++;
    console.log(`  ok  ${name}`);
  } else {
    fail++;
    console.log(`FAIL  ${name}`, detail ?? '');
  }
}
const near = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;

// fromCurrencies unique + ordered
check('fromCurrencies = [RUB, CNY]', JSON.stringify(fromCurrencies(configs)) === JSON.stringify(['RUB', 'CNY']));
check('toCurrenciesFor(RUB) = [CNY, THB, USDT]', JSON.stringify(toCurrenciesFor(configs, 'RUB')) === JSON.stringify(['CNY', 'THB', 'USDT']));
check('toCurrenciesFor(CNY) = [RUB]', JSON.stringify(toCurrenciesFor(configs, 'CNY')) === JSON.stringify(['RUB']));

// cfg_001 RUB -> CNY, base CNY, quote RUB-TBANK (tiers 13.10/13.25/13.40)
const cfg1 = findConfig(configs, 'RUB', 'CNY')!;
const pair1 = resolvePair(cfg1, rates)!;
check('pair1 resolved', !!pair1);
check('pair1 base=CNY quote=RUB', pair1.baseCurrency === 'CNY' && pair1.quoteCurrency === 'RUB');
check('pair1 fromIsBase=false (from=RUB=quote)', pair1.fromIsBase === false);

// Edit FROM (RUB=quote) = 134000 -> tier2 (>=50000 RUB, 13.40), base CNY = 134000/13.40 = 10000
const r1 = calculate(pair1, 'from', 134000);
check('134000 RUB -> rate 13.40 (top tier)', r1.rate === 13.40, r1.rate);
check('134000 RUB -> 10000 CNY exactly', near(r1.to, 10000), r1.to);
check('rateLine = "1 CNY = 13.4 RUB"', r1.rateLine === '1 CNY = 13.4 RUB', r1.rateLine);

// Tier boundaries on the RUB (quote) amount
check('5000 RUB -> tier0 13.10', calculate(pair1, 'from', 5000).rate === 13.10);
check('9999 RUB -> tier0 13.10', calculate(pair1, 'from', 9999).rate === 13.10);
check('10000 RUB -> tier1 13.25', calculate(pair1, 'from', 10000).rate === 13.25);
check('49999 RUB -> tier1 13.25', calculate(pair1, 'from', 49999).rate === 13.25);
check('50000 RUB -> tier2 13.40', calculate(pair1, 'from', 50000).rate === 13.40);

// Edit TO (CNY=base) = 10000 CNY -> solveFromBase: 10000*13.40=134000 >= 50000 -> tier2
const rTo = calculate(pair1, 'to', 10000);
check('10000 CNY -> tier2 13.40', rTo.rate === 13.40, rTo.rate);
check('10000 CNY -> from 134000 RUB', near(rTo.from, 134000), rTo.from);

// Round-trip consistency: from X -> to Y -> editing to Y reproduces X & same tier
const a = calculate(pair1, 'from', 134000);
const b = calculate(pair1, 'to', a.to);
check('round-trip from->to->from stable', near(b.from, 134000) && b.rate === a.rate, { aTo: a.to, bFrom: b.from });

// Swap: RUB->CNY reverse is CNY->RUB (cfg_004) -> exists
const sw = swapTarget(configs, cfg1);
check('swap(RUB->CNY) = CNY->RUB', !!sw && sw.fromCurrency === 'CNY' && sw.toCurrency === 'RUB', sw?.id);

// Swap target for RUB->THB: reverse THB->RUB missing AND no config from=THB -> undefined
const cfgThb = findConfig(configs, 'RUB', 'THB')!;
check('swap(RUB->THB) unavailable', swapTarget(configs, cfgThb) === undefined);

// cfg_004 CNY->RUB shares rate_001 tiers; from=CNY=base now
const pair4 = resolvePair(findConfig(configs, 'CNY', 'RUB')!, rates)!;
check('pair4 fromIsBase=true (from=CNY=base)', pair4.fromIsBase === true);
// 1000 CNY: quote at 13.25 = 13250 >= 10000 (tier1) but at 13.40 = 13400 < 50000 -> tier1
const r4 = calculate(pair4, 'from', 1000);
check('cfg004: 1000 CNY -> tier1 13.25', r4.rate === 13.25, r4.rate);
check('cfg004: 1000 CNY -> 13250 RUB', near(r4.to, 13250), r4.to);
// 100 CNY: even at best rate 1340 < 10000 -> tier0 13.10
check('cfg004: 100 CNY -> tier0 13.10', calculate(pair4, 'from', 100).rate === 13.10);

// Rates list filtering
check('all rates = 5', filterRates(rates, 'all').length === 5);
check('fiat rates = 3 (base CNY/THB)', filterRates(rates, 'fiat').length === 3);
check('crypto rates = 2 (base USDT)', filterRates(rates, 'crypto').length === 2);
check('baseTierRate(rate_001) = 13.10', baseTierRate(rates[0]) === 13.10);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
