import { useState, useMemo } from 'react';
import { Settings, ListOrdered, Plus, Trash2, Target, RefreshCw,
  Wallet, BarChart3, TrendingUp, Banknote, Layers, Table, DollarSign } from 'lucide-react';
import { calculateCryptoMartingale } from '../utils/cryptoCalculator';
import { formatUSD, formatCryptoQty } from '../utils/formatCrypto';
import { formatRupiah, formatNumber } from '../utils/format';

export default function CryptoCalculator() {
  const [settings, setSettings] = useState({
    baseCapitalUSD: 100,
    multiplier: 2,
    buyFeePercent: 0.1,
    sellFeePercent: 0.1,
    usdToIdr: 16500,
  });

  const [buyPrices, setBuyPrices] = useState([60000, 55000, 50000]);
  const [sellPrice, setSellPrice] = useState(65000);

  const handleSettingChange = (field, value) => {
    if (value === '') { setSettings(s => ({ ...s, [field]: '' })); return; }
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) setSettings(s => ({ ...s, [field]: parsed }));
  };

  const handlePriceChange = (index, value) => {
    const newPrices = [...buyPrices];
    newPrices[index] = value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value));
    setBuyPrices(newPrices);
  };

  const handleSellChange = (value) => {
    setSellPrice(value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)));
  };

  const result = useMemo(() => {
    const vBuy = buyPrices.map(p => (p === '' ? 0 : Number(p)));
    const vSell = sellPrice === '' ? 0 : Number(sellPrice);
    const vBase = settings.baseCapitalUSD === '' ? 0 : Number(settings.baseCapitalUSD);
    const vMul = settings.multiplier === '' ? 0 : Number(settings.multiplier);
    const vBuyFee = settings.buyFeePercent === '' ? 0 : Number(settings.buyFeePercent);
    const vSellFee = settings.sellFeePercent === '' ? 0 : Number(settings.sellFeePercent);
    const vRate = settings.usdToIdr === '' ? 0 : Number(settings.usdToIdr);

    return calculateCryptoMartingale({
      baseCapitalUSD: vBase, multiplier: vMul,
      buyFeePercent: vBuyFee, sellFeePercent: vSellFee,
      buyPrices: vBuy, sellPrice: vSell, usdToIdr: vRate,
    });
  }, [settings, buyPrices, sellPrice]);

  const isProfit = result ? result.netProfit >= 0 : true;
  const profitPct = result ? (result.netProfitPercent * 100).toFixed(2) : '0';

  const settingsFields = [
    { id: 'cBaseCapital', label: 'Modal Tahap 1', field: 'baseCapitalUSD', prefix: '$', placeholder: '100', step: '10' },
    { id: 'cMultiplier', label: 'Multiplier', field: 'multiplier', prefix: 'x', placeholder: '2', step: '0.1' },
    { id: 'cBuyFee', label: 'Fee Beli (%)', field: 'buyFeePercent', prefix: '%', placeholder: '0.1', step: '0.01' },
    { id: 'cSellFee', label: 'Fee Jual (%)', field: 'sellFeePercent', prefix: '%', placeholder: '0.1', step: '0.01' },
    { id: 'cUsdRate', label: 'Kurs USD/IDR', field: 'usdToIdr', prefix: 'Rp', placeholder: '16500', step: '100' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* === Capital Settings === */}
      <div className="card">
        <div className="section-title">
          <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Settings size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h2>Pengaturan Modal Crypto</h2>
            <p>Konfigurasi dalam USD dengan konversi ke Rupiah</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {settingsFields.map((f) => (
            <div key={f.id}>
              <label className="field-label" htmlFor={f.id}>{f.label}</label>
              <div className="input-wrap">
                <span className="prefix">{f.prefix}</span>
                <input id={f.id} type="number" className="input-field"
                  placeholder={f.placeholder} value={settings[f.field]}
                  onChange={(e) => handleSettingChange(f.field, e.target.value)}
                  min="0" step={f.step} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Trading Plan === */}
      <div className="card">
        <div className="section-title">
          <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <ListOrdered size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h2>Rencana Entry Crypto</h2>
            <p>Level harga beli & target jual dalam USD</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
          <div>
            <label className="field-label">Level Harga Beli (USD)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {buyPrices.map((price, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="level-num">{i + 1}</div>
                  <div className="input-wrap" style={{ flex: 1 }}>
                    <span className="prefix">$</span>
                    <input id={`cBuyPrice-${i}`} type="number" className="input-field"
                      placeholder={`Tahap ${i + 1}`} value={price}
                      onChange={(e) => handlePriceChange(i, e.target.value)} min="0" />
                  </div>
                  <button className="btn-icon"
                    onClick={() => { if (buyPrices.length > 1) setBuyPrices(buyPrices.filter((_, j) => j !== i)); }}
                    disabled={buyPrices.length <= 1}
                    style={{ opacity: buyPrices.length <= 1 ? 0.25 : 1 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-add" onClick={() => setBuyPrices([...buyPrices, ''])}
              style={{ marginTop: '12px', width: '100%' }}>
              <Plus size={15} /> Tambah Level
            </button>
          </div>

          <div style={{ borderLeft: '1px solid rgba(55, 65, 100, 0.3)', paddingLeft: '24px' }}>
            <label className="field-label" htmlFor="cSellPrice">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={13} style={{ color: '#4ade80' }} />
                Target Jual (USD)
              </span>
            </label>
            <div className="input-wrap">
              <span className="prefix">$</span>
              <input id="cSellPrice" type="number" className="input-field"
                placeholder="Harga target jual" value={sellPrice}
                onChange={(e) => handleSellChange(e.target.value)} min="0" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Harga di mana seluruh posisi dijual
            </p>

            {/* Live conversion preview */}
            {sellPrice && settings.usdToIdr && (
              <div style={{
                marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <RefreshCw size={12} style={{ color: '#60a5fa' }} />
                <p style={{ fontSize: '12px', color: '#60a5fa' }}>
                  ≈ {formatRupiah(Number(sellPrice) * Number(settings.usdToIdr))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === Results === */}
      {result && (
        <>
          <div className="section-divider">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Hasil Kalkulasi Crypto
            </span>
          </div>

          {/* Per-level capital cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(result.levels.length, 5)}, 1fr)`,
            gap: '12px',
          }}>
            {result.levels.map((lv) => (
              <div key={`cl-${lv.level}`} className="stat-card amber">
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Layers size={16} style={{ color: '#fbbf24' }} />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Modal Tahap {lv.level}
                </p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '2px' }}>
                  {formatUSD(lv.totalCostWithFee)}
                </p>
                <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '2px' }}>
                  ≈ {formatRupiah(lv.totalCostIDR)}
                </p>
                <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>
                  {formatCryptoQty(lv.quantity)} coin @ {formatUSD(lv.buyPrice, 0)}
                </p>
              </div>
            ))}
          </div>

          {/* Main summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {/* Total Capital */}
            <div className="stat-card blue" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Wallet size={18} style={{ color: '#818cf8' }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total Modal</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '2px' }}>{formatUSD(result.totalCapitalUSD)}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#60a5fa', marginBottom: '2px' }}>≈ {formatRupiah(result.totalCapitalIDR)}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatCryptoQty(result.totalQty)} coin</p>
            </div>

            {/* Average Price */}
            <div className="stat-card amber">
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <BarChart3 size={18} style={{ color: '#fbbf24' }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Average Price</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '2px' }}>{formatUSD(result.finalAveragePrice)}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Harga rata-rata per coin</p>
            </div>

            {/* Net Profit */}
            <div className={`stat-card ${isProfit ? 'green' : 'red'}`}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: isProfit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <TrendingUp size={18} style={{ color: isProfit ? '#4ade80' : '#f87171' }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Profit Bersih</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '2px' }}>{formatUSD(result.netProfit)}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#60a5fa', marginBottom: '2px' }}>≈ {formatRupiah(result.netProfitIDR)}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: isProfit ? '#4ade80' : '#f87171' }}>{isProfit ? '+' : ''}{profitPct}%</p>
            </div>

            {/* Sell Revenue */}
            <div className="stat-card blue">
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Banknote size={18} style={{ color: '#a78bfa' }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Pendapatan Jual</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '2px' }}>{formatUSD(result.sellNetRevenue)}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Fee: {formatUSD(result.sellFeeAmount)}</p>
            </div>
          </div>

          {/* Execution Table */}
          <div className="card">
            <div className="section-title">
              <div className="icon-box" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <Table size={18} style={{ color: '#4ade80' }} />
              </div>
              <div>
                <h2>Rincian Eksekusi</h2>
                <p>Breakdown pembelian per tahap</p>
              </div>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tahap</th>
                    <th>Harga Beli</th>
                    <th>Quantity</th>
                    <th>Dana (USD)</th>
                    <th>Fee Beli</th>
                    <th>Total (USD)</th>
                    <th>Total (IDR)</th>
                    <th>Kum. Qty</th>
                    <th>Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {result.levels.map((lv) => (
                    <tr key={lv.level}>
                      <td>
                        <span className="level-num" style={{ width: '26px', height: '26px', fontSize: '11px' }}>{lv.level}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatUSD(lv.buyPrice, 0)}</td>
                      <td>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
                          {formatCryptoQty(lv.quantity)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-primary)' }}>{formatUSD(lv.actualCost)}</td>
                      <td style={{ color: 'rgba(251, 191, 36, 0.6)', fontSize: '13px' }}>{formatUSD(lv.buyFeeAmount)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatUSD(lv.totalCostWithFee)}</td>
                      <td style={{ fontSize: '13px', color: '#60a5fa' }}>{formatRupiah(lv.totalCostIDR)}</td>
                      <td>{formatCryptoQty(lv.cumulativeQty)}</td>
                      <td style={{ fontWeight: 700, color: '#fbbf24' }}>{formatUSD(lv.averagePrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
