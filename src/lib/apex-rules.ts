/** Public-rule teaching helper only. It is not the production Bot or its notification engine. */
export const APEX_TIMEFRAMES = ['1H', '2H', '3H', '4H', '1D'] as const;
export type ApexTimeframe = typeof APEX_TIMEFRAMES[number];
export type DemoRecord = { symbol: string; direction: 'BUY' | 'SELL'; timeframe: string; hoursAgo: number };

export function calculateDemoCoverage(records: readonly DemoRecord[], symbol: string, direction: 'BUY' | 'SELL') {
  if (records.some((record) => record.hoursAgo === 168)) throw new RangeError('The exact 168-hour boundary is not defined by the handoff. Use non-boundary illustrative records.');
  const matches = new Set(records.filter((record) => record.symbol === symbol && record.direction === direction &&
    Number.isFinite(record.hoursAgo) && record.hoursAgo >= 0 && record.hoursAgo < 168 &&
    APEX_TIMEFRAMES.includes(record.timeframe as ApexTimeframe)).map((record) => record.timeframe));
  const matchedTimeframes = APEX_TIMEFRAMES.filter((timeframe) => matches.has(timeframe));
  return { kind: 'illustrative' as const, symbol, direction, matchedTimeframes, coverage: matchedTimeframes.length,
    totalTimeframes: 5 as const, reachesAnnouncedThreshold: matchedTimeframes.length >= 4 };
}
