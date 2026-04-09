import { AlertTriangle } from 'lucide-react';

export default function RiskBanner() {
  return (
    <div className="risk-banner">
      <AlertTriangle size={18} style={{ color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fcd34d', marginBottom: '4px' }}>
          ⚠ Peringatan Risiko
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(253, 211, 77, 0.5)', lineHeight: 1.6 }}>
          Strategi Martingale memiliki <strong style={{ color: 'rgba(253, 211, 77, 0.8)' }}>risiko sangat tinggi</strong> jika
          diterapkan pada saham downtrend. Modal bertumbuh eksponensial di setiap level.
        </p>
      </div>
    </div>
  );
}
