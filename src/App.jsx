import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, PieChart as PieIcon, Table as TableIcon, Globe, X, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, AlertCircle, CheckCircle2, LogOut, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { supabase } from './supabaseClient';

const REVELECT_LOGO = "data:image/png;base64,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";

/* ---------------------------------------------------------
   i18n
--------------------------------------------------------- */
const T = {
  id: {
    appName: 'Finance Tracker',
    tabs: { dashboard: 'Ringkasan', transactions: 'Transaksi', debts: 'Hutang', charts: 'Analisis', review: 'Review' },
    income: 'Pemasukan', expense: 'Pengeluaran', debtPayment: 'Bayar Hutang', investment: 'Investasi',
    totalIncome: 'Total Pemasukan', totalExpense: 'Total Pengeluaran', totalDebtPaid: 'Hutang Dibayar',
    totalInvested: 'Total Investasi', investable: 'Sisa Bisa Diinvest', netFlow: 'Arus Kas Bersih',
    healthScore: 'Skor Kesehatan Keuangan',
    healthy: 'Sehat', fairlyHealthy: 'Cukup Sehat', needsAttention: 'Perlu Perhatian', unhealthy: 'Tidak Sehat',
    breakdown: 'Rincian per Kategori', noData: 'Belum ada data bulan ini',
    addTransaction: 'Tambah Transaksi', addDebt: 'Tambah Hutang',
    date: 'Tanggal', type: 'Jenis', category: 'Kategori', note: 'Catatan', amount: 'Jumlah', actions: 'Aksi',
    save: 'Simpan', cancel: 'Batal', delete: 'Hapus', edit: 'Ubah',
    selectDebt: 'Pilih Hutang',
    debtName: 'Nama Hutang', totalDebt: 'Total Hutang', remaining: 'Sisa Hutang', monthlyPlan: 'Rencana Bayar/Bulan',
    debtProgress: 'Progres Pelunasan', noDebts: 'Belum ada hutang tercatat. Bagus.',
    totalDebtRemaining: 'Total Sisa Hutang Aktif',
    weeklyReview: 'Review Mingguan', monthlyReview: 'Review Bulanan',
    thisWeek: '7 Hari Terakhir', tips: 'Saran',
    vsLastWeek: 'vs minggu lalu', spent: 'terpakai', topCategory: 'Kategori Terbesar',
    noTx: 'Belum ada transaksi.',
    categories: {
      food: 'Makanan', rent: 'Kost/Sewa', transport: 'Transportasi', entertainment: 'Hiburan',
      bills: 'Tagihan', health: 'Kesehatan', gym: 'Gym', shopping: 'Belanja', other_expense: 'Lainnya',
      salary: 'Gaji', freelance: 'Freelance/Editing', trading: 'Trading', content: 'Konten', other_income: 'Lainnya',
      crypto: 'Crypto', stocks: 'Saham', other_investment: 'Lainnya',
    },
    monthNav: { prev: 'Sebelumnya', next: 'Berikutnya' },
    footerNote: 'Data tersimpan di cloud (Supabase), sync di semua device.',
    savingsRate: 'Tingkat Tabungan', debtRatio: 'Rasio Hutang/Pendapatan', discRatio: 'Rasio Konsumtif',
    of: 'dari', income_lc: 'pemasukan',
    close: 'Tutup',
    emptyReview: 'Belum cukup data untuk review bulan ini. Tambah transaksi dulu, bro.',
    scoreExplain: 'Skor dihitung dari tingkat tabungan, rasio hutang, dan rasio pengeluaran konsumtif.',
    budget: 'Anggaran', setBudget: 'Atur Anggaran', budgetLimit: 'Limit',
    noBudgetSet: 'Belum ada anggaran diatur. Klik "Atur Anggaran" buat mulai kontrol pengeluaran per kategori.',
    overBudget: 'Lewat anggaran', nearBudget: 'Mendekati limit', onTrack: 'Aman', noLimit: 'Tanpa limit (0 = tidak dilacak)',
    budgetAlertTitle: 'Peringatan Anggaran', budgetAlertBody: 'kategori melebihi limit bulan ini',
    logout: 'Keluar',
    loginTitle: 'Masuk', signupTitle: 'Daftar Akun',
    email: 'Email', password: 'Password',
    loginBtn: 'Masuk', signupBtn: 'Daftar', switchToSignup: 'Belum punya akun? Daftar', switchToLogin: 'Sudah punya akun? Masuk',
    authError: 'Terjadi kesalahan. Coba lagi.', checkEmail: 'Cek email kamu untuk konfirmasi akun.',
    loadingApp: 'Memuat...',
    forgotPassword: 'Lupa password?', backToLogin: 'Kembali ke login',
    resetPasswordTitle: 'Reset Password', sendResetLink: 'Kirim Link Reset',
    resetEmailSent: 'Link reset password udah dikirim ke email kamu. Cek inbox (atau folder spam).',
    newPassword: 'Password Baru', confirmPassword: 'Konfirmasi Password', updatePassword: 'Update Password',
    passwordUpdated: 'Password berhasil diupdate!', passwordMismatch: 'Password ga sama, coba lagi.',
  },
  en: {
    appName: 'Finance Tracker',
    tabs: { dashboard: 'Dashboard', transactions: 'Transactions', debts: 'Debts', charts: 'Analytics', review: 'Review' },
    income: 'Income', expense: 'Expense', debtPayment: 'Debt Payment', investment: 'Investment',
    totalIncome: 'Total Income', totalExpense: 'Total Expenses', totalDebtPaid: 'Debt Paid',
    totalInvested: 'Total Invested', investable: 'Investable Left', netFlow: 'Net Cash Flow',
    healthScore: 'Financial Health Score',
    healthy: 'Healthy', fairlyHealthy: 'Fairly Healthy', needsAttention: 'Needs Attention', unhealthy: 'Unhealthy',
    breakdown: 'Category Breakdown', noData: 'No data for this month yet',
    addTransaction: 'Add Transaction', addDebt: 'Add Debt',
    date: 'Date', type: 'Type', category: 'Category', note: 'Note', amount: 'Amount', actions: 'Actions',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
    selectDebt: 'Select Debt',
    debtName: 'Debt Name', totalDebt: 'Total Debt', remaining: 'Remaining', monthlyPlan: 'Monthly Plan',
    debtProgress: 'Payoff Progress', noDebts: 'No debts recorded. Good.',
    totalDebtRemaining: 'Total Active Debt',
    weeklyReview: 'Weekly Review', monthlyReview: 'Monthly Review',
    thisWeek: 'Last 7 Days', tips: 'Tips',
    vsLastWeek: 'vs last week', spent: 'spent', topCategory: 'Top Category',
    noTx: 'No transactions yet.',
    categories: {
      food: 'Food', rent: 'Rent/Kost', transport: 'Transport', entertainment: 'Entertainment',
      bills: 'Bills', health: 'Health', gym: 'Gym', shopping: 'Shopping', other_expense: 'Other',
      salary: 'Salary', freelance: 'Freelance/Editing', trading: 'Trading', content: 'Content', other_income: 'Other',
      crypto: 'Crypto', stocks: 'Stocks', other_investment: 'Other',
    },
    monthNav: { prev: 'Previous', next: 'Next' },
    footerNote: 'Data is stored in the cloud (Supabase), synced across devices.',
    savingsRate: 'Savings Rate', debtRatio: 'Debt-to-Income', discRatio: 'Discretionary Spend Ratio',
    of: 'of', income_lc: 'income',
    close: 'Close',
    emptyReview: 'Not enough data for this month\'s review yet. Add some transactions first.',
    scoreExplain: 'Score is calculated from savings rate, debt ratio, and discretionary spend ratio.',
    budget: 'Budget', setBudget: 'Set Budget', budgetLimit: 'Limit',
    noBudgetSet: 'No budget set yet. Click "Set Budget" to start controlling spend per category.',
    overBudget: 'Over budget', nearBudget: 'Near limit', onTrack: 'On track', noLimit: 'No limit (0 = untracked)',
    budgetAlertTitle: 'Budget Alert', budgetAlertBody: 'categories are over budget this month',
    logout: 'Log out',
    loginTitle: 'Sign In', signupTitle: 'Create Account',
    email: 'Email', password: 'Password',
    loginBtn: 'Sign In', signupBtn: 'Sign Up', switchToSignup: "Don't have an account? Sign up", switchToLogin: 'Already have an account? Sign in',
    authError: 'Something went wrong. Try again.', checkEmail: 'Check your email to confirm your account.',
    loadingApp: 'Loading...',
    forgotPassword: 'Forgot password?', backToLogin: 'Back to login',
    resetPasswordTitle: 'Reset Password', sendResetLink: 'Send Reset Link',
    resetEmailSent: 'A password reset link has been sent to your email. Check your inbox (or spam folder).',
    newPassword: 'New Password', confirmPassword: 'Confirm Password', updatePassword: 'Update Password',
    passwordUpdated: 'Password updated successfully!', passwordMismatch: 'Passwords don\'t match, try again.',
  },
};

