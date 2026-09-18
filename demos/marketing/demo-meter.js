/** Shared DEMO meter — canned decisions, measured wall time, labeled $. */
export const DEMO_RATE_USD = 0.000007; // labeled demo meter $/decision — not a vendor quote

export function money(n) {
  if (n < 0.0001) return "$" + n.toFixed(6);
  if (n < 0.01) return "$" + n.toFixed(5);
  if (n < 1) return "$" + n.toFixed(4);
  return "$" + n.toFixed(2);
}

export function msLabel(ms) {
  if (ms < 1) return ms.toFixed(2) + "ms";
  if (ms < 10) return ms.toFixed(1) + "ms";
  if (ms < 1000) return Math.round(ms) + "ms";
  return (ms / 1000).toFixed(2) + "s";
}

export function runTimed(fn) {
  const t0 = performance.now();
  const result = fn();
  const ms = performance.now() - t0;
  return { ms, result };
}
