import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { CATEGORY_COLORS, formatIDR } from '../lib/format'

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="chart-tooltip">
      <span>{item.name}</span>
      <strong>{formatIDR(item.value)}</strong>
    </div>
  )
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <span>{label}</span>
      {payload.map((p) => (
        <strong key={p.dataKey} className={p.dataKey}>
          {p.dataKey === 'income' ? 'Masuk' : 'Keluar'}: {formatIDR(p.value)}
        </strong>
      ))}
    </div>
  )
}

export default function Charts({ transactions }) {
  const categoryData = useMemo(() => {
    const totals = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount)
      })
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const trendData = useMemo(() => {
    const byMonth = {}
    transactions.forEach((t) => {
      const d = new Date(t.occurred_on)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!byMonth[key]) byMonth[key] = { key, income: 0, expense: 0 }
      byMonth[key][t.type] += Number(t.amount)
    })
    return Object.values(byMonth)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6)
      .map((row) => ({
        ...row,
        label: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(`${row.key}-01`)),
      }))
  }, [transactions])

  const hasExpense = categoryData.length > 0
  const hasTrend = trendData.length > 0

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Pengeluaran per kategori</h3>
        {hasExpense ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={82}
                paddingAngle={2}
                strokeWidth={0}
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8a8378'} />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">Belum ada data pengeluaran.</div>
        )}
        <div className="chart-legend">
          {categoryData.slice(0, 6).map((c) => (
            <div className="legend-item" key={c.name}>
              <span className="legend-dot" style={{ background: CATEGORY_COLORS[c.name] || '#8a8378' }} />
              {c.name}
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <h3>Tren 6 bulan terakhir</h3>
        {hasTrend ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData} barGap={4}>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<TrendTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
              <Bar dataKey="income" fill="var(--positive)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="var(--negative)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">Belum ada cukup data untuk tren.</div>
        )}
      </div>
    </div>
  )
}
