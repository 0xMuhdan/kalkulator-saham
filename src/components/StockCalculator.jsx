import { useState, useMemo } from 'react';
import CapitalSettings from './CapitalSettings';
import TradingPlan from './TradingPlan';
import SummaryCards from './SummaryCards';
import ExecutionTable from './ExecutionTable';
import { calculateMartingale } from '../utils/calculator';

export default function StockCalculator() {
  const [settings, setSettings] = useState({
    baseCapital: 1000000,
    multiplier: 2,
    buyFeePercent: 0.15,
    sellFeePercent: 0.25,
  });

  const [buyPrices, setBuyPrices] = useState([1000, 900, 800]);
  const [sellPrice, setSellPrice] = useState(1100);

  const result = useMemo(() => {
    const validBuyPrices = buyPrices.map(p => (p === '' ? 0 : Number(p)));
    const validSellPrice = sellPrice === '' ? 0 : Number(sellPrice);
    const validBaseCapital = settings.baseCapital === '' ? 0 : Number(settings.baseCapital);
    const validMultiplier = settings.multiplier === '' ? 0 : Number(settings.multiplier);
    const validBuyFee = settings.buyFeePercent === '' ? 0 : Number(settings.buyFeePercent);
    const validSellFee = settings.sellFeePercent === '' ? 0 : Number(settings.sellFeePercent);

    return calculateMartingale({
      baseCapital: validBaseCapital,
      multiplier: validMultiplier,
      buyFeePercent: validBuyFee,
      sellFeePercent: validSellFee,
      buyPrices: validBuyPrices,
      sellPrice: validSellPrice,
    });
  }, [settings, buyPrices, sellPrice]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CapitalSettings settings={settings} onUpdate={setSettings} />
      <TradingPlan
        buyPrices={buyPrices}
        onUpdateBuyPrices={setBuyPrices}
        sellPrice={sellPrice}
        onUpdateSellPrice={setSellPrice}
      />

      {result && (
        <>
          <div className="section-divider">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Hasil Kalkulasi Saham
            </span>
          </div>
          <SummaryCards result={result} />
          <ExecutionTable result={result} />
        </>
      )}

      {!result && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Lengkapi semua input di atas untuk melihat hasil kalkulasi
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Pastikan harga beli, harga jual, dan modal terisi dengan benar
          </p>
        </div>
      )}
    </div>
  );
}
