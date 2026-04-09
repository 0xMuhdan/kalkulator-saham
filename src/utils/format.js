/**
 * Format a number as Indonesian Rupiah currency string.
 * @param {number} value
 * @returns {string}
 */
export function formatRupiah(value) {
  if (value === null || value === undefined || isNaN(value)) return 'Rp 0';
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absValue);
  return `${value < 0 ? '-' : ''}Rp ${formatted}`;
}

/**
 * Format a number as Indonesian Rupiah with decimals.
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatRupiahDecimal(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return 'Rp 0';
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absValue);
  return `${value < 0 ? '-' : ''}Rp ${formatted}`;
}

/**
 * Format a number with thousands separator (Indonesian format).
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat('id-ID').format(value);
}

/**
 * Format a percentage value.
 * @param {number} value - decimal value (e.g. 0.05 for 5%)
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Parse a formatted Rupiah string or number input to a clean number.
 * @param {string|number} input
 * @returns {number}
 */
export function parseInputNumber(input) {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  // Remove all non-digit characters except comma and period
  const cleaned = String(input).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