const EXPENSE_CATS = ['food', 'rent', 'transport', 'entertainment', 'bills', 'health', 'gym', 'shopping', 'other_expense'];
const INCOME_CATS = ['salary', 'freelance', 'trading', 'content', 'other_income'];
const INVESTMENT_CATS = ['crypto', 'stocks', 'other_investment'];

const CAT_COLORS = {
  food: '#c9a977', rent: '#a8875a', transport: '#8b6f4a', entertainment: '#4f8a8b',
  bills: '#6b5a45', health: '#7c9a72', gym: '#5f8a7a', shopping: '#b0584f', other_expense: '#786b5a',
  salary: '#c9a977', freelance: '#4f8a8b', trading: '#7c9a72', content: '#a8875a', other_income: '#786b5a',
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

function fmtIDR(n) {
  const v = Math.round(n || 0);
  return 'Rp' + v.toLocaleString('id-ID');
}
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function toCamel(type) { if (type === 'debt_payment') return 'debtPayment'; return type; }

function mapTxRow(row) {
  return { id: row.id, date: row.date, type: row.type, category: row.category, debtId: row.debt_id, amount: Number(row.amount), note: row.note || '' };
}
function mapDebtRow(row) {
  return { id: row.id, name: row.name, total: Number(row.total), remaining: Number(row.remaining), monthlyPlan: row.monthly_plan != null ? Number(row.monthly_plan) : null };
}

/* ---------------------------------------------------------
   Top-level App: handles auth session, then renders FinanceApp
--------------------------------------------------------- */
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out
  const [lang, setLang] = useState('id');
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('fc-theme') || 'dark'; } catch { return 'dark'; }
  });
  function updateTheme(newTheme) {
    setThemeState(newTheme);
    try { localStorage.setItem('fc-theme', newTheme); } catch (e) { /* ignore */ }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    const bg = theme === 'light' ? '#f7f3ea' : '#0d0b09';
    const fg = theme === 'light' ? '#8a6a30' : '#c9a977';
    return <div style={{ background: bg, color: fg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Calibri, sans-serif' }}>...</div>;
  }
  if (isPasswordRecovery && session) {
    return <ResetPasswordScreen lang={lang} setLang={setLang} theme={theme} onDone={() => setIsPasswordRecovery(false)} />;
  }
  if (!session) {
    return <AuthScreen lang={lang} setLang={setLang} theme={theme} setTheme={updateTheme} />;
  }
  return <FinanceApp session={session} theme={theme} onThemeChange={updateTheme} />;
}

function PasswordField({ label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <label className="fc-field">
      <span>{label}</span>
      <div className="fc-password-wrap">
        <input type={show ? 'text' : 'password'} required minLength={6} value={value} onChange={onChange} autoComplete={autoComplete} />
        <button type="button" className="fc-password-eye" onClick={() => setShow(s => !s)} tabIndex={-1}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

function AuthScreen({ lang, setLang, theme, setTheme }) {
  const t = T[lang];
  const [mode, setMode] = useState('login'); // login | signup | forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setInfo(''); setBusy(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo(t.checkEmail);
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (error) throw error;
        setInfo(t.resetEmailSent);
      }
    } catch (err) {
      setError(err.message || t.authError);
    } finally {
      setBusy(false);
    }
  }

  const title = mode === 'login' ? t.loginTitle : mode === 'signup' ? t.signupTitle : t.resetPasswordTitle;

  return (
    <div className="fc-authwrap" data-theme={theme}>
      <style>{CSS}</style>
      <form className="fc-modal" style={{ maxWidth: 340 }} onSubmit={handleSubmit}>
        <div className="fc-modal-header">
          <span>{title}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="fc-lang-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button type="button" className="fc-lang-toggle" onClick={() => setLang(lang === 'id' ? 'en' : 'id')}>
              <Globe size={14} /><span className={lang === 'id' ? 'fc-lang-active' : ''}>ID</span><span className="fc-lang-sep">/</span><span className={lang === 'en' ? 'fc-lang-active' : ''}>EN</span>
            </button>
          </div>
        </div>
        <label className="fc-field"><span>{t.email}</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        {mode !== 'forgot' && (
          <PasswordField label={t.password} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        )}
        {mode === 'login' && (
          <button type="button" className="fc-link-btn" onClick={() => { setMode('forgot'); setError(''); setInfo(''); }}>{t.forgotPassword}</button>
        )}
        {error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}
        {info && <div className="fc-field-note" style={{ color: '#7c9a72' }}>{info}</div>}
        <button type="submit" className="fc-btn-primary" disabled={busy} style={{ justifyContent: 'center' }}>
          {mode === 'login' ? t.loginBtn : mode === 'signup' ? t.signupBtn : t.sendResetLink}
        </button>
        {mode === 'forgot' ? (
          <button type="button" className="fc-btn-ghost" onClick={() => { setMode('login'); setError(''); setInfo(''); }}>{t.backToLogin}</button>
        ) : (
          <button type="button" className="fc-btn-ghost" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }}>
            {mode === 'login' ? t.switchToSignup : t.switchToLogin}
          </button>
        )}
      </form>
    </div>
  );
}

