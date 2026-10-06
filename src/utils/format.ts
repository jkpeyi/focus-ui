/** Locale-aware formatting helpers commonly needed in ERP screens. */

export function formatCurrency(value: number, currency = 'USD', locale?: string, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, ...options }).format(value);
}

export function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCompact(value: number, locale?: string) {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(value: number, locale?: string, fractionDigits = 1) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDate(value: Date | string | number, locale?: string, options?: Intl.DateTimeFormatOptions) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale, options ?? { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}
