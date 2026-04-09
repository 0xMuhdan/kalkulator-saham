/**
 * Martingale Calculation Engine
 *
 * Rules:
 * - 1 Lot = 100 lembar
 * - Lot rounded down (Math.floor) to nearest 100 shares
 * - Each level's target capital = previous capital * multiplier
 * - Average price = cumulative total cost / cumulative total shares
 * - Net profit = (sell price * total shares) - sell fee - cumulative cost
 */

/**
 * @typedef {Object} LevelResult
 * @property {number} level - Tahap ke-N
 * @property {number} buyPrice - Harga beli per lembar
 * @property {number} targetCapital - Modal target untuk level ini
 * @property {number} rawShares - Lembar saham sebelum pembulatan
 * @property {number} lots - Jumlah lot yang didapat
 * @property {number} shares - Jumlah lembar saham (lots * 100)
 * @property {number} actualCost - Dana beli sebenarnya (shares * buyPrice)
 * @property {number} buyFeeAmount - Nominal fee beli
 * @property {number} totalCostWithFee - actualCost + buyFeeAmount
 * @property {number} cumulativeShares - Total lembar kumulatif
 * @property {number} cumulativeCost - Total dana terpakai kumulatif (termasuk fee)
 * @property {number} averagePrice - Harga rata-rata kumulatif
 */

/**
 * @typedef {Object} CalculationResult
 * @property {LevelResult[]} levels - Detail per level
 * @property {number} totalCapitalNeeded - Total modal yang dibutuhkan
 * @property {number} totalShares - Total lembar saham
 * @property {number} totalLots - Total lot
 * @property {number} finalAveragePrice - Average price akhir
 * @property {number} sellGrossRevenue - Pendapatan kotor dari penjualan
 * @property {number} sellFeeAmount - Nominal fee jual
 * @property {number} sellNetRevenue - Pendapatan bersih setelah fee jual
 * @property {number} netProfit - Keuntungan/kerugian bersih
 * @property {number} netProfitPercent - Persentase keuntungan/kerugian
 */

/**
 * Calculate Martingale strategy.
 * @param {Object} params
 * @param {number} params.baseCapital - Modal dasar entry pertama (Rp)
 * @param {number} params.multiplier - Faktor pengali Martingale
 * @param {number} params.buyFeePercent - Fee beli dalam persen (e.g. 0.15)
 * @param {number} params.sellFeePercent - Fee jual dalam persen (e.g. 0.25)
 * @param {number[]} params.buyPrices - Array harga beli per level
 * @param {number} params.sellPrice - Harga target jual
 * @returns {CalculationResult|null}
 */
export function calculateMartingale({ baseCapital, multiplier, buyFeePercent, sellFeePercent, buyPrices, sellPrice }) {
  // Validate inputs
  if (!baseCapital || baseCapital <= 0) return null;
  if (!multiplier || multiplier <= 0) return null;
  if (!buyPrices || buyPrices.length === 0) return null;
  if (buyPrices.some(p => !p || p <= 0)) return null;
  if (!sellPrice || sellPrice <= 0) return null;

  const buyFeeRate = (buyFeePercent || 0) / 100;
  const sellFeeRate = (sellFeePercent || 0) / 100;

  let cumulativeShares = 0;
  let cumulativeCost = 0;
  const levels = [];

  for (let i = 0; i < buyPrices.length; i++) {
    const level = i + 1;
    const buyPrice = buyPrices[i];

    // Target capital for this level
    const targetCapital = baseCapital * Math.pow(multiplier, i);

    // Raw shares from target capital (before lot rounding)
    const rawShares = targetCapital / buyPrice;

    // Round down to nearest lot (100 shares)
    const lots = Math.floor(rawShares / 100);

    // If we can't even buy 1 lot, skip or show 0
    const shares = lots * 100;

    // Actual cost based on rounded lots
    const actualCost = shares * buyPrice;

    // Buy fee
    const buyFeeAmount = actualCost * buyFeeRate;
    const totalCostWithFee = actualCost + buyFeeAmount;

    // Cumulative
    cumulativeShares += shares;
    cumulativeCost += totalCostWithFee;

    // Average price
    const averagePrice = cumulativeShares > 0 ? cumulativeCost / cumulativeShares : 0;

    levels.push({
      level,
      buyPrice,
      targetCapital,
      rawShares,
      lots,
      shares,
      actualCost,
      buyFeeAmount,
      totalCostWithFee,
      cumulativeShares,
      cumulativeCost,
      averagePrice,
    });
  }

  // Sell calculation
  const sellGrossRevenue = cumulativeShares * sellPrice;
  const sellFeeAmount = sellGrossRevenue * sellFeeRate;
  const sellNetRevenue = sellGrossRevenue - sellFeeAmount;
  const netProfit = sellNetRevenue - cumulativeCost;
  const netProfitPercent = cumulativeCost > 0 ? netProfit / cumulativeCost : 0;

  return {
    levels,
    totalCapitalNeeded: cumulativeCost,
    totalShares: cumulativeShares,
    totalLots: Math.floor(cumulativeShares / 100),
    finalAveragePrice: cumulativeShares > 0 ? cumulativeCost / cumulativeShares : 0,
    sellGrossRevenue,
    sellFeeAmount,
    sellNetRevenue,
    netProfit,
    netProfitPercent,
  };
}
