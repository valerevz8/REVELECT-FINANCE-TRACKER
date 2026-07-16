import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'
import { formatIDR } from '../lib/format'

export default function SummaryCards({ income, expense, loading }) {
  const balance = income - expense

  const cards = [
    {
      key: 'balance',
      label: 'Saldo bersih',
      value: balance,
      icon: PiggyBank,
      tone: balance >= 0 ? 'positive' : 'negative',
    },
    {
      key: 'income',
      label: 'Pemasukan',
      value: income,
      icon: TrendingUp,
      tone: 'positive',
    },
    {
      key: 'expense',
      label: 'Pengeluaran',
      value: expense,
      icon: TrendingDown,
      tone: 'negative',
    },
  ]

  return (
    <div className="summary-grid">
      {cards.map((card, i) => (
        <div
          className={`summary-card tone-${card.tone}`}
          key={card.key}
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <div className="summary-card-top">
            <span className="summary-card-label">{card.label}</span>
            <card.icon size={16} strokeWidth={1.75} />
          </div>
          {loading ? (
            <div className="skeleton-line" />
          ) : (
            <span className="summary-card-value">{formatIDR(card.value)}</span>
          )}
        </div>
      ))}
    </div>
  )
}
