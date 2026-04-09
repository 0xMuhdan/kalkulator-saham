import { Table } from 'lucide-react';
import { formatRupiah, formatRupiahDecimal, formatNumber } from '../utils/format';

export default function ExecutionTable({ result }) {
  if (!result || !result.levels || result.levels.length === 0) return null;

  return (
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
              <th>Lot</th>
              <th>Lembar</th>
              <th>Dana Beli</th>
              <th>Fee Beli</th>
              <th>Total Dana</th>
              <th>Kum. Lembar</th>
              <th>Avg Price</th>
            </tr>
          </thead>
          <tbody>
            {result.levels.map((lv) => (
              <tr key={lv.level}>
                <td>
                  <span className="level-num" style={{ width: '26px', height: '26px', fontSize: '11px' }}>
                    {lv.level}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatRupiah(lv.buyPrice)}</td>
                <td>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700,
                    background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa'
                  }}>
                    {formatNumber(lv.lots)}
                  </span>
                </td>
                <td>{formatNumber(lv.shares)}</td>
                <td style={{ color: 'var(--text-primary)' }}>{formatRupiah(lv.actualCost)}</td>
                <td style={{ color: 'rgba(251, 191, 36, 0.6)', fontSize: '13px' }}>{formatRupiah(lv.buyFeeAmount)}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatRupiah(lv.totalCostWithFee)}</td>
                <td>{formatNumber(lv.cumulativeShares)}</td>
                <td style={{ fontWeight: 700, color: '#60a5fa' }}>{formatRupiahDecimal(lv.averagePrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
