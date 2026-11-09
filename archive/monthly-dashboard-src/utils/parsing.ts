const CURRENCY_AND_SPACES = /[$€£¥\s%]/g;

const SUFFIX_MULTIPLIERS: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9 };

/** Accepts $1,200 and 1.2K style input. Returns null when the text is not a number. */
export function parseNumber(input: string): number | null {
  let text = input.trim().replace(CURRENCY_AND_SPACES, '').replace(/,/g, '');
  if (!text) return null;

  const multiplier = SUFFIX_MULTIPLIERS[text.slice(-1).toLowerCase()] ?? 1;
  if (multiplier !== 1) text = text.slice(0, -1);

  if (!/^-?\d*\.?\d+$/.test(text)) return null;
  return Number(text) * multiplier;
}
