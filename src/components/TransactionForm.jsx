import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/format'
import { supabase } from '../lib/supabaseClient'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function TransactionForm({ userId, onCreated }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [note, setNote] = useState('')
  const [occurredOn, setOccurredOn] = useState(todayISO())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  function switchType(nextType) {
    setType(nextType)
    setCategory(nextType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      setError('Nominal harus lebih besar dari 0.')
      return
    }

    setSaving(true)
    const { data, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type,
        category,
        amount: numericAmount,
        note: note.trim() || null,
        occurred_on: occurredOn,
      })
      .select()
      .single()
    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    onCreated(data)
    setAmount('')
    setNote('')
    setOccurredOn(todayISO())
    setOpen(false)
  }

  if (!open) {
    return (
      <button className="btn-add-transaction" onClick={() => setOpen(true)}>
        <Plus size={16} strokeWidth={2} />
        Catat transaksi
      </button>
    )
  }

  return (
    <div className="tx-form-backdrop" onClick={() => setOpen(false)}>
      <form className="tx-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="tx-form-header">
          <h3>Transaksi baru</h3>
          <button type="button" className="btn-icon" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="type-toggle">
          <button
            type="button"
            className={type === 'expense' ? 'active expense' : ''}
            onClick={() => switchType('expense')}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            className={type === 'income' ? 'active income' : ''}
            onClick={() => switchType('income')}
          >
            Pemasukan
          </button>
        </div>

        <label className="field">
          <span>Nominal (Rp)</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="150000"
            autoFocus
          />
        </label>

        <label className="field">
          <span>Kategori</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Tanggal</span>
          <input
            type="date"
            required
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Catatan (opsional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="misalnya: makan siang tim"
            maxLength={140}
          />
        </label>

        {error && <div className="auth-message error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Menyimpan…' : 'Simpan transaksi'}
        </button>
      </form>
    </div>
  )
}
