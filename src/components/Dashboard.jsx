import { useEffect, useState } from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import SummaryCards from './SummaryCards'
import Charts from './Charts'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'

export default function Dashboard({ session }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTransactions() {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('occurred_on', { ascending: false })
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (error) {
        setLoadError(error.message)
      } else {
        setTransactions(data)
        setLoadError('')
      }
      setLoading(false)
    }

    loadTransactions()
    return () => { cancelled = true }
  }, [session.user.id])

  function handleCreated(tx) {
    setTransactions((prev) => [tx, ...prev])
  }

  function handleDeleted(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand-mark">
          <Wallet size={20} strokeWidth={1.75} />
          <span>Revelect</span>
        </div>
        <div className="header-right">
          <span className="user-email">{session.user.email}</span>
          <button type="button" className="btn-icon" onClick={() => supabase.auth.signOut()} aria-label="Keluar">
            <LogOut size={17} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <main className="dashboard-body">
        <div className="dashboard-toolbar">
          <div>
            <h1>Ringkasan keuangan</h1>
            <p className="subtitle">Semua transaksimu, di satu tempat.</p>
          </div>
          <TransactionForm userId={session.user.id} onCreated={handleCreated} />
        </div>

        {loadError && <div className="auth-message error page-error">{loadError}</div>}

        <SummaryCards income={income} expense={expense} loading={loading} />

        <Charts transactions={transactions} />

        <section className="tx-section">
          <h2>Riwayat transaksi</h2>
          <TransactionList transactions={transactions} loading={loading} onDeleted={handleDeleted} />
        </section>
      </main>
    </div>
  )
}
