import { Settings } from 'lucide-react';

export default function CapitalSettings({ settings, onUpdate }) {
  const handleChange = (field, value) => {
    if (value === '') {
      onUpdate({ ...settings, [field]: '' });
      return;
    }
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      onUpdate({ ...settings, [field]: parsed });
    }
  };

  const fields = [
    { id: 'baseCapital', label: 'Modal Tahap 1', field: 'baseCapital', prefix: 'Rp', placeholder: '1.000.000', step: '100000' },
    { id: 'multiplier', label: 'Multiplier', field: 'multiplier', prefix: 'x', placeholder: '2', step: '0.1' },
    { id: 'buyFee', label: 'Fee Beli (%)', field: 'buyFeePercent', prefix: '%', placeholder: '0.15', step: '0.01' },
    { id: 'sellFee', label: 'Fee Jual (%)', field: 'sellFeePercent', prefix: '%', placeholder: '0.25', step: '0.01' },
  ];

  return (
    <div className="card">
      <div className="section-title">
        <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <Settings size={18} style={{ color: '#60a5fa' }} />
        </div>
        <div>
          <h2>Pengaturan Modal</h2>
          <p>Konfigurasi dasar strategi Martingale</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {fields.map((f) => (
          <div key={f.id}>
            <label className="field-label" htmlFor={f.id}>{f.label}</label>
            <div className="input-wrap">
              <span className="prefix">{f.prefix}</span>
              <input
                id={f.id}
                type="number"
                className="input-field"
                placeholder={f.placeholder}
                value={settings[f.field]}
                onChange={(e) => handleChange(f.field, e.target.value)}
                min="0"
                step={f.step}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
