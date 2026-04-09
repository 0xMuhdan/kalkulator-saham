/**
 * Format USD currency string
 */
export function formatUSD(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '$0';
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absValue);
  return `${value < 0 ? '-' : ''}$${formatted}`;
}

/**
 * Format crypto quantity (up to 8 decimals)
 */
export function formatCryptoQty(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  if (value === 0) return '0';
  // Use up to 8 decimals but trim trailing zeros
  const formatted = parseFloat(value.toFixed(8));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(formatted);
}
