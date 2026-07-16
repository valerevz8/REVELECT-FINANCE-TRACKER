import { useState } from 'react'
import { Wallet, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function AuthScreen() {
  const [mode, setMode] = useState('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    if (mode === 'sign_in') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) setError(signInError.message)
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setNotice('Akun berhasil dibuat. Cek email kamu untuk konfirmasi, lalu masuk.')
        setMode('sign_in')
      }
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="brand-mark">
          <Wallet size={22} strokeWidth={1.75} />
          <span>Revelect</span>
        </div>
        <h1>Uang kamu,
          <br />
          tersusun rapi.</h1>
        <p className="auth-panel-copy">
          Catat pemasukan dan pengeluaran sekali, pantau dari HP, tablet, atau
          laptop mana saja — datanya tersimpan aman di cloud milikmu sendiri.
        </p>
        <div className="auth-panel-figures">
          <div>
            <span className="figure-num">Rp 0</span>
            <span className="figure-label">Titik awal yang jujur</span>
          </div>
          <div>
            <span className="figure-num">24/7</span>
            <span className="figure-label">Sinkron di semua perangkat</span>
          </div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'sign_in' ? 'active' : ''}
              onClick={() => { setMode('sign_in'); setError(''); setNotice('') }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={mode === 'sign_up' ? 'active' : ''}
              onClick={() => { setMode('sign_up'); setError(''); setNotice('') }}
            >
              Daftar
            </button>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
            />
          </label>

          <label className="field">
            <span>Kata sandi</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </label>

          {error && <div className="auth-message error">{error}</div>}
          {notice && <div className="auth-message notice">{notice}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <>
                {mode === 'sign_in' ? 'Masuk ke akun' : 'Buat akun baru'}
                <ArrowRight size={16} strokeWidth={2} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
