import { Trash2, ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react'
import { formatIDR, formatDateID } from '../lib/format'
import { supabase } from '../lib/supabaseClient'

export default function TransactionList({ transactions, loading, onDeleted }) {
  async function handleDelete(id) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) onDeleted(id)
  }

  if (loading) {
    return (
      <div className="tx-list">
        {[0, 1, 2, 3].map((i) => (
          <div className="tx-row skeleton-row" key={i}>
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <Inbox size={28} strokeWidth={1.25} />
        <p>Belum ada transaksi tercatat.</p>
        <span>Mulai catat pemasukan atau pengeluaran pertamamu lewat tombol di atas.</span>
      </div>
    )
  }

  return (
    <div className="tx-list">
      {transactions.map((tx) => (
        <div className="tx-row" key={tx.id}>
          <div className={`tx-icon ${tx.type}`}>
            {tx.type === 'income' ? (
              <ArrowDownLeft size={16} strokeWidth={2} />
            ) : (
              <ArrowUpRight size={16} strokeWidth={2} />
            )}
          </div>
          <div className="tx-info">
            <span className="tx-category">{tx.category}</span>
            <span className="tx-meta">
              {formatDateID(tx.occurred_on)}
              {tx.note ? ` · ${tx.note}` : ''}
            </span>
          </div>
          <span className={`tx-amount ${tx.type}`}>
            {tx.type === 'income' ? '+' : '−'} {formatIDR(tx.amount)}
          </span>
          <button
            type="button"
            className="btn-icon tx-delete"
            onClick={() => handleDelete(tx.id)}
            aria-label="Hapus transaksi"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      ))}
    </div>
  )
}
