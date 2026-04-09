import { Wallet, BarChart3, TrendingUp, Banknote, Layers } from 'lucide-react';
import { formatRupiah, formatRupiahDecimal, formatNumber } from '../utils/format';

export default function SummaryCards({ result }) {
  if (!result) return null;

  const isProfit = result.netProfit >= 0;
  const profitPercent = (result.netProfitPercent * 100).toFixed(2);

  // Build per-level capital cards
  const levelCards = result.levels.map((lv) => ({
    id: `modal-tahap-${lv.level}`,
    label: `Modal Tahap ${lv.level}`,
    value: formatRupiah(lv.totalCostWithFee),
    sub: `${formatNumber(lv.lots)} Lot · ${formatNumber(lv.shares)} lbr @ ${formatRupiah(lv.buyPrice)}`,
    icon: Layers,
    iconColor: '#60a5fa',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    cls: 'blue',
  }));

  const mainCards = [
    {
      id: 'totalCapital', label: 'Total Modal Dibutuhkan',
      value: formatRupiah(result.totalCapitalNeeded),
      sub: `${formatNumber(result.totalLots)} Lot · ${formatNumber(result.totalShares)} lembar`,
      icon: Wallet, iconColor: '#818cf8', iconBg: 'rgba(99, 102, 241, 0.1)', cls: 'blue',
      highlight: true,
    },
    {
      id: 'avgPrice', label: 'Average Price',
      value: formatRupiahDecimal(result.finalAveragePrice),
      sub: 'Harga rata-rata per lembar',
      icon: BarChart3, iconColor: '#fbbf24', iconBg: 'rgba(245, 158, 11, 0.1)', cls: 'amber',
    },
    {
      id: 'netProfit', label: 'Estimasi Profit Bersih',
      value: formatRupiah(result.netProfit),
      sub: `${isProfit ? '+' : ''}${profitPercent}%`,
      icon: TrendingUp,
      iconColor: isProfit ? '#4ade80' : '#f87171',
      iconBg: isProfit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      cls: isProfit ? 'green' : 'red',
    },
    {
      id: 'sellRevenue', label: 'Pendapatan Jual Bersih',
      value: formatRupiah(result.sellNetRevenue),
      sub: `Fee jual: ${formatRupiah(result.sellFeeAmount)}`,
      icon: Banknote, iconColor: '#a78bfa', iconBg: 'rgba(139, 92, 246, 0.1)', cls: 'blue',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Per-level capital cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(result.levels.length, 5)}, 1fr)`,
        gap: '12px',
      }}>
        {levelCards.map((c) => (
          <div key={c.id} className={`stat-card ${c.cls}`}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <c.icon size={16} style={{ color: c.iconColor }} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              {c.label}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '4px' }}>
              {c.value}
            </p>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {c.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {mainCards.map((c) => (
          <div key={c.id} className={`stat-card ${c.cls}`}
            style={c.highlight ? { border: '1px solid rgba(99, 102, 241, 0.3)' } : {}}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '8px',
              background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <c.icon size={18} style={{ color: c.iconColor }} />
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              {c.label}
            </p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.2, marginBottom: '4px' }}>
              {c.value}
            </p>
            <p style={{
              fontSize: '13px', fontWeight: 600,
              color: c.id === 'netProfit' ? (isProfit ? '#4ade80' : '#f87171') : 'var(--text-muted)'
            }}>
              {c.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
