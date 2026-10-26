// This batch assumes all currencies use 2 minor-unit decimals (USD, EUR, GBP, INR).
// Zero-decimal (JPY, KRW) and 3-decimal (KWD, BHD) currencies are NOT supported here.
// Currency-aware formatting is deferred to the commerce batch where the currency decision is made.
export function formatPrice(priceMinor: number | null, currency: string | null): string | null {
  if (priceMinor === null || !currency) return null;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: priceMinor % 100 === 0 ? 0 : 2,
  }).format(priceMinor / 100);
}

export function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}