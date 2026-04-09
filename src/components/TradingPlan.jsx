import { ListOrdered, Plus, Trash2, Target } from 'lucide-react';

export default function TradingPlan({ buyPrices, onUpdateBuyPrices, sellPrice, onUpdateSellPrice }) {
  const handlePriceChange = (index, value) => {
    const newPrices = [...buyPrices];
    newPrices[index] = value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value));
    onUpdateBuyPrices(newPrices);
  };

  const addLevel = () => onUpdateBuyPrices([...buyPrices, '']);

  const removeLevel = (index) => {
    if (buyPrices.length <= 1) return;
    onUpdateBuyPrices(buyPrices.filter((_, i) => i !== index));
  };

  const handleSellChange = (value) => {
    onUpdateSellPrice(value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value)));
  };

  return (
    <div className="card">
      <div className="section-title">
        <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
          <ListOrdered size={18} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <h2>Rencana Trading</h2>
          <p>Atur level harga beli & target jual</p>
        </div>
      </div>

      {/* Content: 2 areas side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        {/* Left: Buy Levels */}
        <div>
          <label className="field-label">Level Harga Beli</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {buyPrices.map((price, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="level-num">{i + 1}</div>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <span className="prefix">Rp</span>
                  <input
                    id={`buyPrice-${i}`}
                    type="number"
                    className="input-field"
                    placeholder={`Tahap ${i + 1}`}
                    value={price}
                    onChange={(e) => handlePriceChange(i, e.target.value)}
                    min="0"
                  />
                </div>
                <button
                  className="btn-icon"
                  onClick={() => removeLevel(i)}
                  disabled={buyPrices.length <= 1}
                  style={{ opacity: buyPrices.length <= 1 ? 0.25 : 1 }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn-add" onClick={addLevel} style={{ marginTop: '12px', width: '100%' }}>
            <Plus size={15} /> Tambah Level
          </button>
        </div>

        {/* Right: Sell Target */}
        <div style={{ borderLeft: '1px solid rgba(55, 65, 100, 0.3)', paddingLeft: '24px' }}>
          <label className="field-label" htmlFor="sellPrice">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={13} style={{ color: '#4ade80' }} />
              Target Jual (All-Out)
            </span>
          </label>
          <div className="input-wrap">
            <span className="prefix">Rp</span>
            <input
              id="sellPrice"
              type="number"
              className="input-field"
              placeholder="Harga target jual"
              value={sellPrice}
              onChange={(e) => handleSellChange(e.target.value)}
              min="0"
            />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Harga di mana seluruh posisi dijual
          </p>

          <div style={{
            marginTop: '16px', padding: '12px 14px', borderRadius: '8px',
            background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(74, 222, 128, 0.6)', lineHeight: 1.5 }}>
              <strong style={{ color: 'rgba(74, 222, 128, 0.85)' }}>Tips:</strong> Harga jual harus di atas average price agar profit setelah fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