function ResetPasswordScreen({ lang, setLang, theme, onDone }) {
  const t = T[lang];
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (password !== confirm) { setError(t.passwordMismatch); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setInfo(t.passwordUpdated);
      setTimeout(onDone, 1200);
    } catch (err) {
      setError(err.message || t.authError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fc-authwrap" data-theme={theme}>
      <style>{CSS}</style>
      <form className="fc-modal" style={{ maxWidth: 340 }} onSubmit={handleSubmit}>
        <div className="fc-modal-header">
          <span>{t.resetPasswordTitle}</span>
          <button type="button" className="fc-lang-toggle" onClick={() => setLang(lang === 'id' ? 'en' : 'id')}>
            <Globe size={14} /><span className={lang === 'id' ? 'fc-lang-active' : ''}>ID</span><span className="fc-lang-sep">/</span><span className={lang === 'en' ? 'fc-lang-active' : ''}>EN</span>
          </button>
        </div>
        <PasswordField label={t.newPassword} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        <PasswordField label={t.confirmPassword} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        {error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}
        {info && <div className="fc-field-note" style={{ color: '#7c9a72' }}>{info}</div>}
        <button type="submit" className="fc-btn-primary" disabled={busy} style={{ justifyContent: 'center' }}>{t.updatePassword}</button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------
   Main Finance App (post-login)
--------------------------------------------------------- */
function FinanceApp({ session, theme, onThemeChange }) {
  const userId = session.user.id;
  const [lang, setLang] = useState('id');
  const [tab, setTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthKey(new Date()));
  const [showTxModal, setShowTxModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [debtPayTargetId, setDebtPayTargetId] = useState(null);

  const t = T[lang];

  useEffect(() => {
    (async () => {
      const [txRes, debtRes, budgetRes, settingsRes] = await Promise.all([
        supabase.from('finance_transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('finance_debts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('finance_budgets').select('*').eq('user_id', userId),
        supabase.from('finance_settings').select('*').eq('user_id', userId).maybeSingle(),
      ]);
      if (txRes.data) setTransactions(txRes.data.map(mapTxRow));
      if (debtRes.data) setDebts(debtRes.data.map(mapDebtRow));
      if (budgetRes.data) {
        const b = {};
        budgetRes.data.forEach(row => { b[row.category] = Number(row.limit_amount); });
        setBudgets(b);
      }
      if (settingsRes.data?.language) setLang(settingsRes.data.language);
      if (settingsRes.data?.theme && settingsRes.data.theme !== theme) onThemeChange(settingsRes.data.theme);
      setLoaded(true);
    })();
  }, [userId]);

  async function changeTheme(newTheme) {
    onThemeChange(newTheme);
    await supabase.from('finance_settings').upsert({ user_id: userId, theme: newTheme }, { onConflict: 'user_id' });
  }

  async function changeLang(newLang) {
    setLang(newLang);
    await supabase.from('finance_settings').upsert({ user_id: userId, language: newLang }, { onConflict: 'user_id' });
  }

  const monthTx = useMemo(() => transactions.filter(tx => tx.date.slice(0, 7) === selectedMonth), [transactions, selectedMonth]);

  const totals = useMemo(() => {
    let income = 0, expense = 0, debtPaid = 0, invested = 0;
    const byCatExpense = {}; const byCatIncome = {};
    monthTx.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') { income += amt; byCatIncome[tx.category] = (byCatIncome[tx.category] || 0) + amt; }
      else if (tx.type === 'expense') { expense += amt; byCatExpense[tx.category] = (byCatExpense[tx.category] || 0) + amt; }
      else if (tx.type === 'debt_payment') { debtPaid += amt; }
      else if (tx.type === 'investment') { invested += amt; }
    });
    const investable = income - expense - debtPaid - invested;
    return { income, expense, debtPaid, invested, investable, byCatExpense, byCatIncome };
  }, [monthTx]);

  const totalDebtRemaining = useMemo(() => debts.reduce((s, d) => s + Number(d.remaining || 0), 0), [debts]);

  const health = useMemo(() => {
    const income = totals.income;
    if (income <= 0) return null;
    const savingsRate = (income - totals.expense - totals.debtPaid) / income;
    const annualIncomeEst = income * 12;
    const debtRatio = annualIncomeEst > 0 ? totalDebtRemaining / annualIncomeEst : 0;
    const discretionary = (totals.byCatExpense.food || 0) + (totals.byCatExpense.entertainment || 0) + (totals.byCatExpense.shopping || 0);
    const discRatio = income > 0 ? discretionary / income : 0;
    const s1 = clamp01(savingsRate / 0.20) * 40;
    const s2 = clamp01(1 - debtRatio / 0.5) * 30;
    const s3 = clamp01(1 - discRatio / 0.5) * 30;
    const score = Math.round(s1 + s2 + s3);
    let label, color;
    if (score >= 80) { label = t.healthy; color = '#7c9a72'; }
    else if (score >= 60) { label = t.fairlyHealthy; color = '#c9a977'; }
    else if (score >= 40) { label = t.needsAttention; color = '#c98f4f'; }
    else { label = t.unhealthy; color = '#b0584f'; }
    return { score, label, color, savingsRate, debtRatio, discRatio };
  }, [totals, totalDebtRemaining, t]);

  async function addTransaction(tx) {
    const { data, error } = await supabase.from('finance_transactions').insert({
      user_id: userId, date: tx.date, type: tx.type, category: tx.category, debt_id: tx.debtId, amount: tx.amount, note: tx.note,
    }).select().single();
    if (error) { console.error(error); return; }
    setTransactions(prev => [mapTxRow(data), ...prev]);
    if (tx.type === 'debt_payment' && tx.debtId) {
      const debt = debts.find(d => d.id === tx.debtId);
      if (debt) {
        const newRemaining = Math.max(0, Number(debt.remaining) - Number(tx.amount));
        const { error: uerr } = await supabase.from('finance_debts').update({ remaining: newRemaining }).eq('id', tx.debtId);
        if (!uerr) setDebts(prev => prev.map(d => d.id === tx.debtId ? { ...d, remaining: newRemaining } : d));
      }
    }
  }
  async function deleteTransaction(id) {
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) setTransactions(prev => prev.filter(tx => tx.id !== id));
  }
  async function addDebt(d) {
    const { data, error } = await supabase.from('finance_debts').insert({
      user_id: userId, name: d.name, total: d.total, remaining: d.remaining, monthly_plan: d.monthlyPlan,
    }).select().single();
    if (!error) setDebts(prev => [...prev, mapDebtRow(data)]);
  }
  async function deleteDebt(id) {
    const { error } = await supabase.from('finance_debts').delete().eq('id', id);
    if (!error) setDebts(prev => prev.filter(d => d.id !== id));
  }
  async function saveBudgets(cleaned) {
    const toUpsert = Object.entries(cleaned).filter(([, v]) => v > 0).map(([category, limit_amount]) => ({ user_id: userId, category, limit_amount }));
    const toDeleteCats = Object.entries(cleaned).filter(([, v]) => v <= 0).map(([category]) => category);
    if (toUpsert.length) await supabase.from('finance_budgets').upsert(toUpsert, { onConflict: 'user_id,category' });
    if (toDeleteCats.length) await supabase.from('finance_budgets').delete().eq('user_id', userId).in('category', toDeleteCats);
    setBudgets(cleaned);
  }

  function shiftMonth(delta) {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setSelectedMonth(monthKey(d));
  }
  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
  }, [selectedMonth, lang]);

  if (!loaded) {
    return (
      <div style={{ background: theme === 'light' ? '#f7f3ea' : '#0d0b09', color: theme === 'light' ? '#8a6a30' : '#c9a977', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Calibri, sans-serif' }}>
        {t.loadingApp}
      </div>
    );
  }

  return (
    <div className="fc-app" data-theme={theme}>
      <style>{CSS}</style>
      <Header t={t} lang={lang} setLang={changeLang} theme={theme} onThemeChange={changeTheme} onLogout={() => supabase.auth.signOut()} />
      <NavTabs t={t} tab={tab} setTab={setTab} />
      <MonthNav monthLabel={monthLabel} shiftMonth={shiftMonth} t={t} />

      <div className="fc-body">
        {tab === 'dashboard' && (
          <Dashboard t={t} totals={totals} health={health} totalDebtRemaining={totalDebtRemaining} lang={lang}
            budgets={budgets} onEditBudget={() => setShowBudgetModal(true)} />
        )}
        {tab === 'transactions' && (
          <Transactions t={t} lang={lang} monthTx={monthTx} debts={debts} onAdd={() => setShowTxModal(true)} onDelete={deleteTransaction} />
        )}
        {tab === 'debts' && (
          <Debts t={t} debts={debts} totalDebtRemaining={totalDebtRemaining}
            onAdd={() => setShowDebtModal(true)} onDelete={deleteDebt}
            onPay={(id) => { setDebtPayTargetId(id); setShowTxModal(true); }} />
        )}
        {tab === 'charts' && <Charts t={t} totals={totals} lang={lang} />}
        {tab === 'review' && (
          <Review t={t} lang={lang} transactions={transactions} monthTx={monthTx} totals={totals} health={health} selectedMonth={selectedMonth} />
        )}
      </div>

      <div className="fc-footer">{t.footerNote}</div>

      {showTxModal && (
        <TxModal t={t} lang={lang} debts={debts} presetDebtId={debtPayTargetId}
          onClose={() => { setShowTxModal(false); setDebtPayTargetId(null); }}
          onSave={(tx) => { addTransaction(tx); setShowTxModal(false); setDebtPayTargetId(null); }} />
      )}
      {showDebtModal && (
        <DebtModal t={t} onClose={() => setShowDebtModal(false)} onSave={(d) => { addDebt(d); setShowDebtModal(false); }} />
      )}
      {showBudgetModal && (
        <BudgetModal t={t} budgets={budgets} onClose={() => setShowBudgetModal(false)} onSave={(b) => { saveBudgets(b); setShowBudgetModal(false); }} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Sub-components (unchanged from artifact version)
--------------------------------------------------------- */
function Header({ t, lang, setLang, theme, onThemeChange, onLogout }) {
  return (
    <div className="fc-header">
      <div className="fc-brand">
        <img src={REVELECT_LOGO} alt="Revelect" className="fc-logo" />
        <div><div className="fc-title">{t.appName}</div></div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="fc-lang-toggle" onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <button className="fc-lang-toggle" onClick={() => setLang(lang === 'id' ? 'en' : 'id')}>
          <Globe size={14} /><span className={lang === 'id' ? 'fc-lang-active' : ''}>ID</span><span className="fc-lang-sep">/</span><span className={lang === 'en' ? 'fc-lang-active' : ''}>EN</span>
        </button>
        <button className="fc-icon-btn" title={t.logout} onClick={onLogout}><LogOut size={16} /></button>
      </div>
    </div>
  );
}

function NavTabs({ t, tab, setTab }) {
  const items = [
    { key: 'dashboard', icon: LayoutDashboard }, { key: 'transactions', icon: TableIcon },
    { key: 'debts', icon: CreditCard }, { key: 'charts', icon: PieIcon }, { key: 'review', icon: ClipboardList },
  ];
  return (
    <div className="fc-tabs">
      {items.map(({ key, icon: Icon }) => (
        <button key={key} className={`fc-tab ${tab === key ? 'fc-tab-active' : ''}`} onClick={() => setTab(key)}>
          <Icon size={15} /><span>{t.tabs[key]}</span>
        </button>
      ))}
    </div>
  );
}

function MonthNav({ monthLabel, shiftMonth, t }) {
  return (
    <div className="fc-monthnav">
      <button onClick={() => shiftMonth(-1)} title={t.monthNav.prev}><ChevronLeft size={16} /></button>
      <span className="fc-monthlabel">{monthLabel}</span>
      <button onClick={() => shiftMonth(1)} title={t.monthNav.next}><ChevronRight size={16} /></button>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="fc-card fc-stat">
      <div className="fc-stat-icon" style={{ color: accent || '#c9a977' }}><Icon size={18} /></div>
      <div><div className="fc-stat-label">{label}</div><div className="fc-stat-value">{value}</div></div>
    </div>
  );
}

function HealthGauge({ health, t }) {
  if (!health) return <div className="fc-card fc-gauge-card"><div className="fc-gauge-empty">{t.noData}</div></div>;
  const { score, label, color } = health;
  const r = 54, circumference = 2 * Math.PI * r, arcFraction = 0.75;
  const totalArc = circumference * arcFraction;
  const filled = totalArc * (score / 100);
  return (
    <div className="fc-card fc-gauge-card">
      <div className="fc-gauge-wrap">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <g transform="rotate(135 80 80)">
            <circle cx="80" cy="80" r={r} fill="none" stroke="var(--fc-border)" strokeWidth="10" strokeDasharray={`${totalArc} ${circumference}`} strokeLinecap="round" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round" />
          </g>
          <text x="80" y="76" textAnchor="middle" fontSize="30" fontFamily="Calibri" fill="var(--fc-text)" fontWeight="600">{score}</text>
          <text x="80" y="98" textAnchor="middle" fontSize="10" fontFamily="Calibri" fill="var(--fc-text-dim)">/ 100</text>
        </svg>
      </div>
      <div className="fc-gauge-label" style={{ color }}>{label}</div>
      <div className="fc-gauge-title">{t.healthScore}</div>
      <div className="fc-gauge-explain">{t.scoreExplain}</div>
    </div>
  );
}

function Dashboard({ t, totals, health, totalDebtRemaining, lang, budgets, onEditBudget }) {
  const pieData = Object.entries(totals.byCatExpense).map(([k, v]) => ({ name: t.categories[k] || k, value: v, key: k }));
  const activeBudgets = EXPENSE_CATS.filter(c => Number(budgets[c]) > 0);
  const overBudgetCats = activeBudgets.filter(c => (totals.byCatExpense[c] || 0) > Number(budgets[c]));

  return (
    <div className="fc-dashboard">
      {overBudgetCats.length > 0 && (
        <div className="fc-alert-banner">
          <AlertCircle size={16} />
          <span><b>{t.budgetAlertTitle}:</b> {overBudgetCats.length} {t.budgetAlertBody} — {overBudgetCats.map(c => t.categories[c]).join(', ')}</span>
        </div>
      )}
      <div className="fc-grid-2">
        <HealthGauge health={health} t={t} />
        <div className="fc-stat-grid">
          <StatCard label={t.totalIncome} value={fmtIDR(totals.income)} icon={TrendingUp} accent="#7c9a72" />
          <StatCard label={t.totalExpense} value={fmtIDR(totals.expense)} icon={TrendingDown} accent="#b0584f" />
          <StatCard label={t.totalDebtPaid} value={fmtIDR(totals.debtPaid)} icon={CreditCard} accent="#c98f4f" />
          <StatCard label={t.totalInvested} value={fmtIDR(totals.invested)} icon={PiggyBank} accent="#4f8a8b" />
          <StatCard label={t.investable} value={fmtIDR(totals.investable)} icon={Wallet} accent="#c9a977" />
          <StatCard label={t.totalDebtRemaining} value={fmtIDR(totalDebtRemaining)} icon={AlertCircle} accent="#b0584f" />
        </div>
      </div>

      <div className="fc-card">
        <div className="fc-card-header">
          <div className="fc-card-title">{t.budget}</div>
          <button className="fc-btn-ghost" onClick={onEditBudget}>{t.setBudget}</button>
        </div>
        {activeBudgets.length === 0 ? <div className="fc-empty">{t.noBudgetSet}</div> : (
          <div className="fc-debt-list">
            {activeBudgets.sort((a, b) => (totals.byCatExpense[b] || 0) / budgets[b] - (totals.byCatExpense[a] || 0) / budgets[a]).map(c => {
              const spent = totals.byCatExpense[c] || 0;
              const limit = Number(budgets[c]);
              const pct = Math.min(100, (spent / limit) * 100);
              const over = spent > limit; const near = !over && pct >= 80;
              const barColor = over ? '#b0584f' : near ? '#c98f4f' : '#7c9a72';
              return (
                <div key={c} className="fc-debt-item">
                  <div className="fc-debt-top">
                    <div className="fc-debt-name">{t.categories[c]}</div>
                    <span className="fc-budget-status" style={{ color: barColor }}>{over ? t.overBudget : near ? t.nearBudget : t.onTrack}</span>
                  </div>
                  <div className="fc-debt-bar-wrap"><div className="fc-debt-bar" style={{ width: `${pct}%`, background: barColor }} /></div>
                  <div className="fc-debt-meta"><span>{fmtIDR(spent)} {t.of} {fmtIDR(limit)}</span><span>{pct.toFixed(0)}%</span></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fc-card">
        <div className="fc-card-title">{t.breakdown}</div>
        {pieData.length === 0 ? <div className="fc-empty">{t.noData}</div> : (
          <div className="fc-pie-row">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {pieData.map((entry) => <Cell key={entry.key} fill={CAT_COLORS[entry.key] || '#786b5a'} stroke="var(--fc-bg)" strokeWidth={1} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: 'var(--fc-surface)', border: '1px solid var(--fc-border)', borderRadius: 8, color: 'var(--fc-text)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="fc-legend">
              {pieData.sort((a, b) => b.value - a.value).map(entry => (
                <div key={entry.key} className="fc-legend-item">
                  <span className="fc-legend-dot" style={{ background: CAT_COLORS[entry.key] || '#786b5a' }} />
                  <span className="fc-legend-name">{entry.name}</span>
                  <span className="fc-legend-value">{fmtIDR(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Transactions({ t, lang, monthTx, debts, onAdd, onDelete }) {
  const sorted = [...monthTx].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="fc-card">
      <div className="fc-card-header">
        <div className="fc-card-title">{t.tabs.transactions}</div>
        <button className="fc-btn-primary" onClick={onAdd}><Plus size={15} /> {t.addTransaction}</button>
      </div>
      {sorted.length === 0 ? <div className="fc-empty">{t.noTx}</div> : (
        <div className="fc-table-wrap">
          <table className="fc-table">
            <thead><tr><th>{t.date}</th><th>{t.type}</th><th>{t.category}</th><th>{t.note}</th><th style={{ textAlign: 'right' }}>{t.amount}</th><th></th></tr></thead>
            <tbody>
              {sorted.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td><span className={`fc-pill fc-pill-${tx.type}`}>{t[toCamel(tx.type)] || tx.type}</span></td>
                  <td>{tx.type === 'debt_payment' ? (debts.find(d => d.id === tx.debtId)?.name || '-') : (t.categories[tx.category] || tx.category || '-')}</td>
                  <td className="fc-note">{tx.note || '-'}</td>
                  <td style={{ textAlign: 'right', color: tx.type === 'income' ? '#7c9a72' : 'var(--fc-text)' }}>{tx.type === 'income' ? '+' : '-'}{fmtIDR(tx.amount)}</td>
                  <td><button className="fc-icon-btn" onClick={() => onDelete(tx.id)}><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Debts({ t, debts, totalDebtRemaining, onAdd, onDelete, onPay }) {
  return (
    <div className="fc-card">
      <div className="fc-card-header">
        <div className="fc-card-title">{t.tabs.debts} — {fmtIDR(totalDebtRemaining)}</div>
        <button className="fc-btn-primary" onClick={onAdd}><Plus size={15} /> {t.addDebt}</button>
      </div>
      {debts.length === 0 ? <div className="fc-empty">{t.noDebts}</div> : (
        <div className="fc-debt-list">
          {debts.map(d => {
            const total = Number(d.total) || 1; const remaining = Number(d.remaining) || 0;
            const pct = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
            return (
              <div key={d.id} className="fc-debt-item">
                <div className="fc-debt-top">
                  <div className="fc-debt-name">{d.name}</div>
                  <div className="fc-debt-actions">
                    <button className="fc-btn-ghost" onClick={() => onPay(d.id)}>{t.debtPayment}</button>
                    <button className="fc-icon-btn" onClick={() => onDelete(d.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="fc-debt-bar-wrap"><div className="fc-debt-bar" style={{ width: `${pct}%` }} /></div>
                <div className="fc-debt-meta">
                  <span>{t.remaining}: <b>{fmtIDR(remaining)}</b> {t.of} {fmtIDR(total)}</span>
                  {d.monthlyPlan ? <span>{t.monthlyPlan}: {fmtIDR(d.monthlyPlan)}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Charts({ t, totals, lang }) {
  const expenseData = Object.entries(totals.byCatExpense).map(([k, v]) => ({ name: t.categories[k] || k, value: v, key: k }));
  const barData = expenseData.sort((a, b) => b.value - a.value);
  return (
    <div className="fc-charts-grid">
      <div className="fc-card">
        <div className="fc-card-title">{t.breakdown} — {t.expense}</div>
        {expenseData.length === 0 ? <div className="fc-empty">{t.noData}</div> : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {expenseData.map(entry => <Cell key={entry.key} fill={CAT_COLORS[entry.key] || '#786b5a'} stroke="var(--fc-bg)" strokeWidth={1} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: 'var(--fc-surface)', border: '1px solid var(--fc-border)', borderRadius: 8, color: 'var(--fc-text)' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="fc-card">
        <div className="fc-card-title">{t.breakdown} — {t.expense} ({t.amount})</div>
        {barData.length === 0 ? <div className="fc-empty">{t.noData}</div> : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--fc-border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--fc-text-dim)', fontSize: 11 }} tickFormatter={(v) => fmtIDR(v)} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--fc-text)', fontSize: 12 }} width={90} />
              <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: 'var(--fc-surface)', border: '1px solid var(--fc-border)', borderRadius: 8, color: 'var(--fc-text)' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map(entry => <Cell key={entry.key} fill={CAT_COLORS[entry.key] || '#786b5a'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function Review({ t, lang, transactions, monthTx, totals, health, selectedMonth }) {
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 6);
  const prevWeekStart = new Date(now); prevWeekStart.setDate(now.getDate() - 13);
  const prevWeekEnd = new Date(now); prevWeekEnd.setDate(now.getDate() - 7);
  const inRange = (dateStr, start, end) => { const d = new Date(dateStr); return d >= new Date(start.toDateString()) && d <= new Date(end.toDateString()); };

  const thisWeekTx = transactions.filter(tx => tx.type === 'expense' && inRange(tx.date, weekAgo, now));
  const prevWeekTx = transactions.filter(tx => tx.type === 'expense' && inRange(tx.date, prevWeekStart, prevWeekEnd));
  const thisWeekTotal = thisWeekTx.reduce((s, tx) => s + Number(tx.amount), 0);
  const prevWeekTotal = prevWeekTx.reduce((s, tx) => s + Number(tx.amount), 0);
  const weekDelta = prevWeekTotal > 0 ? ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : null;

  const weekByCat = {};
  thisWeekTx.forEach(tx => { weekByCat[tx.category] = (weekByCat[tx.category] || 0) + Number(tx.amount); });
  const topCatEntry = Object.entries(weekByCat).sort((a, b) => b[1] - a[1])[0];

  const tips = [];
  if (health) {
    if (health.savingsRate < 0.10) tips.push(lang === 'id' ? 'Tingkat tabungan kamu di bawah 10%. Coba cari 1-2 pos pengeluaran yang bisa dipotong bulan depan.' : 'Your savings rate is below 10%. Try trimming 1-2 spending categories next month.');
    if (health.discRatio > 0.35) tips.push(lang === 'id' ? `Pengeluaran konsumtif (makan/hiburan/belanja) makan ${(health.discRatio * 100).toFixed(0)}% dari pemasukan. Ini area paling gampang dikontrol.` : `Discretionary spend (food/entertainment/shopping) is eating ${(health.discRatio * 100).toFixed(0)}% of income. This is the easiest lever to pull.`);
    if (health.debtRatio > 0.3) tips.push(lang === 'id' ? 'Rasio hutang terhadap estimasi pendapatan tahunan cukup tinggi. Prioritaskan pelunasan sebelum menambah investasi baru.' : 'Debt relative to estimated annual income is high. Prioritize payoff before adding new investments.');
    if (totals.investable > 0 && totals.invested === 0) tips.push(lang === 'id' ? `Ada sisa ${fmtIDR(totals.investable)} yang belum dialokasikan. Uang nganggur = kehilangan compounding.` : `There's ${fmtIDR(totals.investable)} left unallocated. Idle cash means lost compounding.`);
    if (tips.length === 0) tips.push(lang === 'id' ? 'Bulan ini solid. Pertahankan ritme, jangan longgarkan disiplin pas lagi enak.' : 'This month is solid. Keep the rhythm — don\'t loosen discipline just because it feels good.');
  }

  return (
    <div className="fc-review">
      <div className="fc-card">
        <div className="fc-card-title">{t.weeklyReview} · {t.thisWeek}</div>
        <div className="fc-week-row">
          <div><div className="fc-stat-label">{t.spent}</div><div className="fc-stat-value" style={{ fontSize: 22 }}>{fmtIDR(thisWeekTotal)}</div></div>
          {weekDelta !== null && (
            <div className={`fc-delta ${weekDelta > 0 ? 'fc-delta-up' : 'fc-delta-down'}`}>
              {weekDelta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{Math.abs(weekDelta).toFixed(0)}% {t.vsLastWeek}
            </div>
          )}
          {topCatEntry && (
            <div><div className="fc-stat-label">{t.topCategory}</div><div className="fc-stat-value" style={{ fontSize: 16 }}>{t.categories[topCatEntry[0]] || topCatEntry[0]} — {fmtIDR(topCatEntry[1])}</div></div>
          )}
        </div>
      </div>
      <div className="fc-card">
        <div className="fc-card-title">{t.monthlyReview}</div>
        {!health ? <div className="fc-empty">{t.emptyReview}</div> : (
          <>
            <div className="fc-metric-row">
              <MetricBar label={t.savingsRate} value={health.savingsRate} />
              <MetricBar label={t.debtRatio} value={health.debtRatio} invert />
              <MetricBar label={t.discRatio} value={health.discRatio} invert />
            </div>
            <div className="fc-tips">
              <div className="fc-card-subtitle">{t.tips}</div>
              {tips.map((tip, i) => (
                <div key={i} className="fc-tip-item">
                  {tips.length === 1 ? <CheckCircle2 size={15} color="#7c9a72" /> : <AlertCircle size={15} color="#c9a977" />}
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricBar({ label, value, invert }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  const good = invert ? value < 0.3 : value > 0.15;
  const color = good ? '#7c9a72' : (invert ? (value < 0.5 ? '#c9a977' : '#b0584f') : (value > 0.05 ? '#c9a977' : '#b0584f'));
  return (
    <div className="fc-metricbar">
      <div className="fc-metricbar-label"><span>{label}</span><span>{(value * 100).toFixed(1)}%</span></div>
      <div className="fc-metricbar-track"><div className="fc-metricbar-fill" style={{ width: `${Math.min(100, Math.abs(pct))}%`, background: color }} /></div>
    </div>
  );
}

/* ---------------------------------------------------------
   Modals
--------------------------------------------------------- */
function TxModal({ t, lang, debts, presetDebtId, onClose, onSave }) {
  const [type, setType] = useState(presetDebtId ? 'debt_payment' : 'expense');
  const [category, setCategory] = useState(EXPENSE_CATS[0]);
  const [debtId, setDebtId] = useState(presetDebtId || (debts[0]?.id || ''));
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const catOptions = type === 'income' ? INCOME_CATS : type === 'investment' ? INVESTMENT_CATS : EXPENSE_CATS;

  useEffect(() => {
    const opts = type === 'income' ? INCOME_CATS : type === 'investment' ? INVESTMENT_CATS : EXPENSE_CATS;
    setCategory(opts[0]);
  }, [type]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (type === 'debt_payment' && !debtId) return;
    onSave({ type, date, amount: Number(amount), note, category: type === 'debt_payment' ? null : category, debtId: type === 'debt_payment' ? debtId : null });
  }

  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{t.addTransaction}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="fc-type-toggle">
          {['income', 'expense', 'debt_payment', 'investment'].map(ty => (
            <button type="button" key={ty} className={`fc-type-btn ${type === ty ? 'fc-type-btn-active' : ''}`} onClick={() => setType(ty)}>{t[toCamel(ty)]}</button>
          ))}
        </div>
        <label className="fc-field"><span>{t.date}</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        {type === 'debt_payment' ? (
          debts.length === 0 ? <div className="fc-field-note">{t.noDebts}</div> : (
            <label className="fc-field"><span>{t.selectDebt}</span>
              <select value={debtId} onChange={(e) => setDebtId(e.target.value)} required>
                {debts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>
          )
        ) : (
          <label className="fc-field"><span>{t.category}</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {catOptions.map(c => <option key={c} value={c}>{t.categories[c] || c}</option>)}
            </select>
          </label>
        )}
        <label className="fc-field"><span>{t.amount} (IDR)</span><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required /></label>
        <label className="fc-field"><span>{t.note}</span><input type="text" value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <div className="fc-modal-actions">
          <button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button type="submit" className="fc-btn-primary">{t.save}</button>
        </div>
      </form>
    </div>
  );
}

function DebtModal({ t, onClose, onSave }) {
  const [name, setName] = useState(''); const [total, setTotal] = useState('');
  const [remaining, setRemaining] = useState(''); const [monthlyPlan, setMonthlyPlan] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !total) return;
    onSave({ name, total: Number(total), remaining: Number(remaining || total), monthlyPlan: monthlyPlan ? Number(monthlyPlan) : null });
  }
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{t.addDebt}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <label className="fc-field"><span>{t.debtName}</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label className="fc-field"><span>{t.totalDebt} (IDR)</span><input type="number" min="1" value={total} onChange={(e) => setTotal(e.target.value)} required /></label>
        <label className="fc-field"><span>{t.remaining} (IDR)</span><input type="number" min="0" value={remaining} onChange={(e) => setRemaining(e.target.value)} placeholder={total || '0'} /></label>
        <label className="fc-field"><span>{t.monthlyPlan} (IDR)</span><input type="number" min="0" value={monthlyPlan} onChange={(e) => setMonthlyPlan(e.target.value)} /></label>
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button><button type="submit" className="fc-btn-primary">{t.save}</button></div>
      </form>
    </div>
  );
}

function BudgetModal({ t, budgets, onClose, onSave }) {
  const [local, setLocal] = useState(() => { const init = {}; EXPENSE_CATS.forEach(c => { init[c] = budgets[c] || ''; }); return init; });
  function handleSubmit(e) {
    e.preventDefault();
    const cleaned = {}; EXPENSE_CATS.forEach(c => { cleaned[c] = Number(local[c]) || 0; });
    onSave(cleaned);
  }
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{t.setBudget}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="fc-field-note">{t.noLimit}</div>
        {EXPENSE_CATS.map(c => (
          <label className="fc-field" key={c}><span>{t.categories[c]}</span>
            <input type="number" min="0" placeholder="0" value={local[c]} onChange={(e) => setLocal(prev => ({ ...prev, [c]: e.target.value }))} />
          </label>
        ))}
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button><button type="submit" className="fc-btn-primary">{t.save}</button></div>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------
   Styles
--------------------------------------------------------- */
const CSS = `
.fc-app, .fc-authwrap {
  --fc-gold: #c9a977;
}
.fc-app[data-theme="dark"], .fc-authwrap[data-theme="dark"] {
  --fc-bg: #0d0b09; --fc-surface: #17130f; --fc-surface2: #1f1a15; --fc-border: #2a231c;
  --fc-text: #f0ece4; --fc-text-dim: #9b9186; --fc-gold-bright: #e0c396;
}
.fc-app[data-theme="light"], .fc-authwrap[data-theme="light"] {
  --fc-bg: #f7f3ea; --fc-surface: #ffffff; --fc-surface2: #f1ebdc; --fc-border: #e2d8c3;
  --fc-text: #2b2418; --fc-text-dim: #78705f; --fc-gold-bright: #8a6a30;
}

* { box-sizing: border-box; }
.fc-app { background: var(--fc-bg); color: var(--fc-text); font-family: 'Calibri','Segoe UI',sans-serif; min-height: 100vh; }
.fc-authwrap { background: var(--fc-bg); min-height: 100vh; display:flex; align-items:center; justify-content:center; padding: 16px; font-family: 'Calibri','Segoe UI',sans-serif; }
.fc-header { display:flex; align-items:center; justify-content:space-between; padding: 20px 22px 16px; border-bottom: 1px solid var(--fc-border); }
.fc-brand { display:flex; align-items:center; gap: 12px; }
.fc-logo { height: 28px; width: auto; display:block; }
.fc-title { font-size: 22px; letter-spacing: 2px; color: var(--fc-gold-bright); text-transform: uppercase; line-height:1.1; }
.fc-lang-toggle { display:flex; align-items:center; gap:6px; background: var(--fc-surface); border: 1px solid var(--fc-border); color: var(--fc-text-dim); padding: 7px 12px; border-radius: 20px; font-size: 12px; cursor:pointer; letter-spacing:0.5px; }
.fc-lang-active { color: #c9a977; font-weight: 700; }
.fc-lang-sep { opacity: 0.4; }
.fc-tabs { display:flex; gap: 4px; padding: 10px 22px 0; overflow-x:auto; border-bottom: 1px solid var(--fc-border); }
.fc-tab { display:flex; align-items:center; gap:6px; background:none; border:none; color:var(--fc-text-dim); padding: 9px 14px; font-size: 13px; cursor:pointer; border-bottom: 2px solid transparent; white-space:nowrap; }
.fc-tab-active { color: #c9a977; border-bottom: 2px solid #c9a977; }
.fc-monthnav { display:flex; align-items:center; justify-content:center; gap: 16px; padding: 14px; }
.fc-monthnav button { background: var(--fc-surface); border:1px solid var(--fc-border); color:#c9a977; border-radius:6px; padding:5px 8px; cursor:pointer; display:flex; }
.fc-monthlabel { font-size: 17px; letter-spacing: 1px; color: var(--fc-text); min-width: 160px; text-align:center; }
.fc-body { padding: 4px 22px 20px; max-width: 1000px; margin: 0 auto; }
.fc-footer { text-align:center; font-size: 10.5px; color: var(--fc-text-dim); padding: 10px 0 18px; letter-spacing:0.4px; }
.fc-card { background: var(--fc-surface); border: 1px solid var(--fc-border); border-radius: 12px; padding: 18px; margin-bottom: 16px; }
.fc-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 14px; flex-wrap:wrap; gap:10px; }
.fc-card-title { font-size: 17px; letter-spacing: 0.5px; color: var(--fc-text); }
.fc-card-subtitle { font-size: 12px; text-transform:uppercase; letter-spacing:1px; color:var(--fc-text-dim); margin: 12px 0 8px; }
.fc-empty { color: var(--fc-text-dim); font-size: 13px; padding: 24px 0; text-align:center; }
.fc-grid-2 { display:grid; grid-template-columns: 220px 1fr; gap: 16px; margin-bottom: 16px; }
@media (max-width: 640px) { .fc-grid-2 { grid-template-columns: 1fr; } }
.fc-gauge-card { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
.fc-gauge-wrap { margin-bottom: 4px; }
.fc-gauge-label { font-size: 14px; font-weight:700; letter-spacing:0.5px; }
.fc-gauge-title { font-size: 11px; color: var(--fc-text-dim); margin-top:6px; text-transform:uppercase; letter-spacing:0.6px; }
.fc-gauge-explain { font-size: 10.5px; color: var(--fc-text-dim); margin-top:8px; line-height:1.4; }
.fc-gauge-empty { color: var(--fc-text-dim); font-size:13px; }
.fc-stat-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.fc-stat { display:flex; align-items:center; gap: 10px; padding: 12px 14px; margin-bottom:0; }
.fc-stat-icon { flex-shrink:0; }
.fc-stat-label { font-size: 10.5px; color: var(--fc-text-dim); text-transform:uppercase; letter-spacing:0.5px; }
.fc-stat-value { font-family: ui-monospace, monospace; font-size: 15px; color: var(--fc-text); margin-top:2px; font-weight:600; }
.fc-pie-row { display:grid; grid-template-columns: 1fr 220px; gap: 16px; align-items:center; }
@media (max-width: 640px) { .fc-pie-row { grid-template-columns: 1fr; } }
.fc-legend { display:flex; flex-direction:column; gap:8px; }
.fc-legend-item { display:flex; align-items:center; gap:8px; font-size: 12.5px; }
.fc-legend-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.fc-legend-name { flex:1; color: var(--fc-text); }
.fc-legend-value { font-family: ui-monospace, monospace; color: var(--fc-text-dim); }
.fc-charts-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 780px) { .fc-charts-grid { grid-template-columns: 1fr; } }
.fc-btn-primary { display:flex; align-items:center; gap:6px; background: #c9a977; color: #14100c; border:none; padding: 9px 14px; border-radius: 8px; font-size: 13px; font-weight:700; cursor:pointer; }
.fc-btn-ghost { background: none; border: 1px solid var(--fc-border); color: var(--fc-text-dim); padding: 7px 12px; border-radius: 8px; font-size: 12.5px; cursor:pointer; }
.fc-icon-btn { background:none; border:none; color: var(--fc-text-dim); cursor:pointer; padding: 4px; display:flex; }
.fc-icon-btn:hover { color: #b0584f; }
.fc-table-wrap { overflow-x:auto; }
.fc-table { width:100%; border-collapse: collapse; font-size: 13px; }
.fc-table th { text-align:left; color: var(--fc-text-dim); font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; padding: 8px 10px; border-bottom: 1px solid var(--fc-border); }
.fc-table td { padding: 10px; border-bottom: 1px solid var(--fc-border); color: var(--fc-text); }
.fc-note { color: var(--fc-text-dim); max-width: 160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fc-pill { font-size: 10.5px; padding: 3px 8px; border-radius: 20px; text-transform:uppercase; letter-spacing:0.4px; }
.fc-pill-income { background: rgba(124,154,114,0.15); color:#7c9a72; }
.fc-pill-expense { background: rgba(176,88,79,0.15); color:#c98f7a; }
.fc-pill-debt_payment { background: rgba(201,143,79,0.15); color:#c98f4f; }
.fc-pill-investment { background: rgba(79,138,139,0.15); color:#6fb0b1; }
.fc-debt-list { display:flex; flex-direction:column; gap: 14px; }
.fc-debt-item { border: 1px solid var(--fc-border); border-radius: 10px; padding: 14px; }
.fc-debt-top { display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px; }
.fc-debt-name { font-weight:600; font-size:14px; }
.fc-debt-actions { display:flex; gap:8px; align-items:center; }
.fc-debt-bar-wrap { height: 6px; background: var(--fc-surface2); border-radius: 4px; overflow:hidden; margin-bottom: 8px; }
.fc-debt-bar { height:100%; background: linear-gradient(90deg, #c9a977, #4f8a8b); }
.fc-debt-meta { display:flex; justify-content:space-between; font-size: 12px; color: var(--fc-text-dim); flex-wrap:wrap; gap:6px; }
.fc-alert-banner { display:flex; align-items:center; gap: 10px; background: rgba(176,88,79,0.12); border: 1px solid rgba(176,88,79,0.35); color: #d99a91; padding: 12px 14px; border-radius: 10px; font-size: 12.5px; margin-bottom: 16px; line-height:1.5; }
.fc-budget-status { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.fc-review { display:flex; flex-direction:column; }
.fc-week-row { display:flex; gap: 24px; flex-wrap:wrap; align-items:center; }
.fc-delta { display:flex; align-items:center; gap:5px; font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--fc-surface2); }
.fc-delta-up { color: #b0584f; }
.fc-delta-down { color: #7c9a72; }
.fc-metric-row { display:flex; flex-direction:column; gap: 12px; margin-bottom: 6px; }
.fc-metricbar-label { display:flex; justify-content:space-between; font-size: 12px; color: var(--fc-text-dim); margin-bottom:4px; }
.fc-metricbar-track { height: 6px; background: var(--fc-surface2); border-radius:4px; overflow:hidden; }
.fc-metricbar-fill { height:100%; }
.fc-tips { display:flex; flex-direction:column; gap: 8px; }
.fc-tip-item { display:flex; gap:8px; align-items:flex-start; font-size: 13px; line-height:1.5; color: var(--fc-text); background: var(--fc-surface2); padding: 10px 12px; border-radius: 8px; }
.fc-modal-backdrop { position:fixed; inset:0; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index: 50; padding: 16px; }
.fc-modal { background: var(--fc-surface); border: 1px solid var(--fc-border); border-radius: 14px; padding: 20px; width: 100%; max-width: 380px; display:flex; flex-direction:column; gap: 12px; max-height: 90vh; overflow-y:auto; }
.fc-modal-header { display:flex; align-items:center; justify-content:space-between; font-size: 18px; color: var(--fc-gold-bright); letter-spacing:0.5px; }
.fc-type-toggle { display:grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.fc-type-btn { background: var(--fc-surface2); border: 1px solid var(--fc-border); color: var(--fc-text-dim); padding: 8px 6px; border-radius: 8px; font-size: 12px; cursor:pointer; }
.fc-type-btn-active { border-color: #c9a977; color: #c9a977; background: rgba(201,169,119,0.08); }
.fc-field { display:flex; flex-direction:column; gap: 5px; font-size: 12px; color: var(--fc-text-dim); }
.fc-field input, .fc-field select { background: var(--fc-surface2); border: 1px solid var(--fc-border); color: var(--fc-text); padding: 9px 10px; border-radius: 8px; font-size: 14px; font-family: 'Calibri','Segoe UI',sans-serif; }
.fc-field input:focus, .fc-field select:focus { outline: 1.5px solid #c9a977; }
.fc-field-note { font-size: 12px; color: var(--fc-text-dim); }
.fc-password-wrap { position: relative; display:flex; align-items:center; }
.fc-password-wrap input { width: 100%; padding-right: 38px; }
.fc-password-eye { position: absolute; right: 8px; background: none; border: none; color: var(--fc-text-dim); cursor: pointer; display:flex; padding: 4px; }
.fc-password-eye:hover { color: #c9a977; }
.fc-link-btn { background: none; border: none; color: #c9a977; font-size: 12px; text-align: left; cursor: pointer; padding: 0; margin-top: -4px; text-decoration: underline; text-underline-offset: 2px; }
.fc-modal-actions { display:flex; justify-content:flex-end; gap: 8px; margin-top: 6px; }
`;
