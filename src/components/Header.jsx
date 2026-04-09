import { TrendingUp } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-10" style={{ paddingTop: '40px', paddingBottom: '24px' }}>
      <div className="page-container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '12px' }}>
          <div className="logo-glow" style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Martingale
            </span>
            <span style={{ color: '#f1f5fb', marginLeft: '8px' }}>Calculator</span>
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: '#8b98b5', maxWidth: '500px', margin: '0 auto' }}>
          Perencanaan strategi <span style={{ color: '#60a5fa', fontWeight: 600 }}>averaging down</span> otomatis untuk trader saham Indonesia di BEI
        </p>
      </div>
    </header>
  );
}
