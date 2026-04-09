/**
 * Martingale Calculation Engine for Crypto Spot
 *
 * Key differences from stock calculator:
 * - No lot system — crypto uses fractional quantities
 * - Prices in USD
 * - Optional USD to IDR conversion
 */

/**
 * @param {Object} params
 * @param {number} params.baseCapitalUSD - Modal dasar entry pertama (USD)
 * @param {number} params.multiplier - Faktor pengali Martingale
 * @param {number} params.buyFeePercent - Fee beli (e.g. 0.1 for 0.1%)
 * @param {number} params.sellFeePercent - Fee jual (e.g. 0.1 for 0.1%)
 * @param {number[]} params.buyPrices - Array harga beli per level (USD)
 * @param {number} params.sellPrice - Harga target jual (USD)
 * @param {number} params.usdToIdr - Kurs USD ke IDR
 * @returns {Object|null}
 */
export function calculateCryptoMartingale({
  baseCapitalUSD, multiplier, buyFeePercent, sellFeePercent,
  buyPrices, sellPrice, usdToIdr
}) {
  if (!baseCapitalUSD || baseCapitalUSD <= 0) return null;
  if (!multiplier || multiplier <= 0) return null;
  if (!buyPrices || buyPrices.length === 0) return null;
  if (buyPrices.some(p => !p || p <= 0)) return null;
  if (!sellPrice || sellPrice <= 0) return null;

  const buyFeeRate = (buyFeePercent || 0) / 100;
  const sellFeeRate = (sellFeePercent || 0) / 100;
  const rate = usdToIdr || 16000;

  let cumulativeQty = 0;
  let cumulativeCost = 0;
  const levels = [];

  for (let i = 0; i < buyPrices.length; i++) {
    const level = i + 1;
    const buyPrice = buyPrices[i];

    // Target capital for this level (USD)
    const targetCapital = baseCapitalUSD * Math.pow(multiplier, i);

    // Quantity of crypto we can buy (no rounding needed)
    const rawQty = targetCapital / buyPrice;

    // Actual cost
    const actualCost = rawQty * buyPrice; // = targetCapital
    const buyFeeAmount = actualCost * buyFeeRate;
    const totalCostWithFee = actualCost + buyFeeAmount;

    // Cumulative
    cumulativeQty += rawQty;
    cumulativeCost += totalCostWithFee;

    // Average price
    const averagePrice = cumulativeQty > 0 ? cumulativeCost / cumulativeQty : 0;

    levels.push({
      level,
      buyPrice,
      targetCapital,
      quantity: rawQty,
      actualCost,
      buyFeeAmount,
      totalCostWithFee,
      cumulativeQty,
      cumulativeCost,
      averagePrice,
      // IDR conversions
      totalCostIDR: totalCostWithFee * rate,
      cumulativeCostIDR: cumulativeCost * rate,
    });
  }

  // Sell calculation
  const sellGrossRevenue = cumulativeQty * sellPrice;
  const sellFeeAmount = sellGrossRevenue * sellFeeRate;
  const sellNetRevenue = sellGrossRevenue - sellFeeAmount;
  const netProfit = sellNetRevenue - cumulativeCost;
  const netProfitPercent = cumulativeCost > 0 ? netProfit / cumulativeCost : 0;

  return {
    levels,
    totalCapitalUSD: cumulativeCost,
    totalCapitalIDR: cumulativeCost * rate,
    totalQty: cumulativeQty,
    finalAveragePrice: cumulativeQty > 0 ? cumulativeCost / cumulativeQty : 0,
    sellGrossRevenue,
    sellFeeAmount,
    sellNetRevenue,
    netProfit,
    netProfitIDR: netProfit * rate,
    netProfitPercent,
    usdToIdr: rate,
  };
}
