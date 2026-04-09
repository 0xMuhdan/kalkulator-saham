import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import RiskBanner from './components/RiskBanner';
import StockCalculator from './components/StockCalculator';
import CryptoCalculator from './components/CryptoCalculator';
import { Heart, BarChart2, Bitcoin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('stock');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-grid relative">
        <div className="bg-glow" />

        <Header />

        <main className="relative z-10 pb-16">
          <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <RiskBanner />

            {/* Tab Switcher */}
            <div className="card" style={{ padding: '6px', display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('stock')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  background: activeTab === 'stock' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: activeTab === 'stock' ? '#60a5fa' : 'var(--text-muted)',
                  outline: 'none',
                }}
              >
                <BarChart2 size={18} />
                Saham (IDR)
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  background: activeTab === 'crypto' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: activeTab === 'crypto' ? '#fbbf24' : 'var(--text-muted)',
                  outline: 'none',
                }}
              >
                <Bitcoin size={18} />
                Crypto Spot (USD)
              </button>
            </div>

            {/* Calculator Content */}
            {activeTab === 'stock' && <StockCalculator />}
            {activeTab === 'crypto' && <CryptoCalculator />}
          </div>
        </main>

        <footer className="relative z-10 py-8" style={{ borderTop: '1px solid rgba(55, 65, 100, 0.25)' }}>
          <div className="page-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              © 2026 Martingale Calculator — Alat bantu edukasi, bukan rekomendasi investasi
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Made with <Heart size={12} style={{ color: '#f43f5e' }} /> for Indonesian Traders
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
