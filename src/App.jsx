import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, PieChart as PieIcon, Table as TableIcon, Globe, X, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, AlertCircle, CheckCircle2, LogOut, Eye, EyeOff, Sun, Moon, Pencil, Sparkles, Share2, FileText, Download, Utensils, Home, Car, Film, Receipt, HeartPulse, Dumbbell, ShoppingBag, MoreHorizontal, Banknote, Laptop, Video, Landmark, Repeat, Mail, Mic } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from './supabaseClient';

const REVELECT_LOGO = "data:image/png;base64,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";

/* ---------------------------------------------------------
   i18n
--------------------------------------------------------- */
const T = {
  id: {
    appName: 'Finance Tracker',
    tabs: { dashboard: 'Ringkasan', transactions: 'Transaksi', debts: 'Hutang', charts: 'Analisis', review: 'Review', report: 'Laporan' },
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
    editTransaction: 'Edit Transaksi', editDebt: 'Edit Hutang',
    setInvestPlan: 'Atur Rencana Investasi', investPlanLabel: 'Target Investasi per Bulan',
    investPlan: 'Rencana Investasi', investRealized: 'Realisasi',
    quickAdd: 'Tambah Cepat (AI)', quickAddDesc: 'Paste notif SMS/email transaksi bank atau e-wallet (BCA, Mandiri, GoPay, dll), AI bakal baca otomatis.',
    pasteNotifPlaceholder: 'Contoh: BCA Debit Rp150.000 di INDOMARET pada 28/07...',
    parseBtn: 'Baca Otomatis', parsing: 'Membaca...', parseNotTx: 'Ga kebaca sebagai transaksi. Coba tambah manual atau cek teksnya.',
    parseFailed: 'Gagal memproses, coba lagi.', reviewBeforeSave: 'Dicek dulu ya sebelum simpan.',
    uploadScreenshot: 'Upload/Paste Screenshot Notif', orPasteText: 'atau paste teksnya di bawah',
    splitBill: 'Split Bill (AI)', splitBillDesc: 'Upload foto bon/struk. Bisa sebutin item mana yang punya kamu (pajak/service dihitung proporsional), atau tinggal bilang "bagi 2/3/4" buat dibagi rata.',
    myItemsLabel: 'Item kamu, atau bilang "bagi rata"', myItemsPlaceholder: 'Contoh: "nasi goreng sama es teh" ATAU "bagi 2"',
    splitCountLabel: 'Dibagi rata', people: 'orang',
    splitBtn: 'Hitung Bagian Saya', splitNotReceipt: 'Ga kebaca sebagai bon/struk. Coba foto yang lebih jelas.',
    splitItemsNotFound: 'Item yang kamu sebut ga ketemu di bon-nya. Coba tulis ulang lebih spesifik.',
    uploadReceiptRequired: 'Upload foto bon dulu ya.',
    splitResultTitle: 'Rincian Bagian Kamu', splitMySubtotal: 'Subtotal item kamu', splitBillSubtotal: 'Subtotal bon',
    splitBillTotal: 'Total bon (stlh pajak/service)', splitMultiplier: 'Pengali', splitYourShare: 'Bagian Kamu',
    splitScreenshotHint: 'Screenshot layar ini buat kirim ke temen, atau langsung masukin ke tracker.',
    back: 'Kembali', addToTracker: 'Masukin ke Tracker',
    shareImage: 'Simpan / Bagikan Gambar',
    monthlyReportTitle: 'Laporan Bulanan', downloadPdf: 'Download PDF', month: 'Bulan', net: 'Net',
    noReportData: 'Belum ada data transaksi buat dibikin laporan.',
    trialExpiredTitle: 'Trial Kamu Udah Habis', trialExpiredBody: 'Masa coba gratis 30 hari kamu udah berakhir. Hubungi Vaza buat lanjut akses.',
    trialDaysLeft: 'hari trial tersisa', trialLastDay: 'Hari terakhir trial',
    accounts: 'Saldo Akun', manageAccounts: 'Kelola Akun', addAccount: 'Tambah Akun', editAccount: 'Edit Akun',
    accountName: 'Nama Akun', accountType: 'Jenis Akun', accountBalance: 'Saldo', totalNetWorth: 'Total Saldo Semua Akun',
    noAccounts: 'Belum ada akun tercatat. Tambahin biar bisa lacak saldo kamu.', account: 'Akun', noAccount: 'Tanpa akun',
    accTypeBank: 'Bank', accTypeEwallet: 'E-Wallet', accTypeCash: 'Tunai', accTypeOther: 'Lainnya',
    recurring: 'Transaksi Berulang', manageRecurring: 'Kelola Berulang', addRecurring: 'Tambah Berulang', editRecurring: 'Edit Berulang',
    dayOfMonth: 'Tanggal per Bulan', nextDue: 'Jatuh Tempo Berikutnya', active: 'Aktif', inactive: 'Nonaktif',
    noRecurring: 'Belum ada transaksi berulang. Tambahin buat kost, langganan, dll biar ga perlu input manual tiap bulan.',
    recurringAutoNote: 'Transaksi berulang dicek otomatis tiap kali kamu buka app, dan langsung dicatat kalau udah jatuh tempo.',
    obTitle: 'Selamat Datang di Revelect Finance', obIntro: 'Sebelum mulai, ini beberapa fitur andalan biar kamu ga skip:',
    obStart: 'Oke, Mulai',
    obQuickAddTitle: 'Tambah Cepat (AI)', obQuickAddDesc: 'Paste/screenshot notif transaksi bank atau e-wallet, AI otomatis isi jumlah & kategorinya. Ada di tab Transaksi.',
    obSplitBillTitle: 'Split Bill (AI)', obSplitBillDesc: 'Upload foto bon, bilang item mana yang punya kamu, AI hitung bagian kamu termasuk pajak/service otomatis.',
    obBudgetTitle: 'Anggaran & Rencana Investasi', obBudgetDesc: 'Atur limit pengeluaran per kategori dan target investasi bulanan, ada di tab Ringkasan.',
    obAccountsTitle: 'Saldo Akun', obAccountsDesc: 'Catat saldo rekening/e-wallet/tunai kamu, otomatis ke-update tiap ada transaksi yang dikaitin ke akun itu.',
    obRecurringTitle: 'Transaksi Berulang', obRecurringDesc: 'Atur kost, langganan, dll sekali aja — otomatis kecatat tiap bulan tanpa perlu input manual lagi.',
    obReportTitle: 'Laporan Bulanan', obReportDesc: 'Tabel ringkasan tiap bulan, bisa langsung download jadi PDF, ada di tab Laporan.',
    wizNameTitle: 'Hai, siapa nama kamu?', wizNameDesc: 'Biar Revinance bisa manggil kamu, bukan cuma nunjukkin angka.', wizNamePlaceholder: 'Nama kamu', wizNameCta: 'Lanjut',
    wizSetupTitle: 'Yuk atur keuangan kamu.', wizSetupDesc: 'Dua hal cepet aja, terus kamu bisa langsung mulai.',
    wizLanguageLabel: 'Bahasa', wizCurrencyLabel: 'Mata Uang', wizBack: 'Kembali', wizFinish: 'Masuk Revinance',
    wizSaveError: 'Gagal nyimpen, coba lagi ya.',
    greetingFallback: 'Halo!', greetingWithName: 'Halo, {name}!', splitYourSharePrefix: 'Bagian',
    greetingSub: 'Ini posisi keuangan kamu sekarang.',
    safeToSpend: 'Aman Buat Dipakai', daysLeftInMonth: '{n} hari lagi bulan ini',
    currentBalance: 'Saldo Saat Ini', upcomingTitle: 'Akan Datang', noUpcoming: 'Ga ada tagihan yang akan datang.',
    spendingTitle: 'Pengeluaran', spentThisMonth: '{amt} keluar bulan ini', viewAllLink: 'Lihat semua',
    noSpendingYet: 'Belum ada pengeluaran bulan ini.',
    insightFaster: 'Pengeluaran kamu {pct}% lebih cepat dari biasanya bulan ini.',
    insightSlower: 'Kamu belanja {pct}% lebih hemat dari biasanya bulan ini.',
    homeEmptyTitle: 'Cerita keuangan kamu dimulai di sini.', homeEmptyBody: 'Tambah transaksi pertama kamu lewat ✦.',
    moreDetail: 'Detail lainnya',
    voiceAdd: 'Tambah Suara', voiceHint: 'Ucapin transaksi kamu, contoh: "kopi 35 ribu"', voiceTapToStart: 'Tap buat mulai',
    voiceListening: 'Lagi dengerin...', voiceUnsupported: 'Browser kamu belum support voice input. Coba pake Chrome atau Safari.',
    voiceError: 'Ga kedengeran, coba lagi.',
    connectGmail: 'Connect Gmail', syncGmail: 'Sync Gmail', gmailConnectSuccess: 'Gmail berhasil terhubung!',
    gmailConnectError: 'Gagal connect Gmail, coba lagi.', gmailSyncing: 'Nyari & baca email transaksi...',
    gmailNoNew: 'Ga ada transaksi baru dari email.', gmailFoundCount: 'Ketemu {n} transaksi. Pilih yang mau dimasukin:',
    gmailReauthNeeded: 'Koneksi Gmail perlu di-refresh. Coba connect ulang.', importSelected: 'Masukin {n} Transaksi',
    advisorTitle: 'Konsultan Keuangan AI', advisorDesc: 'Tanya apa aja soal keuangan kamu — AI ini udah "liat" data kamu bulan ini (pemasukan, pengeluaran, hutang, investasi).',
    advisorPlaceholder: 'Tanya sesuatu...', advisorSend: 'Kirim', advisorThinking: 'Mikir...', advisorError: 'Gagal dapet jawaban, coba lagi.',
    advisorSuggest1: 'Keuangan gw sehat ga bulan ini?', advisorSuggest2: 'Harusnya gw invest berapa bulan ini?', advisorSuggest3: 'Gimana cara ngelunasin hutang lebih cepet?',
  },
  en: {
    appName: 'Finance Tracker',
    tabs: { dashboard: 'Dashboard', transactions: 'Transactions', debts: 'Debts', charts: 'Analytics', review: 'Review', report: 'Report' },
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
    editTransaction: 'Edit Transaction', editDebt: 'Edit Debt',
    setInvestPlan: 'Set Investment Plan', investPlanLabel: 'Monthly Investment Target',
    investPlan: 'Investment Plan', investRealized: 'Realized',
    quickAdd: 'Quick Add (AI)', quickAddDesc: 'Paste a bank/e-wallet transaction SMS or email (BCA, Mandiri, GoPay, etc.), AI will read it automatically.',
    pasteNotifPlaceholder: 'e.g: BCA Debit Rp150,000 at INDOMARET on 07/28...',
    parseBtn: 'Auto-Read', parsing: 'Reading...', parseNotTx: "Couldn't read this as a transaction. Try adding manually or check the text.",
    parseFailed: 'Failed to process, try again.', reviewBeforeSave: 'Review before saving.',
    uploadScreenshot: 'Upload/Paste Notification Screenshot', orPasteText: 'or paste the text below',
    splitBill: 'Split Bill (AI)', splitBillDesc: 'Upload a receipt photo. Describe your specific item(s) (tax/service split proportionally), or just say "split 2/3/4 ways" for an even split.',
    myItemsLabel: 'Your item(s), or say "split evenly"', myItemsPlaceholder: 'e.g: "fried rice and iced tea" OR "split 2 ways"',
    splitCountLabel: 'Split evenly among', people: 'people',
    splitBtn: 'Calculate My Share', splitNotReceipt: "Couldn't read this as a receipt. Try a clearer photo.",
    splitItemsNotFound: "Couldn't match the item(s) you described on the receipt. Try being more specific.",
    uploadReceiptRequired: 'Please upload a receipt photo first.',
    splitResultTitle: 'Your Share Breakdown', splitMySubtotal: 'Your items subtotal', splitBillSubtotal: 'Receipt subtotal',
    splitBillTotal: 'Receipt total (after tax/service)', splitMultiplier: 'Multiplier', splitYourShare: 'Your Share',
    splitScreenshotHint: 'Screenshot this to send to friends, or add it straight to your tracker.',
    back: 'Back', addToTracker: 'Add to Tracker',
    shareImage: 'Save / Share Image',
    monthlyReportTitle: 'Monthly Report', downloadPdf: 'Download PDF', month: 'Month', net: 'Net',
    noReportData: 'No transaction data yet to build a report.',
    trialExpiredTitle: 'Your Trial Has Ended', trialExpiredBody: 'Your 30-day free trial has ended. Contact Vaza to continue access.',
    trialDaysLeft: 'trial days left', trialLastDay: 'Last day of trial',
    accounts: 'Account Balances', manageAccounts: 'Manage Accounts', addAccount: 'Add Account', editAccount: 'Edit Account',
    accountName: 'Account Name', accountType: 'Account Type', accountBalance: 'Balance', totalNetWorth: 'Total Balance (All Accounts)',
    noAccounts: 'No accounts yet. Add one to start tracking your balance.', account: 'Account', noAccount: 'No account',
    accTypeBank: 'Bank', accTypeEwallet: 'E-Wallet', accTypeCash: 'Cash', accTypeOther: 'Other',
    recurring: 'Recurring Transactions', manageRecurring: 'Manage Recurring', addRecurring: 'Add Recurring', editRecurring: 'Edit Recurring',
    dayOfMonth: 'Day of Month', nextDue: 'Next Due', active: 'Active', inactive: 'Inactive',
    noRecurring: 'No recurring transactions yet. Add rent, subscriptions, etc. so you don\'t have to log them manually every month.',
    recurringAutoNote: 'Recurring transactions are checked automatically every time you open the app, and logged once due.',
    obTitle: 'Welcome to Revelect Finance', obIntro: "Before you start, here's a quick rundown of the standout features:",
    obStart: "Okay, Let's Go",
    obQuickAddTitle: 'Quick Add (AI)', obQuickAddDesc: 'Paste/screenshot a bank or e-wallet notification, AI fills in the amount and category. Found in the Transactions tab.',
    obSplitBillTitle: 'Split Bill (AI)', obSplitBillDesc: "Upload a receipt photo, tell it which items are yours, AI calculates your share including tax/service automatically.",
    obBudgetTitle: 'Budget & Investment Plan', obBudgetDesc: 'Set spending limits per category and a monthly investment target, found in the Dashboard tab.',
    obAccountsTitle: 'Account Balances', obAccountsDesc: 'Track your bank/e-wallet/cash balances, automatically updated whenever a transaction is linked to that account.',
    obRecurringTitle: 'Recurring Transactions', obRecurringDesc: "Set up rent, subscriptions, etc. once — logged automatically every month, no manual entry needed.",
    obReportTitle: 'Monthly Report', obReportDesc: 'A month-by-month summary table you can download straight to PDF, found in the Report tab.',
    wizNameTitle: "Hi, what's your name?", wizNameDesc: "So Revinance can talk to you, not just show you numbers.", wizNamePlaceholder: 'Your name', wizNameCta: 'Continue',
    wizSetupTitle: "Let's set up your finances.", wizSetupDesc: 'Two quick things, then you can dive right in.',
    wizLanguageLabel: 'Language', wizCurrencyLabel: 'Currency', wizBack: 'Back', wizFinish: 'Enter Revinance',
    wizSaveError: "Couldn't save, please try again.",
    greetingFallback: 'Hello!', greetingWithName: 'Hello, {name}!', splitYourSharePrefix: "Share —",
    greetingSub: "Here's where your money stands.",
    safeToSpend: 'Safe to Spend', daysLeftInMonth: '{n} days left this month',
    currentBalance: 'Current Balance', upcomingTitle: 'Upcoming', noUpcoming: 'No upcoming payments.',
    spendingTitle: 'Spending', spentThisMonth: '{amt} spent this month', viewAllLink: 'View all',
    noSpendingYet: 'No spending yet this month.',
    insightFaster: "You're spending {pct}% faster than usual this month.",
    insightSlower: "You've spent {pct}% less than usual this month.",
    homeEmptyTitle: 'Your money story starts here.', homeEmptyBody: 'Add your first transaction with ✦.',
    moreDetail: 'More detail',
    voiceAdd: 'Voice Add', voiceHint: 'Say your transaction, e.g. "coffee 35k"', voiceTapToStart: 'Tap to start',
    voiceListening: 'Listening...', voiceUnsupported: "Your browser doesn't support voice input. Try Chrome or Safari.",
    voiceError: "Couldn't hear that, try again.",
    connectGmail: 'Connect Gmail', syncGmail: 'Sync Gmail', gmailConnectSuccess: 'Gmail connected successfully!',
    gmailConnectError: 'Failed to connect Gmail, please try again.', gmailSyncing: 'Searching & reading transaction emails...',
    gmailNoNew: 'No new transactions found in your email.', gmailFoundCount: 'Found {n} transactions. Pick which to import:',
    gmailReauthNeeded: 'Gmail connection needs a refresh. Try reconnecting.', importSelected: 'Import {n} Transactions',
    advisorTitle: 'AI Finance Advisor', advisorDesc: "Ask anything about your finances — this AI already \"sees\" your data this month (income, expenses, debt, investments).",
    advisorPlaceholder: 'Ask something...', advisorSend: 'Send', advisorThinking: 'Thinking...', advisorError: 'Failed to get a response, try again.',
    advisorSuggest1: 'Is my financial health good this month?', advisorSuggest2: 'How much should I invest this month?', advisorSuggest3: 'How do I pay off debt faster?',
  },
};

const EXPENSE_CATS = ['food', 'rent', 'transport', 'entertainment', 'bills', 'health', 'gym', 'shopping', 'other_expense'];
const INCOME_CATS = ['salary', 'freelance', 'trading', 'content', 'other_income'];
const INVESTMENT_CATS = ['crypto', 'stocks', 'other_investment'];

const CAT_COLORS = {
  food: '#E8C468',        // soft yellow
  rent: '#C98B6B',        // soft terracotta
  transport: '#A79BD1',   // soft purple
  entertainment: '#E091A8',// soft pink
  bills: '#7FAAC9',       // soft blue
  health: '#8FC08A',      // soft green
  gym: '#5FB3A6',         // soft teal
  shopping: '#EDA05F',    // soft orange
  other_expense: '#ADA192',// soft taupe
  salary: '#8FC08A', freelance: '#7FAAC9', trading: '#5FB3A6', content: '#A79BD1', other_income: '#ADA192',
};

const CAT_ICONS = {
  food: Utensils, rent: Home, transport: Car, entertainment: Film, bills: Receipt,
  health: HeartPulse, gym: Dumbbell, shopping: ShoppingBag, other_expense: MoreHorizontal,
  salary: Banknote, freelance: Laptop, trading: TrendingUp, content: Video, other_income: MoreHorizontal,
};

const PIE_RADIAN = Math.PI / 180;
function makePieIconLabel(data) {
  return function PieIconLabel(props) {
    const { cx, cy, midAngle, outerRadius, index } = props;
    const entry = data[index];
    if (!entry) return null;
    const IconComp = CAT_ICONS[entry.key] || MoreHorizontal;
    const color = CAT_COLORS[entry.key] || '#786b5a';
    const r = outerRadius + 20;
    const x = cx + r * Math.cos(-midAngle * PIE_RADIAN);
    const y = cy + r * Math.sin(-midAngle * PIE_RADIAN);
    return (
      <g transform={`translate(${x - 13}, ${y - 13})`}>
        <circle cx={13} cy={13} r={13} fill="var(--fc-surface)" stroke={color} strokeWidth={1.5} />
        <g transform="translate(6,6)">
          <IconComp size={14} color={color} strokeWidth={2} />
        </g>
      </g>
    );
  };
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

function fmtIDR(n) {
  const v = Math.round(n || 0);
  return 'Rp' + v.toLocaleString('id-ID');
}
function fmtNumber(n) {
  if (n === '' || n === null || n === undefined) return '';
  return Number(n).toLocaleString('id-ID');
}
function parseFormattedNumber(str) {
  const digits = String(str).replace(/[^\d]/g, '');
  return digits === '' ? '' : Number(digits);
}
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function toCamel(type) { if (type === 'debt_payment') return 'debtPayment'; return type; }

function mapTxRow(row) {
  return { id: row.id, date: row.date, type: row.type, category: row.category, debtId: row.debt_id, accountId: row.account_id || null, amount: Number(row.amount), note: row.note || '' };
}
function mapDebtRow(row) {
  return { id: row.id, name: row.name, total: Number(row.total), remaining: Number(row.remaining), monthlyPlan: row.monthly_plan != null ? Number(row.monthly_plan) : null };
}
function mapAccountRow(row) {
  return { id: row.id, name: row.name, type: row.type, balance: Number(row.balance) };
}
function mapRecurringRow(row) {
  return {
    id: row.id, type: row.type, category: row.category, debtId: row.debt_id, accountId: row.account_id || null,
    amount: Number(row.amount), note: row.note || '', dayOfMonth: row.day_of_month, nextDueDate: row.next_due_date, active: row.active,
  };
}

/* ---------------------------------------------------------
   Top-level App: handles auth session, then renders FinanceApp
--------------------------------------------------------- */
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out
  const [lang, setLang] = useState('id');
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [subInfo, setSubInfo] = useState(undefined); // undefined = checking, null = no row, else {status, trialEndsAt, isActive, daysLeft}
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

  useEffect(() => {
    if (!session) { setSubInfo(undefined); return; }
    (async () => {
      const { data } = await supabase
        .from('finance_settings')
        .select('subscription_status, trial_ends_at')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (!data) { setSubInfo({ status: 'trial', isActive: true, daysLeft: null }); return; }
      const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
      const isActive = data.subscription_status === 'active'
        || (data.subscription_status === 'trial' && trialEndsAt && trialEndsAt > new Date());
      const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt - new Date()) / (1000 * 60 * 60 * 24))) : null;
      setSubInfo({ status: data.subscription_status, trialEndsAt, isActive, daysLeft });
    })();
  }, [session]);

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
  if (subInfo === undefined) {
    const bg = theme === 'light' ? '#f7f3ea' : '#0d0b09';
    const fg = theme === 'light' ? '#8a6a30' : '#c9a977';
    return <div style={{ background: bg, color: fg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Calibri, sans-serif' }}>...</div>;
  }
  if (subInfo && !subInfo.isActive) {
    return <TrialExpiredScreen lang={lang} setLang={setLang} theme={theme} setTheme={updateTheme} onLogout={() => supabase.auth.signOut()} />;
  }
  return <FinanceApp session={session} theme={theme} onThemeChange={updateTheme} subInfo={subInfo} />;
}

function TrialExpiredScreen({ lang, setLang, theme, setTheme, onLogout }) {
  const t = T[lang];
  return (
    <div className="fc-authwrap" data-theme={theme}>
      <style>{CSS}</style>
      <div className="fc-modal" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div className="fc-modal-header" style={{ justifyContent: 'center', position: 'relative' }}>
          <span>{t.trialExpiredTitle}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fc-text-dim)', lineHeight: 1.6 }}>{t.trialExpiredBody}</div>
        <div className="fc-modal-actions" style={{ justifyContent: 'center', marginTop: 8 }}>
          <button type="button" className="fc-btn-ghost" onClick={onLogout}>{t.logout}</button>
        </div>
      </div>
    </div>
  );
}

const ACCOUNT_TYPE_ICONS = { bank: Landmark, ewallet: Wallet, cash: Banknote, other: MoreHorizontal };

function resizeImageFile(file, maxDim = 1280, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
          else { width = Math.round(width * (maxDim / height)); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const [meta, base64] = dataUrl.split(',');
        const mt = meta.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
        resolve({ dataUrl, base64, mediaType: mt });
      };
      img.onerror = () => reject(new Error('image_load_failed'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('file_read_failed'));
    reader.readAsDataURL(file);
  });
}

function MoneyInput({ value, onChange, placeholder, required }) {
  const display = fmtNumber(value);
  function handleChange(e) {
    const parsed = parseFormattedNumber(e.target.value);
    onChange(parsed);
  }
  return (
    <input type="text" inputMode="numeric" value={display} onChange={handleChange} placeholder={placeholder || '0'} required={required} />
  );
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
function FinanceApp({ session, theme, onThemeChange, subInfo }) {
  const userId = session.user.id;
  const [lang, setLang] = useState('id');
  const [tab, setTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [recurringItems, setRecurringItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthKey(new Date()));
  const [showTxModal, setShowTxModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showInvestPlanModal, setShowInvestPlanModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showRecurringListModal, setShowRecurringListModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [debtPayTargetId, setDebtPayTargetId] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [investPlan, setInvestPlan] = useState(0);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [showGmailSyncModal, setShowGmailSyncModal] = useState(false);
  const [gmailToast, setGmailToast] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gmailStatus = params.get('gmail');
    if (gmailStatus) {
      setGmailToast({ status: gmailStatus, reason: params.get('reason') });
      if (gmailStatus === 'success') setGmailConnected(true);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      setTimeout(() => setGmailToast(null), 6000);
    }
  }, []);

  function connectGmail() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GMAIL_CALLBACK_URL;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      access_type: 'offline',
      prompt: 'consent',
      state: session.access_token,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    setShowOnboardingWizard(!displayName);
  }, [loaded, displayName]);

  async function finishOnboardingWizard({ name, space, newLang, newCurrency }) {
    const { error } = await supabase.from('finance_settings').upsert(
      { user_id: userId, display_name: name, space_name: space, language: newLang, currency: newCurrency },
      { onConflict: 'user_id' }
    );
    if (error) {
      console.error('finishOnboardingWizard failed:', error);
      return false;
    }
    setDisplayName(name);
    setSpaceName(space);
    setLang(newLang);
    setShowOnboardingWizard(false);
    return true;
  }

  useEffect(() => {
    try {
      const seen = localStorage.getItem(`fc-onboarded-${userId}`);
      if (!seen) setShowOnboarding(true);
    } catch (e) { /* ignore */ }
  }, [userId]);
  function dismissOnboarding() {
    setShowOnboarding(false);
    try { localStorage.setItem(`fc-onboarded-${userId}`, '1'); } catch (e) { /* ignore */ }
  }

  const t = T[lang];

  useEffect(() => {
    (async () => {
      const [txRes, debtRes, budgetRes, settingsRes, accountRes, recurringRes] = await Promise.all([
        supabase.from('finance_transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('finance_debts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('finance_budgets').select('*').eq('user_id', userId),
        supabase.from('finance_settings').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('finance_accounts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('finance_recurring').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      ]);
      if (txRes.data) setTransactions(txRes.data.map(mapTxRow));
      if (debtRes.data) setDebts(debtRes.data.map(mapDebtRow));
      if (budgetRes.data) {
        const b = {};
        budgetRes.data.forEach(row => { b[row.category] = Number(row.limit_amount); });
        setBudgets(b);
      }
      if (settingsRes.error) console.error('settings fetch failed:', settingsRes.error);
      if (settingsRes.data?.language) setLang(settingsRes.data.language);
      if (settingsRes.data?.theme && settingsRes.data.theme !== theme) onThemeChange(settingsRes.data.theme);
      if (settingsRes.data?.investment_plan != null) setInvestPlan(Number(settingsRes.data.investment_plan));
      if (settingsRes.data?.gmail_connected != null) setGmailConnected(settingsRes.data.gmail_connected);
      setDisplayName(settingsRes.data?.display_name || '');
      setSpaceName(settingsRes.data?.space_name || '');
      if (accountRes.data) setAccounts(accountRes.data.map(mapAccountRow));
      if (recurringRes.data) setRecurringItems(recurringRes.data.map(mapRecurringRow));
      setLoaded(true);
    })();
  }, [userId]);

  async function changeInvestPlan(newPlan) {
    setInvestPlan(newPlan);
    await supabase.from('finance_settings').upsert({ user_id: userId, investment_plan: newPlan }, { onConflict: 'user_id' });
  }

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

  const monthlyRows = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      const mk = tx.date.slice(0, 7);
      if (!map[mk]) map[mk] = { monthKey: mk, income: 0, expense: 0, debtPaid: 0, invested: 0 };
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') map[mk].income += amt;
      else if (tx.type === 'expense') map[mk].expense += amt;
      else if (tx.type === 'debt_payment') map[mk].debtPaid += amt;
      else if (tx.type === 'investment') map[mk].invested += amt;
    });
    return Object.values(map)
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
      .map(r => ({ ...r, net: r.income - r.expense - r.debtPaid }));
  }, [transactions]);

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

  function txAccountDelta(tx) {
    const amt = Number(tx.amount) || 0;
    return tx.type === 'income' ? amt : -amt;
  }
  async function applyAccountDelta(accountId, delta) {
    if (!accountId || !delta) return;
    const { data: accRow } = await supabase.from('finance_accounts').select('balance').eq('id', accountId).single();
    if (!accRow) return;
    const newBalance = Number(accRow.balance) + delta;
    await supabase.from('finance_accounts').update({ balance: newBalance }).eq('id', accountId);
    setAccounts(prev => prev.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
  }
  async function addTransaction(tx) {
    const { data, error } = await supabase.from('finance_transactions').insert({
      user_id: userId, date: tx.date, type: tx.type, category: tx.category, debt_id: tx.debtId, account_id: tx.accountId || null, amount: tx.amount, note: tx.note,
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
    if (tx.accountId) await applyAccountDelta(tx.accountId, txAccountDelta(tx));
    return data.id;
  }
  async function deleteTransaction(id) {
    const original = transactions.find(tx => tx.id === id);
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      if (original?.accountId) await applyAccountDelta(original.accountId, -txAccountDelta(original));
    }
  }
  async function updateTransaction(updated) {
    const original = transactions.find(tx => tx.id === updated.id);
    if (!original) return;
    // revert original debt impact (if it was a debt payment)
    if (original.type === 'debt_payment' && original.debtId) {
      const { data: debtRow } = await supabase.from('finance_debts').select('remaining').eq('id', original.debtId).single();
      if (debtRow) {
        const reverted = Number(debtRow.remaining) + Number(original.amount);
        await supabase.from('finance_debts').update({ remaining: reverted }).eq('id', original.debtId);
        setDebts(prev => prev.map(d => d.id === original.debtId ? { ...d, remaining: reverted } : d));
      }
    }
    // revert original account impact
    if (original.accountId) await applyAccountDelta(original.accountId, -txAccountDelta(original));

    const { data, error } = await supabase.from('finance_transactions').update({
      date: updated.date, type: updated.type, category: updated.category, debt_id: updated.debtId, account_id: updated.accountId || null, amount: updated.amount, note: updated.note,
    }).eq('id', updated.id).select().single();
    if (error) { console.error(error); return; }
    setTransactions(prev => prev.map(tx => tx.id === updated.id ? mapTxRow(data) : tx));
    // apply new debt impact (if now a debt payment)
    if (updated.type === 'debt_payment' && updated.debtId) {
      const { data: debtRow2 } = await supabase.from('finance_debts').select('remaining').eq('id', updated.debtId).single();
      if (debtRow2) {
        const newRemaining = Math.max(0, Number(debtRow2.remaining) - Number(updated.amount));
        await supabase.from('finance_debts').update({ remaining: newRemaining }).eq('id', updated.debtId);
        setDebts(prev => prev.map(d => d.id === updated.debtId ? { ...d, remaining: newRemaining } : d));
      }
    }
    // apply new account impact
    if (updated.accountId) await applyAccountDelta(updated.accountId, txAccountDelta(updated));
  }
  function saveTransaction(payload) {
    if (payload.id) updateTransaction(payload); else addTransaction(payload);
  }
  async function addDebt(d) {
    const { data, error } = await supabase.from('finance_debts').insert({
      user_id: userId, name: d.name, total: d.total, remaining: d.remaining, monthly_plan: d.monthlyPlan,
    }).select().single();
    if (!error) setDebts(prev => [...prev, mapDebtRow(data)]);
  }
  async function updateDebt(updated) {
    const { data, error } = await supabase.from('finance_debts').update({
      name: updated.name, total: updated.total, remaining: updated.remaining, monthly_plan: updated.monthlyPlan,
    }).eq('id', updated.id).select().single();
    if (!error) setDebts(prev => prev.map(d => d.id === updated.id ? mapDebtRow(data) : d));
  }
  function saveDebt(payload) {
    if (payload.id) updateDebt(payload); else addDebt(payload);
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

  // --- Accounts ---
  async function addAccount(a) {
    const { data, error } = await supabase.from('finance_accounts').insert({
      user_id: userId, name: a.name, type: a.type, balance: a.balance,
    }).select().single();
    if (!error) setAccounts(prev => [...prev, mapAccountRow(data)]);
  }
  async function updateAccount(a) {
    const { data, error } = await supabase.from('finance_accounts').update({
      name: a.name, type: a.type, balance: a.balance,
    }).eq('id', a.id).select().single();
    if (!error) setAccounts(prev => prev.map(x => x.id === a.id ? mapAccountRow(data) : x));
  }
  function saveAccount(payload) {
    if (payload.id) updateAccount(payload); else addAccount(payload);
  }
  async function deleteAccount(id) {
    const { error } = await supabase.from('finance_accounts').delete().eq('id', id);
    if (!error) setAccounts(prev => prev.filter(a => a.id !== id));
  }

  // --- Recurring transaction templates ---
  function computeNextDue(dayOfMonth, fromDate) {
    const d = new Date(fromDate);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, Math.min(dayOfMonth, 28));
    return next.toISOString().slice(0, 10);
  }
  async function addRecurring(r) {
    const initialDue = r.nextDueDate || (() => {
      const now = new Date();
      const due = new Date(now.getFullYear(), now.getMonth(), Math.min(r.dayOfMonth, 28));
      if (due < new Date(now.toDateString())) return computeNextDue(r.dayOfMonth, now);
      return due.toISOString().slice(0, 10);
    })();
    const { data, error } = await supabase.from('finance_recurring').insert({
      user_id: userId, type: r.type, category: r.category, debt_id: r.debtId, account_id: r.accountId || null,
      amount: r.amount, note: r.note, day_of_month: r.dayOfMonth, next_due_date: initialDue, active: true,
    }).select().single();
    if (!error) setRecurringItems(prev => [...prev, mapRecurringRow(data)]);
  }
  async function updateRecurring(r) {
    const { data, error } = await supabase.from('finance_recurring').update({
      type: r.type, category: r.category, debt_id: r.debtId, account_id: r.accountId || null,
      amount: r.amount, note: r.note, day_of_month: r.dayOfMonth, active: r.active,
    }).eq('id', r.id).select().single();
    if (!error) setRecurringItems(prev => prev.map(x => x.id === r.id ? mapRecurringRow(data) : x));
  }
  function saveRecurring(payload) {
    if (payload.id) updateRecurring(payload); else addRecurring(payload);
  }
  async function deleteRecurring(id) {
    const { error } = await supabase.from('finance_recurring').delete().eq('id', id);
    if (!error) setRecurringItems(prev => prev.filter(r => r.id !== id));
  }

  // Auto-generate any due recurring transactions, once per load.
  const recurringProcessed = useRef(false);
  useEffect(() => {
    if (!loaded || recurringProcessed.current || recurringItems.length === 0) return;
    recurringProcessed.current = true;
    (async () => {
      const todayStr = todayISO();
      for (const item of recurringItems) {
        if (!item.active) continue;
        let due = item.nextDueDate;
        let guard = 0;
        while (due <= todayStr && guard < 12) {
          await addTransaction({
            type: item.type, date: due, category: item.category, debtId: item.debtId, accountId: item.accountId,
            amount: item.amount, note: item.note,
          });
          due = computeNextDue(item.dayOfMonth, due);
          guard++;
        }
        if (due !== item.nextDueDate) {
          await supabase.from('finance_recurring').update({ next_due_date: due }).eq('id', item.id);
          setRecurringItems(prev => prev.map(r => r.id === item.id ? { ...r, nextDueDate: due } : r));
        }
      }
    })();
  }, [loaded, recurringItems]);

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

  if (showOnboardingWizard) {
    return <OnboardingWizard t={t} theme={theme} lang={lang} onFinish={finishOnboardingWizard} />;
  }

  return (
    <div className="fc-app" data-theme={theme}>
      <style>{CSS}</style>
      {gmailToast && (
        <div className={`fc-toast ${gmailToast.status === 'success' ? 'fc-toast-success' : 'fc-toast-error'}`}>
          {gmailToast.status === 'success' ? t.gmailConnectSuccess : t.gmailConnectError}
        </div>
      )}
      <Header t={t} lang={lang} setLang={changeLang} theme={theme} onThemeChange={changeTheme} onLogout={() => supabase.auth.signOut()} subInfo={subInfo} />
      <NavTabs t={t} tab={tab} setTab={setTab} />
      <MonthNav monthLabel={monthLabel} shiftMonth={shiftMonth} t={t} />

      <div className="fc-body">
        {tab === 'dashboard' && (
          <Dashboard t={t} totals={totals} displayName={displayName} budgets={budgets} accounts={accounts}
            recurringItems={recurringItems} debts={debts} monthlyRows={monthlyRows} onViewAnalytics={() => setTab('charts')} />
        )}
        {tab === 'transactions' && (
          <Transactions t={t} lang={lang} monthTx={monthTx} debts={debts} onAdd={() => setShowTxModal(true)} onDelete={deleteTransaction}
            onEdit={(tx) => { setEditingTx(tx); setShowTxModal(true); }}
            onQuickAdd={() => setShowQuickAddModal(true)}
            onSplitBill={() => setShowSplitBillModal(true)}
            onManageRecurring={() => setShowRecurringListModal(true)}
            gmailConnected={gmailConnected} onConnectGmail={connectGmail} onSyncGmail={() => setShowGmailSyncModal(true)} />
        )}
        {tab === 'debts' && (
          <Debts t={t} debts={debts} totalDebtRemaining={totalDebtRemaining}
            onAdd={() => setShowDebtModal(true)} onDelete={deleteDebt}
            onEdit={(d) => { setEditingDebt(d); setShowDebtModal(true); }}
            onPay={(id) => { setDebtPayTargetId(id); setShowTxModal(true); }} />
        )}
        {tab === 'charts' && <Charts t={t} totals={totals} lang={lang} />}
        {tab === 'review' && (
          <Review t={t} lang={lang} transactions={transactions} monthTx={monthTx} totals={totals} health={health} selectedMonth={selectedMonth}
            debts={debts} budgets={budgets} investPlan={investPlan} totalDebtRemaining={totalDebtRemaining} monthLabel={monthLabel}
            accounts={accounts} onAddAccount={() => { setEditingAccount(null); setShowAccountModal(true); }}
            onEditAccount={(a) => { setEditingAccount(a); setShowAccountModal(true); }} onDeleteAccount={deleteAccount}
            onEditBudget={() => setShowBudgetModal(true)} onEditInvestPlan={() => setShowInvestPlanModal(true)} />
        )}
        {tab === 'report' && (
          <MonthlyReport t={t} lang={lang} rows={monthlyRows} />
        )}
      </div>

      <div className="fc-footer">{t.footerNote}</div>

      {showTxModal && (
        <TxModal t={t} lang={lang} debts={debts} accounts={accounts} presetDebtId={debtPayTargetId} editingTx={editingTx}
          onClose={() => { setShowTxModal(false); setDebtPayTargetId(null); setEditingTx(null); }}
          onSave={(tx) => { saveTransaction(tx); setShowTxModal(false); setDebtPayTargetId(null); setEditingTx(null); }} />
      )}
      {showDebtModal && (
        <DebtModal t={t} editingDebt={editingDebt}
          onClose={() => { setShowDebtModal(false); setEditingDebt(null); }}
          onSave={(d) => { saveDebt(d); setShowDebtModal(false); setEditingDebt(null); }} />
      )}
      {showBudgetModal && (
        <BudgetModal t={t} budgets={budgets} onClose={() => setShowBudgetModal(false)} onSave={(b) => { saveBudgets(b); setShowBudgetModal(false); }} />
      )}
      {showInvestPlanModal && (
        <InvestPlanModal t={t} currentPlan={investPlan} onClose={() => setShowInvestPlanModal(false)} onSave={(p) => { changeInvestPlan(p); setShowInvestPlanModal(false); }} />
      )}
      {showQuickAddModal && (
        <QuickAddModal t={t} onClose={() => setShowQuickAddModal(false)}
          onParsed={(prefill) => { setEditingTx(prefill); setShowQuickAddModal(false); setShowTxModal(true); }} />
      )}
      {showVoiceModal && (
        <VoiceCaptureModal t={t} lang={lang} onClose={() => setShowVoiceModal(false)}
          onParsed={(prefill) => { setEditingTx(prefill); setShowVoiceModal(false); setShowTxModal(true); }} />
      )}
      {showSplitBillModal && (
        <SplitBillModal t={t} lang={lang} displayName={displayName} onClose={() => setShowSplitBillModal(false)}
          onParsed={(prefill) => { setEditingTx(prefill); setShowSplitBillModal(false); setShowTxModal(true); }} />
      )}
      {showAccountModal && (
        <AccountModal t={t} editingAccount={editingAccount}
          onClose={() => { setShowAccountModal(false); setEditingAccount(null); }}
          onSave={(a) => { saveAccount(a); setShowAccountModal(false); setEditingAccount(null); }} />
      )}
      {showRecurringListModal && (
        <RecurringListModal t={t} lang={lang} items={recurringItems} debts={debts}
          onClose={() => setShowRecurringListModal(false)}
          onAdd={() => { setEditingRecurring(null); setShowRecurringListModal(false); setShowRecurringModal(true); }}
          onEdit={(r) => { setEditingRecurring(r); setShowRecurringListModal(false); setShowRecurringModal(true); }}
          onDelete={deleteRecurring} />
      )}
      {showRecurringModal && (
        <RecurringModal t={t} debts={debts} accounts={accounts} editingRecurring={editingRecurring}
          onClose={() => { setShowRecurringModal(false); setEditingRecurring(null); setShowRecurringListModal(true); }}
          onSave={(r) => { saveRecurring(r); setShowRecurringModal(false); setEditingRecurring(null); setShowRecurringListModal(true); }} />
      )}
      {showOnboarding && <OnboardingModal t={t} onDismiss={dismissOnboarding} />}
      {showGmailSyncModal && (
        <GmailSyncModal t={t} onClose={() => setShowGmailSyncModal(false)} onImport={(items) => { items.forEach(saveTransaction); setShowGmailSyncModal(false); }} />
      )}

      <div className="fc-fab-wrap">
        {showFabMenu && (
          <div className="fc-fab-menu">
            <button className="fc-fab-mini" style={{ animationDelay: '0ms' }} onClick={() => { setShowFabMenu(false); setShowSplitBillModal(true); }}>
              <Sparkles size={15} /> <span>{t.splitBill}</span>
            </button>
            <button className="fc-fab-mini" style={{ animationDelay: '40ms' }} onClick={() => { setShowFabMenu(false); setShowQuickAddModal(true); }}>
              <Sparkles size={15} /> <span>{t.quickAdd}</span>
            </button>
            <button className="fc-fab-mini" style={{ animationDelay: '80ms' }} onClick={() => { setShowFabMenu(false); setShowVoiceModal(true); }}>
              <Mic size={15} /> <span>{t.voiceAdd}</span>
            </button>
            <button className="fc-fab-mini fc-fab-mini-primary" style={{ animationDelay: '120ms' }} onClick={() => { setShowFabMenu(false); setEditingTx(null); setShowTxModal(true); }}>
              <Plus size={15} /> <span>{t.addTransaction}</span>
            </button>
          </div>
        )}
        <button className={`fc-fab-main ${showFabMenu ? 'fc-fab-main-open' : ''}`} onClick={() => setShowFabMenu(s => !s)} aria-label={t.addTransaction}>
          {showFabMenu ? <X size={22} className="fc-fab-icon" /> : <Sparkles size={22} className="fc-fab-icon" />}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Sub-components (unchanged from artifact version)
--------------------------------------------------------- */
function Header({ t, lang, setLang, theme, onThemeChange, onLogout, subInfo }) {
  return (
    <div className="fc-header">
      <div className="fc-brand">
        <img src={REVELECT_LOGO} alt="Revelect" className="fc-logo" />
        <div>
          <div className="fc-title">Revelect</div>
          <div className="fc-subtitle">{t.appName}</div>
          {subInfo && subInfo.status === 'trial' && subInfo.daysLeft != null && (
            <div className="fc-trial-note">{subInfo.daysLeft <= 0 ? t.trialLastDay : `${subInfo.daysLeft} ${t.trialDaysLeft}`}</div>
          )}
        </div>
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
    { key: 'report', icon: FileText },
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

function Dashboard({ t, totals, displayName, budgets, accounts, recurringItems, debts, monthlyRows, onViewAnalytics }) {
  const activeBudgets = EXPENSE_CATS.filter(c => Number(budgets[c]) > 0);
  const overBudgetCats = activeBudgets.filter(c => (totals.byCatExpense[c] || 0) > Number(budgets[c]));
  const netWorth = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);
  const greeting = displayName ? t.greetingWithName.replace('{name}', displayName) : t.greetingFallback;
  const isEmpty = totals.income === 0 && totals.expense === 0 && accounts.length === 0;

  const now = new Date();
  const today = todayISO();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const endOfMonthISO = endOfMonth.toISOString().slice(0, 10);
  const daysLeft = Math.max(0, Math.round((endOfMonth - now) / 86400000));

  const upcoming = (recurringItems || [])
    .filter(r => r.active && r.type !== 'income' && r.nextDueDate >= today && r.nextDueDate <= endOfMonthISO)
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));
  const committedUpcoming = upcoming.reduce((s, r) => s + Number(r.amount || 0), 0);
  const safeToSpend = netWorth - committedUpcoming;

  const topSpendCats = Object.entries(totals.byCatExpense).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxCatValue = topSpendCats.length ? topSpendCats[0][1] : 0;

  // Insight: compare this month's expense pace against the average of prior months, using only real data.
  const priorMonths = (monthlyRows || []).filter(r => r.monthKey !== monthKey(now)).slice(0, 3);
  let insight = null;
  if (priorMonths.length > 0 && totals.expense > 0) {
    const avgPriorExpense = priorMonths.reduce((s, r) => s + r.expense, 0) / priorMonths.length;
    const daysInMonth = endOfMonth.getDate();
    const elapsedFrac = clamp01(now.getDate() / daysInMonth);
    const expectedSoFar = avgPriorExpense * elapsedFrac;
    if (expectedSoFar > 0) {
      const pctDiff = ((totals.expense - expectedSoFar) / expectedSoFar) * 100;
      if (pctDiff > 15) insight = t.insightFaster.replace('{pct}', Math.round(pctDiff));
      else if (pctDiff < -15) insight = t.insightSlower.replace('{pct}', Math.round(Math.abs(pctDiff)));
    }
  }

  return (
    <div className="fc-dashboard">
      <div className="fc-home-hero">
        <div className="fc-greeting">{greeting}</div>
        <div className="fc-greeting-sub">{t.greetingSub}</div>

        {isEmpty ? (
          <div className="fc-home-empty">
            <div className="fc-home-empty-title">{t.homeEmptyTitle}</div>
            <div className="fc-home-empty-body">{t.homeEmptyBody}</div>
          </div>
        ) : (
          <>
            <div className="fc-safe-block">
              <div className="fc-safe-label">{t.safeToSpend}</div>
              <div className="fc-safe-amount">{fmtIDR(safeToSpend)}</div>
              <div className="fc-safe-sub">{t.daysLeftInMonth.replace('{n}', daysLeft)}</div>
            </div>
            <div className="fc-current-balance-row">{t.currentBalance}: <b>{fmtIDR(netWorth)}</b></div>
          </>
        )}
      </div>

      {overBudgetCats.length > 0 && (
        <div className="fc-alert-banner">
          <AlertCircle size={16} />
          <span><b>{t.budgetAlertTitle}:</b> {overBudgetCats.length} {t.budgetAlertBody} — {overBudgetCats.map(c => t.categories[c]).join(', ')}</span>
        </div>
      )}

      {!isEmpty && (
        <div className="fc-section">
          <div className="fc-section-title">{t.upcomingTitle}</div>
          {upcoming.length === 0 ? (
            <div className="fc-section-empty">{t.noUpcoming}</div>
          ) : (
            <div className="fc-upcoming-list">
              {upcoming.slice(0, 4).map(r => {
                const label = r.debtId ? (debts.find(d => d.id === r.debtId)?.name || t.debtPayment) : (t.categories[r.category] || r.category);
                return (
                  <div key={r.id} className="fc-upcoming-item">
                    <div className="fc-upcoming-date">{r.nextDueDate.slice(8, 10)}/{r.nextDueDate.slice(5, 7)}</div>
                    <div className="fc-upcoming-label">{label}</div>
                    <div className="fc-upcoming-amount">{fmtIDR(r.amount)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!isEmpty && (
        <div className="fc-section">
          <div className="fc-section-header">
            <div className="fc-section-title">{t.spendingTitle}</div>
            {onViewAnalytics && <button className="fc-link-btn" onClick={onViewAnalytics}>{t.viewAllLink}</button>}
          </div>
          <div className="fc-spend-total">{t.spentThisMonth.replace('{amt}', fmtIDR(totals.expense))}</div>
          {topSpendCats.length === 0 ? (
            <div className="fc-section-empty">{t.noSpendingYet}</div>
          ) : (
            <div className="fc-spend-bars">
              {topSpendCats.map(([cat, val]) => (
                <div key={cat} className="fc-spend-bar-row">
                  <div className="fc-spend-bar-label">{t.categories[cat] || cat}</div>
                  <div className="fc-spend-bar-track"><div className="fc-spend-bar-fill" style={{ width: `${maxCatValue ? (val / maxCatValue) * 100 : 0}%`, background: CAT_COLORS[cat] || 'var(--fc-gold-bright)' }} /></div>
                  <div className="fc-spend-bar-value">{fmtIDR(val)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {insight && (
        <div className="fc-insight-banner">
          <Sparkles size={15} color="var(--fc-gold)" />
          <span>{insight}</span>
        </div>
      )}
    </div>
  );
}

function Transactions({ t, lang, monthTx, debts, onAdd, onQuickAdd, onSplitBill, onManageRecurring, onDelete, onEdit, gmailConnected, onConnectGmail, onSyncGmail }) {
  const sorted = [...monthTx].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="fc-card">
      <div className="fc-card-header">
        <div className="fc-card-title">{t.tabs.transactions}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {gmailConnected ? (
            <button className="fc-btn-ghost" onClick={onSyncGmail}><Mail size={14} /> {t.syncGmail}</button>
          ) : (
            <button className="fc-btn-ghost" onClick={onConnectGmail}><Mail size={14} /> {t.connectGmail}</button>
          )}
          <button className="fc-btn-ghost" onClick={onManageRecurring}><Repeat size={14} /> {t.recurring}</button>
          <button className="fc-btn-ghost" onClick={onSplitBill}><Sparkles size={14} /> {t.splitBill}</button>
          <button className="fc-btn-ghost" onClick={onQuickAdd}><Sparkles size={14} /> {t.quickAdd}</button>
          <button className="fc-btn-primary" onClick={onAdd}><Plus size={15} /> {t.addTransaction}</button>
        </div>
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
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="fc-icon-btn" onClick={() => onEdit(tx)}><Pencil size={14} /></button>
                      <button className="fc-icon-btn" onClick={() => onDelete(tx.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Debts({ t, debts, totalDebtRemaining, onAdd, onDelete, onEdit, onPay }) {
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
                    <button className="fc-icon-btn" onClick={() => onEdit(d)}><Pencil size={14} /></button>
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
  const barData = [...expenseData].sort((a, b) => b.value - a.value);
  return (
    <div className="fc-charts-grid">
      <div className="fc-card">
        <div className="fc-card-title">{t.breakdown} — {t.expense}</div>
        {expenseData.length === 0 ? <div className="fc-empty">{t.noData}</div> : (
          <div className="fc-pie-row">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2}
                  label={makePieIconLabel(expenseData)} labelLine={false}>
                  {expenseData.map(entry => <Cell key={entry.key} fill={CAT_COLORS[entry.key] || '#786b5a'} stroke="var(--fc-bg)" strokeWidth={1} />)}
                </Pie>
                <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ background: 'var(--fc-surface)', border: '1px solid var(--fc-border)', borderRadius: 8, color: 'var(--fc-text)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="fc-legend">
              {[...expenseData].sort((a, b) => b.value - a.value).map(entry => (
                <div key={entry.key} className="fc-legend-item">
                  <span className="fc-legend-icon" style={{ borderColor: CAT_COLORS[entry.key] || '#786b5a' }}>
                    {React.createElement(CAT_ICONS[entry.key] || MoreHorizontal, { size: 12, color: CAT_COLORS[entry.key] || '#786b5a', strokeWidth: 2 })}
                  </span>
                  <span className="fc-legend-name">{entry.name}</span>
                  <span className="fc-legend-value">{fmtIDR(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
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

function formatMonthKeyLabel(monthKey, lang) {
  const [y, m] = monthKey.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
}

function MonthlyReport({ t, lang, rows }) {
  function downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(t.monthlyReportTitle, 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(`Revelect Finance Tracker — ${new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US')}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [[t.month, t.totalIncome, t.totalExpense, t.debtPayment, t.investment, t.net]],
      body: rows.map(r => [
        formatMonthKeyLabel(r.monthKey, lang),
        fmtIDR(r.income),
        fmtIDR(r.expense),
        fmtIDR(r.debtPaid),
        fmtIDR(r.invested),
        fmtIDR(r.net),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [201, 169, 119], textColor: [20, 16, 12], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [245, 241, 233] },
      columnStyles: {
        1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' },
      },
    });

    doc.save(`revelect-finance-report-${Date.now()}.pdf`);
  }

  return (
    <div className="fc-card">
      <div className="fc-card-header">
        <div className="fc-card-title">{t.monthlyReportTitle}</div>
        {rows.length > 0 && (
          <button className="fc-btn-primary" onClick={downloadPdf}><Download size={15} /> {t.downloadPdf}</button>
        )}
      </div>
      {rows.length === 0 ? (
        <div className="fc-empty">{t.noReportData}</div>
      ) : (
        <div className="fc-table-wrap">
          <table className="fc-table">
            <thead>
              <tr>
                <th>{t.month}</th>
                <th style={{ textAlign: 'right' }}>{t.totalIncome}</th>
                <th style={{ textAlign: 'right' }}>{t.totalExpense}</th>
                <th style={{ textAlign: 'right' }}>{t.debtPayment}</th>
                <th style={{ textAlign: 'right' }}>{t.investment}</th>
                <th style={{ textAlign: 'right' }}>{t.net}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.monthKey}>
                  <td>{formatMonthKeyLabel(r.monthKey, lang)}</td>
                  <td style={{ textAlign: 'right', color: '#7c9a72' }}>{fmtIDR(r.income)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtIDR(r.expense)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtIDR(r.debtPaid)}</td>
                  <td style={{ textAlign: 'right' }}>{fmtIDR(r.invested)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: r.net >= 0 ? '#7c9a72' : '#b0584f' }}>{fmtIDR(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Review({ t, lang, transactions, monthTx, totals, health, selectedMonth, debts, budgets, investPlan, totalDebtRemaining, monthLabel, accounts, onAddAccount, onEditAccount, onDeleteAccount, onEditBudget, onEditInvestPlan }) {
  const activeBudgets = EXPENSE_CATS.filter(c => Number(budgets[c]) > 0);
  const investPct = investPlan > 0 ? Math.min(100, (totals.invested / investPlan) * 100) : 0;
  const netWorth = (accounts || []).reduce((s, a) => s + Number(a.balance || 0), 0);

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
          <div className="fc-card-title">{t.accounts} — {fmtIDR(netWorth)}</div>
          <button className="fc-btn-ghost" onClick={onAddAccount}><Plus size={14} /> {t.addAccount}</button>
        </div>
        {(accounts || []).length === 0 ? <div className="fc-empty">{t.noAccounts}</div> : (
          <div className="fc-debt-list">
            {accounts.map(a => {
              const AccIcon = ACCOUNT_TYPE_ICONS[a.type] || Landmark;
              return (
                <div key={a.id} className="fc-debt-item">
                  <div className="fc-debt-top">
                    <div className="fc-debt-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="fc-legend-icon" style={{ borderColor: 'var(--fc-gold)' }}><AccIcon size={12} color="var(--fc-gold)" /></span>
                      {a.name}
                    </div>
                    <div className="fc-debt-actions">
                      <button className="fc-icon-btn" onClick={() => onEditAccount(a)}><Pencil size={14} /></button>
                      <button className="fc-icon-btn" onClick={() => onDeleteAccount(a.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="fc-debt-meta"><span>{fmtIDR(a.balance)}</span></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fc-card">
        <div className="fc-card-header">
          <div className="fc-card-title">{t.investPlan}</div>
          <button className="fc-btn-ghost" onClick={onEditInvestPlan}>{t.setInvestPlan}</button>
        </div>
        {investPlan > 0 ? (
          <div className="fc-debt-item" style={{ border: 'none', padding: 0 }}>
            <div className="fc-debt-bar-wrap"><div className="fc-debt-bar" style={{ width: `${investPct}%` }} /></div>
            <div className="fc-debt-meta">
              <span>{t.investRealized}: <b>{fmtIDR(totals.invested)}</b> {t.of} {fmtIDR(investPlan)}</span>
              <span>{investPct.toFixed(0)}%</span>
            </div>
          </div>
        ) : <div className="fc-empty">{t.noLimit}</div>}
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

      <AdvisorChat t={t} lang={lang} snapshot={{
        month: monthLabel,
        income: totals.income, expense: totals.expense, debtPaid: totals.debtPaid, invested: totals.invested, investable: totals.investable,
        healthScore: health?.score ?? null, healthLabel: health?.label ?? null,
        savingsRate: health?.savingsRate ?? null, debtRatio: health?.debtRatio ?? null, discRatio: health?.discRatio ?? null,
        categoryBreakdown: totals.byCatExpense,
        debts: debts.map(d => ({ name: d.name, remaining: d.remaining, total: d.total, monthlyPlan: d.monthlyPlan })),
        totalDebtRemaining, budgets, investmentPlanMonthly: investPlan,
      }} />
    </div>
  );
}

function AdvisorChat({ t, lang, snapshot }) {
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content}
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    setInput('');
    setError('');
    const newHistory = [...messages, { role: 'user', content: question }];
    setMessages(newHistory);
    setBusy(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('finance-advisor', {
        body: { question, snapshot, history: messages, lang },
      });
      if (fnError) throw fnError;
      if (data?.error || !data?.reply) { setError(t.advisorError); return; }
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(t.advisorError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fc-card">
      <div className="fc-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={16} color="var(--fc-gold)" /> {t.advisorTitle}
      </div>
      <div className="fc-field-note">{t.advisorDesc}</div>

      <div className="fc-advisor-log" ref={scrollRef}>
        {messages.length === 0 && !busy && (
          <div className="fc-advisor-suggestions">
            {[t.advisorSuggest1, t.advisorSuggest2, t.advisorSuggest3].map((s, i) => (
              <button key={i} type="button" className="fc-btn-ghost" onClick={() => setInput(s)}>{s}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`fc-advisor-msg ${m.role === 'user' ? 'fc-advisor-msg-user' : 'fc-advisor-msg-ai'}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="fc-advisor-msg fc-advisor-msg-ai fc-advisor-thinking">{t.advisorThinking}</div>}
      </div>

      {error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}

      <form onSubmit={handleSend} className="fc-advisor-input-row">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.advisorPlaceholder} className="fc-advisor-input" />
        <button type="submit" className="fc-btn-primary" disabled={busy || !input.trim()}>{t.advisorSend}</button>
      </form>
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
function TxModal({ t, lang, debts, accounts, presetDebtId, editingTx, onClose, onSave }) {
  const isEdit = !!editingTx?.id;
  const [type, setType] = useState(editingTx?.type || (presetDebtId ? 'debt_payment' : 'expense'));
  const [category, setCategory] = useState(editingTx?.category || EXPENSE_CATS[0]);
  const [debtId, setDebtId] = useState(editingTx?.debtId || presetDebtId || (debts[0]?.id || ''));
  const [accountId, setAccountId] = useState(editingTx?.accountId || '');
  const [date, setDate] = useState(editingTx?.date || todayISO());
  const [amount, setAmount] = useState(editingTx?.amount ?? '');
  const [note, setNote] = useState(editingTx?.note || '');
  const catOptions = type === 'income' ? INCOME_CATS : type === 'investment' ? INVESTMENT_CATS : EXPENSE_CATS;
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) { didInit.current = true; return; } // skip on first mount so edit prefill isn't wiped
    const opts = type === 'income' ? INCOME_CATS : type === 'investment' ? INVESTMENT_CATS : EXPENSE_CATS;
    setCategory(opts[0]);
  }, [type]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (type === 'debt_payment' && !debtId) return;
    const payload = { type, date, amount: Number(amount), note, category: type === 'debt_payment' ? null : category, debtId: type === 'debt_payment' ? debtId : null, accountId: accountId || null };
    if (isEdit) payload.id = editingTx.id;
    onSave(payload);
  }

  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{isEdit ? t.editTransaction : t.addTransaction}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
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
        {accounts && accounts.length > 0 && (
          <label className="fc-field"><span>{t.account}</span>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">{t.noAccount}</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
        )}
        <label className="fc-field"><span>{t.amount} (IDR)</span><MoneyInput value={amount} onChange={setAmount} required /></label>
        <label className="fc-field"><span>{t.note}</span><input type="text" value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <div className="fc-modal-actions">
          <button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button type="submit" className="fc-btn-primary">{t.save}</button>
        </div>
      </form>
    </div>
  );
}

function DebtModal({ t, editingDebt, onClose, onSave }) {
  const isEdit = !!editingDebt;
  const [name, setName] = useState(editingDebt?.name || '');
  const [total, setTotal] = useState(editingDebt?.total ?? '');
  const [remaining, setRemaining] = useState(editingDebt?.remaining ?? '');
  const [monthlyPlan, setMonthlyPlan] = useState(editingDebt?.monthlyPlan ?? '');
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !total) return;
    const payload = { name, total: Number(total), remaining: Number(remaining || total), monthlyPlan: monthlyPlan ? Number(monthlyPlan) : null };
    if (isEdit) payload.id = editingDebt.id;
    onSave(payload);
  }
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{isEdit ? t.editDebt : t.addDebt}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <label className="fc-field"><span>{t.debtName}</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label className="fc-field"><span>{t.totalDebt} (IDR)</span><MoneyInput value={total} onChange={setTotal} required /></label>
        <label className="fc-field"><span>{t.remaining} (IDR)</span><MoneyInput value={remaining} onChange={setRemaining} placeholder={fmtNumber(total) || '0'} /></label>
        <label className="fc-field"><span>{t.monthlyPlan} (IDR)</span><MoneyInput value={monthlyPlan} onChange={setMonthlyPlan} /></label>
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
            <MoneyInput value={local[c]} onChange={(v) => setLocal(prev => ({ ...prev, [c]: v }))} />
          </label>
        ))}
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button><button type="submit" className="fc-btn-primary">{t.save}</button></div>
      </form>
    </div>
  );
}

function InvestPlanModal({ t, currentPlan, onClose, onSave }) {
  const [plan, setPlan] = useState(currentPlan || '');
  function handleSubmit(e) {
    e.preventDefault();
    onSave(Number(plan) || 0);
  }
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{t.setInvestPlan}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <label className="fc-field"><span>{t.investPlanLabel} (IDR)</span><MoneyInput value={plan} onChange={setPlan} /></label>
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button><button type="submit" className="fc-btn-primary">{t.save}</button></div>
      </form>
    </div>
  );
}

function AccountModal({ t, editingAccount, onClose, onSave }) {
  const isEdit = !!editingAccount;
  const [name, setName] = useState(editingAccount?.name || '');
  const [type, setType] = useState(editingAccount?.type || 'bank');
  const [balance, setBalance] = useState(editingAccount?.balance ?? '');
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const payload = { name, type, balance: Number(balance) || 0 };
    if (isEdit) payload.id = editingAccount.id;
    onSave(payload);
  }
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{isEdit ? t.editAccount : t.addAccount}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <label className="fc-field"><span>{t.accountName}</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label className="fc-field"><span>{t.accountType}</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="bank">{t.accTypeBank}</option>
            <option value="ewallet">{t.accTypeEwallet}</option>
            <option value="cash">{t.accTypeCash}</option>
            <option value="other">{t.accTypeOther}</option>
          </select>
        </label>
        <label className="fc-field"><span>{t.accountBalance} (IDR)</span><MoneyInput value={balance} onChange={setBalance} /></label>
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button><button type="submit" className="fc-btn-primary">{t.save}</button></div>
      </form>
    </div>
  );
}

function RecurringListModal({ t, lang, items, debts, onClose, onAdd, onEdit, onDelete }) {
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <div className="fc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="fc-modal-header"><span>{t.manageRecurring}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="fc-field-note">{t.recurringAutoNote}</div>
        {items.length === 0 ? <div className="fc-empty">{t.noRecurring}</div> : (
          <div className="fc-debt-list">
            {items.map(r => (
              <div key={r.id} className="fc-debt-item">
                <div className="fc-debt-top">
                  <div className="fc-debt-name">
                    {r.type === 'debt_payment' ? (debts.find(d => d.id === r.debtId)?.name || t.debtPayment) : (t.categories[r.category] || r.note)}
                    {!r.active && <span style={{ color: 'var(--fc-text-dim)', fontWeight: 400 }}> ({t.inactive})</span>}
                  </div>
                  <div className="fc-debt-actions">
                    <button className="fc-icon-btn" onClick={() => onEdit(r)}><Pencil size={14} /></button>
                    <button className="fc-icon-btn" onClick={() => onDelete(r.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="fc-debt-meta">
                  <span>{fmtIDR(r.amount)} · {t.dayOfMonth} {r.dayOfMonth}</span>
                  <span>{t.nextDue}: {r.nextDueDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <button type="button" className="fc-btn-primary" style={{ justifyContent: 'center' }} onClick={onAdd}><Plus size={15} /> {t.addRecurring}</button>
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.close}</button></div>
      </div>
    </div>
  );
}

function RecurringModal({ t, debts, accounts, editingRecurring, onClose, onSave }) {
  const isEdit = !!editingRecurring;
  const [type, setType] = useState(editingRecurring?.type || 'expense');
  const [category, setCategory] = useState(editingRecurring?.category || EXPENSE_CATS[0]);
  const [debtId, setDebtId] = useState(editingRecurring?.debtId || (debts[0]?.id || ''));
  const [accountId, setAccountId] = useState(editingRecurring?.accountId || '');
  const [amount, setAmount] = useState(editingRecurring?.amount ?? '');
  const [note, setNote] = useState(editingRecurring?.note || '');
  const [dayOfMonth, setDayOfMonth] = useState(editingRecurring?.dayOfMonth ?? 1);
  const [active, setActive] = useState(editingRecurring?.active ?? true);
  const catOptions = type === 'income' ? INCOME_CATS : type === 'investment' ? INVESTMENT_CATS : EXPENSE_CATS;

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    if (type === 'debt_payment' && !debtId) return;
    const payload = {
      type, amount: Number(amount), note, dayOfMonth: Number(dayOfMonth),
      category: type === 'debt_payment' ? null : category, debtId: type === 'debt_payment' ? debtId : null, accountId: accountId || null, active,
    };
    if (isEdit) payload.id = editingRecurring.id;
    onSave(payload);
  }

  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="fc-modal-header"><span>{isEdit ? t.editRecurring : t.addRecurring}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="fc-type-toggle">
          {['income', 'expense', 'debt_payment', 'investment'].map(ty => (
            <button type="button" key={ty} className={`fc-type-btn ${type === ty ? 'fc-type-btn-active' : ''}`} onClick={() => setType(ty)}>{t[toCamel(ty)]}</button>
          ))}
        </div>
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
        {accounts && accounts.length > 0 && (
          <label className="fc-field"><span>{t.account}</span>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">{t.noAccount}</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
        )}
        <label className="fc-field"><span>{t.amount} (IDR)</span><MoneyInput value={amount} onChange={setAmount} required /></label>
        <label className="fc-field"><span>{t.dayOfMonth}</span>
          <select value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label className="fc-field"><span>{t.note}</span><input type="text" value={note} onChange={(e) => setNote(e.target.value)} /></label>
        {isEdit && (
          <label className="fc-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} style={{ width: 'auto' }} />
            <span>{t.active}</span>
          </label>
        )}
        <div className="fc-modal-actions"><button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button><button type="submit" className="fc-btn-primary">{t.save}</button></div>
      </form>
    </div>
  );
}

const CURRENCIES = ['IDR', 'USD', 'EUR', 'SGD', 'MYR'];

function OnboardingWizard({ t, theme, lang, onFinish }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [wizLang, setWizLang] = useState(lang);
  const [currency, setCurrency] = useState('IDR');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  function goStep2(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  }

  async function finish(e) {
    e.preventDefault();
    setSaving(true);
    setError(false);
    const trimmedName = name.trim();
    // Internal container label — not shown in UI, keeps the underlying data model intact.
    const internalSpace = `${trimmedName}'s space`;
    const ok = await onFinish({ name: trimmedName, space: internalSpace, newLang: wizLang, newCurrency: currency });
    setSaving(false);
    if (!ok) setError(true);
  }

  return (
    <div className="fc-wizard" data-theme={theme}>
      <style>{CSS}</style>
      <div className="fc-wizard-progress">
        <div className="fc-wizard-progress-bar" style={{ width: step === 1 ? '50%' : '100%' }} />
      </div>

      {step === 1 && (
        <form className="fc-wizard-screen" onSubmit={goStep2}>
          <div className="fc-wizard-body">
            <h1 className="fc-wizard-title">{t.wizNameTitle}</h1>
            <p className="fc-wizard-desc">{t.wizNameDesc}</p>
            <input
              type="text" className="fc-wizard-input" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.wizNamePlaceholder} autoFocus
            />
          </div>
          <div className="fc-wizard-actions">
            <button type="submit" className="fc-btn-primary fc-wizard-cta" disabled={!name.trim()}>{t.wizNameCta}</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="fc-wizard-screen" onSubmit={finish}>
          <div className="fc-wizard-body">
            <h1 className="fc-wizard-title">{t.wizSetupTitle}</h1>
            <p className="fc-wizard-desc">{t.wizSetupDesc}</p>

            <div className="fc-wizard-row">
              <div style={{ flex: 1 }}>
                <label className="fc-wizard-field-label">{t.wizLanguageLabel}</label>
                <select className="fc-wizard-select" value={wizLang} onChange={(e) => setWizLang(e.target.value)}>
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="fc-wizard-field-label">{t.wizCurrencyLabel}</label>
                <select className="fc-wizard-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="fc-wizard-error">{t.wizSaveError}</p>}
          </div>
          <div className="fc-wizard-actions">
            <button type="button" className="fc-btn-ghost fc-wizard-back" onClick={() => setStep(1)} disabled={saving}>{t.wizBack}</button>
            <button type="submit" className="fc-btn-primary fc-wizard-cta" disabled={saving}>{saving ? '...' : t.wizFinish}</button>
          </div>
        </form>
      )}
    </div>
  );
}

function OnboardingModal({ t, onDismiss }) {
  const items = [
    { icon: Sparkles, title: t.obQuickAddTitle, desc: t.obQuickAddDesc },
    { icon: Sparkles, title: t.obSplitBillTitle, desc: t.obSplitBillDesc },
    { icon: AlertCircle, title: t.obBudgetTitle, desc: t.obBudgetDesc },
    { icon: Landmark, title: t.obAccountsTitle, desc: t.obAccountsDesc },
    { icon: Repeat, title: t.obRecurringTitle, desc: t.obRecurringDesc },
    { icon: FileText, title: t.obReportTitle, desc: t.obReportDesc },
  ];
  return (
    <div className="fc-modal-backdrop" onClick={onDismiss}>
      <div className="fc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="fc-modal-header"><span>{t.obTitle}</span><button type="button" className="fc-icon-btn" onClick={onDismiss}><X size={16} /></button></div>
        <div className="fc-field-note">{t.obIntro}</div>
        <div className="fc-onboard-list">
          {items.map((it, i) => (
            <div key={i} className="fc-onboard-item">
              <span className="fc-legend-icon" style={{ borderColor: 'var(--fc-gold)', width: 30, height: 30, flexShrink: 0 }}>
                <it.icon size={15} color="var(--fc-gold)" />
              </span>
              <div>
                <div className="fc-onboard-item-title">{it.title}</div>
                <div className="fc-onboard-item-desc">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="fc-btn-primary" style={{ justifyContent: 'center' }} onClick={onDismiss}>{t.obStart}</button>
      </div>
    </div>
  );
}

function GmailSyncModal({ t, onClose, onImport }) {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('gmail-sync', { body: {} });
        if (fnError) throw fnError;
        if (data?.error === 'not_connected' || data?.error === 'reauth_required') { setError(t.gmailReauthNeeded); return; }
        if (data?.error) { setError(t.parseFailed); return; }
        const items = data?.candidates || [];
        setCandidates(items);
        const initChecked = {};
        items.forEach((c, i) => { initChecked[i] = true; });
        setChecked(initChecked);
      } catch (e) {
        setError(t.parseFailed);
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  function toggleChecked(i) {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  }

  function handleImport() {
    const selected = candidates
      .filter((_, i) => checked[i])
      .map(c => ({
        type: c.type === 'income' ? 'income' : 'expense',
        category: c.category && EXPENSE_CATS.includes(c.category) ? c.category : EXPENSE_CATS[0],
        amount: Number(c.amount) || 0,
        date: c.date || todayISO(),
        note: c.note || '',
        debtId: null, accountId: null,
      }))
      .filter(c => c.amount > 0);
    onImport(selected);
  }

  const selectedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <div className="fc-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="fc-modal-header"><span>{t.syncGmail}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        {busy && <div className="fc-empty">{t.gmailSyncing}</div>}
        {!busy && error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}
        {!busy && !error && candidates.length === 0 && <div className="fc-empty">{t.gmailNoNew}</div>}
        {!busy && !error && candidates.length > 0 && (
          <>
            <div className="fc-field-note">{t.gmailFoundCount.replace('{n}', candidates.length)}</div>
            <div className="fc-debt-list">
              {candidates.map((c, i) => (
                <label key={i} className="fc-debt-item" style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!checked[i]} onChange={() => toggleChecked(i)} style={{ width: 'auto', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="fc-debt-name">{c.note || (t.categories[c.category] || '-')}</div>
                    <div className="fc-debt-meta">
                      <span>{t[toCamel(c.type)] || c.type} · {c.date}</span>
                      <span style={{ color: c.type === 'income' ? '#7c9a72' : 'var(--fc-text)' }}>{fmtIDR(c.amount)}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
        <div className="fc-modal-actions">
          <button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button>
          {!busy && !error && candidates.length > 0 && (
            <button type="button" className="fc-btn-primary" onClick={handleImport} disabled={selectedCount === 0}>
              {t.importSelected.replace('{n}', selectedCount)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAddModal({ t, onClose, onParsed }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // data URL for display
  const [imageBase64, setImageBase64] = useState(null);   // raw base64, no prefix
  const [imageMediaType, setImageMediaType] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const { dataUrl, base64, mediaType: mt } = await resizeImageFile(file);
      setImagePreview(dataUrl);
      setImageBase64(base64);
      setImageMediaType(mt);
    } catch (e) {
      setError(t.parseFailed);
    }
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) { handleFile(file); e.preventDefault(); }
        break;
      }
    }
  }

  function clearImage() {
    setImagePreview(null); setImageBase64(null); setImageMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleParse(e) {
    e.preventDefault();
    if (!text.trim() && !imageBase64) return;
    setBusy(true); setError('');
    try {
      const body = {};
      if (text.trim()) body.text = text.trim();
      if (imageBase64) { body.image = imageBase64; body.mediaType = imageMediaType; }
      const { data, error: fnError } = await supabase.functions.invoke('parse-transaction', { body });
      if (fnError) throw fnError;
      if (!data || data.error === 'not_a_transaction') {
        setError(t.parseNotTx);
        return;
      }
      if (data.error) {
        setError(t.parseFailed);
        return;
      }
      onParsed({
        type: data.type === 'income' ? 'income' : 'expense',
        category: data.category && EXPENSE_CATS.includes(data.category) ? data.category : EXPENSE_CATS[0],
        amount: Number(data.amount) || '',
        date: data.date || todayISO(),
        note: data.note || '',
        debtId: null,
      });
    } catch (err) {
      setError(t.parseFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleParse} onPaste={handlePaste}>
        <div className="fc-modal-header"><span>{t.quickAdd}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="fc-field-note">{t.quickAddDesc}</div>

        {imagePreview ? (
          <div className="fc-image-preview-wrap">
            <img src={imagePreview} alt="screenshot" className="fc-image-preview" />
            <button type="button" className="fc-icon-btn fc-image-remove" onClick={clearImage}><X size={14} /></button>
          </div>
        ) : (
          <button type="button" className="fc-btn-ghost" style={{ justifyContent: 'center', display: 'flex', gap: 6 }} onClick={() => fileInputRef.current?.click()}>
            <Sparkles size={14} /> {t.uploadScreenshot}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />

        <div className="fc-field-note" style={{ textAlign: 'center' }}>{t.orPasteText}</div>

        <label className="fc-field">
          <span>{t.note}</span>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.pasteNotifPlaceholder} className="fc-textarea" />
        </label>
        {error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}
        <div className="fc-modal-actions">
          <button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button type="submit" className="fc-btn-primary" disabled={busy}>
            <Sparkles size={15} /> {busy ? t.parsing : t.parseBtn}
          </button>
        </div>
      </form>
    </div>
  );
}

function VoiceCaptureModal({ t, lang, onClose, onParsed }) {
  const [supported] = useState(() => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang === 'id' ? 'id-ID' : 'en-US';
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
    };
    rec.onerror = () => { setListening(false); setError(t.voiceError); };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch (e) { /* ignore */ } };
  }, [supported, lang, t.voiceError]);

  function toggleListening() {
    if (!recognitionRef.current) return;
    setError('');
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setListening(true);
    }
  }

  async function submitTranscript() {
    if (!transcript.trim()) return;
    setBusy(true); setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('parse-transaction', { body: { text: transcript.trim() } });
      if (fnError) throw fnError;
      if (!data || data.error === 'not_a_transaction') { setError(t.parseNotTx); return; }
      if (data.error) { setError(t.parseFailed); return; }
      onParsed({
        type: data.type === 'income' ? 'income' : 'expense',
        category: data.category && EXPENSE_CATS.includes(data.category) ? data.category : EXPENSE_CATS[0],
        amount: Number(data.amount) || '',
        date: data.date || todayISO(),
        note: data.note || '',
        debtId: null,
      });
    } catch (err) {
      setError(t.parseFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <div className="fc-modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <div className="fc-modal-header"><span>{t.voiceAdd}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>

        {!supported ? (
          <div className="fc-field-note" style={{ padding: '20px 0' }}>{t.voiceUnsupported}</div>
        ) : (
          <>
            <div className="fc-field-note" style={{ marginBottom: 18 }}>{t.voiceHint}</div>
            <button type="button" className={`fc-voice-circle ${listening ? 'fc-voice-circle-active' : ''}`} onClick={toggleListening}>
              <Mic size={26} />
              {listening ? <span className="fc-voice-pulse" /> : null}
              <span style={{ fontSize: 13 }}>{listening ? t.voiceListening : t.voiceTapToStart}</span>
            </button>
            {transcript && <div className="fc-voice-transcript">{transcript}</div>}
            {error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}
            <div className="fc-modal-actions">
              <button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button>
              <button type="button" className="fc-btn-primary" disabled={busy || !transcript.trim()} onClick={submitTranscript}>
                <Sparkles size={15} /> {busy ? t.parsing : t.parseBtn}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SplitBillModal({ t, lang, displayName, onClose, onParsed }) {
  const [myItems, setMyItems] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMediaType, setImageMediaType] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // holds parsed breakdown once available
  const [sharing, setSharing] = useState(false);
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  async function handleShareImage() {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
      canvas.toBlob(async (blob) => {
        if (!blob) { setSharing(false); return; }
        const fileName = `split-bill-${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: t.splitBill });
          } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = fileName;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        } catch (e) { /* user cancelled share sheet, ignore */ }
        setSharing(false);
      }, 'image/jpeg', 0.92);
    } catch (e) {
      setSharing(false);
    }
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const { dataUrl, base64, mediaType: mt } = await resizeImageFile(file);
      setImagePreview(dataUrl);
      setImageBase64(base64);
      setImageMediaType(mt);
    } catch (e) {
      setError(t.parseFailed);
    }
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) { handleFile(file); e.preventDefault(); }
        break;
      }
    }
  }

  function clearImage() {
    setImagePreview(null); setImageBase64(null); setImageMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSplit(e) {
    e.preventDefault();
    if (!imageBase64) { setError(t.uploadReceiptRequired); return; }
    if (!myItems.trim()) return;
    setBusy(true); setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('split-bill', {
        body: { image: imageBase64, mediaType: imageMediaType, myItems: myItems.trim() },
      });
      if (fnError) throw fnError;
      if (!data || data.error === 'not_a_receipt') { setError(t.splitNotReceipt); return; }
      if (data.error === 'items_not_found') { setError(t.splitItemsNotFound); return; }
      if (data.error) { setError(t.parseFailed); return; }
      setResult(data);
    } catch (err) {
      setError(t.parseFailed);
    } finally {
      setBusy(false);
    }
  }

  function handleConfirm() {
    if (!result) return;
    onParsed({
      type: 'expense',
      category: 'food',
      amount: Number(result.amount) || '',
      date: todayISO(),
      note: result.note || (Array.isArray(result.items) ? result.items.map(it => it.name || it).join(', ') : ''),
      debtId: null,
    });
  }

  // --- Breakdown / result screen (screenshot-friendly) ---
  if (result) {
    const b = result.breakdown || {};
    return (
      <div className="fc-modal-backdrop" onClick={onClose}>
        <div className="fc-modal" onClick={(e) => e.stopPropagation()}>
          <div className="fc-modal-header"><span>{t.splitResultTitle}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>

          <div className="fc-split-breakdown" ref={cardRef}>
            {result.mode === 'even' ? (
              <>
                <div className="fc-split-row">
                  <span>{t.splitBillTotal}</span>
                  <span>{fmtIDR(b.grandTotal)}</span>
                </div>
                <div className="fc-split-row fc-split-row-dim">
                  <span>{t.splitCountLabel}</span>
                  <span>{b.splitCount} {t.people}</span>
                </div>
              </>
            ) : (
              <>
                <div className="fc-split-items">
                  {(result.items || []).map((item, i) => (
                    <div key={i} className="fc-split-item-row">
                      <span>{item.name}</span>
                      <span>{fmtIDR(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="fc-split-row">
                  <span>{t.splitMySubtotal}</span>
                  <span>{fmtIDR(b.myItemsSubtotal)}</span>
                </div>
                <div className="fc-split-row fc-split-row-dim">
                  <span>{t.splitBillSubtotal}</span>
                  <span>{fmtIDR(b.subtotal)}</span>
                </div>
                <div className="fc-split-row fc-split-row-dim">
                  <span>{t.splitBillTotal}</span>
                  <span>{fmtIDR(b.grandTotal)}</span>
                </div>
                <div className="fc-split-row fc-split-row-dim">
                  <span>{t.splitMultiplier}</span>
                  <span>×{b.ratio}</span>
                </div>
              </>
            )}
            <div className="fc-split-final-row">
              <span>{displayName ? `${t.splitYourSharePrefix} ${displayName}` : t.splitYourShare}</span>
              <span>{fmtIDR(result.amount)}</span>
            </div>
          </div>

          <button type="button" className="fc-btn-ghost" style={{ justifyContent: 'center', display: 'flex', gap: 6 }} onClick={handleShareImage} disabled={sharing}>
            <Share2 size={14} /> {sharing ? t.parsing : t.shareImage}
          </button>

          <div className="fc-field-note" style={{ textAlign: 'center' }}>{t.splitScreenshotHint}</div>

          <div className="fc-modal-actions">
            <button type="button" className="fc-btn-ghost" onClick={() => setResult(null)}>{t.back}</button>
            <button type="button" className="fc-btn-primary" onClick={handleConfirm}>{t.addToTracker}</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Input screen ---
  return (
    <div className="fc-modal-backdrop" onClick={onClose}>
      <form className="fc-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSplit} onPaste={handlePaste}>
        <div className="fc-modal-header"><span>{t.splitBill}</span><button type="button" className="fc-icon-btn" onClick={onClose}><X size={16} /></button></div>
        <div className="fc-field-note">{t.splitBillDesc}</div>

        {imagePreview ? (
          <div className="fc-image-preview-wrap">
            <img src={imagePreview} alt="receipt" className="fc-image-preview" />
            <button type="button" className="fc-icon-btn fc-image-remove" onClick={clearImage}><X size={14} /></button>
          </div>
        ) : (
          <button type="button" className="fc-btn-ghost" style={{ justifyContent: 'center', display: 'flex', gap: 6 }} onClick={() => fileInputRef.current?.click()}>
            <Sparkles size={14} /> {t.uploadScreenshot}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />

        <label className="fc-field">
          <span>{t.myItemsLabel}</span>
          <textarea rows={3} value={myItems} onChange={(e) => setMyItems(e.target.value)} placeholder={t.myItemsPlaceholder} className="fc-textarea" required />
        </label>
        {error && <div className="fc-field-note" style={{ color: '#b0584f' }}>{error}</div>}
        <div className="fc-modal-actions">
          <button type="button" className="fc-btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button type="submit" className="fc-btn-primary" disabled={busy}>
            <Sparkles size={15} /> {busy ? t.parsing : t.splitBtn}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------
   Styles
--------------------------------------------------------- */
const CSS = `
.fc-app, .fc-authwrap, .fc-wizard {
  --fc-gold: #c9a977;
}
.fc-app[data-theme="dark"], .fc-authwrap[data-theme="dark"], .fc-wizard[data-theme="dark"] {
  --fc-bg: #0d0b09; --fc-surface: #17130f; --fc-surface2: #1f1a15; --fc-border: #2a231c;
  --fc-text: #f0ece4; --fc-text-dim: #9b9186; --fc-gold-bright: #e0c396;
}
.fc-app[data-theme="light"], .fc-authwrap[data-theme="light"], .fc-wizard[data-theme="light"] {
  --fc-bg: #f7f3ea; --fc-surface: #ffffff; --fc-surface2: #f1ebdc; --fc-border: #e2d8c3;
  --fc-text: #2b2418; --fc-text-dim: #78705f; --fc-gold-bright: #8a6a30;
}

* { box-sizing: border-box; }
.fc-app { background: var(--fc-bg); color: var(--fc-text); font-family: 'Calibri','Segoe UI',sans-serif; min-height: 100vh; }
.fc-authwrap { background: var(--fc-bg); min-height: 100vh; display:flex; align-items:center; justify-content:center; padding: 16px; font-family: 'Calibri','Segoe UI',sans-serif; }
.fc-wizard { background: var(--fc-bg); color: var(--fc-text); min-height: 100vh; font-family: 'Calibri','Segoe UI',sans-serif; display: flex; flex-direction: column; }
.fc-header { display:flex; align-items:center; justify-content:space-between; padding: max(20px, env(safe-area-inset-top)) 22px 16px; border-bottom: 1px solid var(--fc-border); }
.fc-brand { display:flex; align-items:center; gap: 12px; }
.fc-logo { height: 34px; width: auto; display:block; }
.fc-title { font-family: 'Cinzel', 'Calibri', serif; font-size: 19px; letter-spacing: 3px; color: var(--fc-gold-bright); text-transform: uppercase; line-height:1.1; font-weight: 600; }
.fc-subtitle { font-family: 'Cinzel', 'Calibri', serif; font-size: 9px; letter-spacing: 2px; color: var(--fc-text-dim); text-transform: uppercase; line-height:1.3; margin-top: 1px; }
.fc-trial-note { font-size: 10.5px; color: #c98f4f; margin-top: 2px; letter-spacing: 0.3px; }
.fc-lang-toggle { display:flex; align-items:center; gap:6px; background: var(--fc-surface); border: 1px solid var(--fc-border); color: var(--fc-text-dim); padding: 7px 12px; border-radius: 20px; font-size: 12px; cursor:pointer; letter-spacing:0.5px; }
.fc-lang-active { color: #c9a977; font-weight: 700; }
.fc-lang-sep { opacity: 0.4; }
.fc-tabs { display:flex; gap: 4px; padding: 10px 22px 0; overflow-x:auto; border-bottom: 1px solid var(--fc-border); }
.fc-tab { display:flex; align-items:center; gap:6px; background:none; border:none; color:var(--fc-text-dim); padding: 9px 14px; font-size: 13px; cursor:pointer; border-bottom: 2px solid transparent; white-space:nowrap; }
.fc-tab-active { color: #c9a977; border-bottom: 2px solid #c9a977; }
.fc-monthnav { display:flex; align-items:center; justify-content:center; gap: 16px; padding: 14px; }
.fc-monthnav button { background: var(--fc-surface); border:1px solid var(--fc-border); color:#c9a977; border-radius:6px; padding:5px 8px; cursor:pointer; display:flex; }
.fc-monthlabel { font-size: 17px; letter-spacing: 1px; color: var(--fc-text); min-width: 160px; text-align:center; }
.fc-body { padding: 4px 22px 90px; max-width: 1000px; margin: 0 auto; }
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
.fc-stat-value { font-family: 'Calibri','Segoe UI',sans-serif; font-size: 15px; color: var(--fc-text); margin-top:2px; font-weight:600; }
.fc-pie-row { display:grid; grid-template-columns: 1fr 220px; gap: 16px; align-items:center; }
@media (max-width: 640px) { .fc-pie-row { grid-template-columns: 1fr; } }
.fc-legend { display:flex; flex-direction:column; gap:8px; }
.fc-legend-item { display:flex; align-items:center; gap:8px; font-size: 12.5px; }
.fc-legend-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.fc-legend-icon { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--fc-surface); }
.fc-onboard-list { display: flex; flex-direction: column; gap: 12px; max-height: 50vh; overflow-y: auto; }
.fc-onboard-item { display: flex; gap: 10px; align-items: flex-start; }
.fc-onboard-item-title { font-size: 13px; font-weight: 700; color: var(--fc-text); margin-bottom: 2px; }
.fc-onboard-item-desc { font-size: 12px; color: var(--fc-text-dim); line-height: 1.5; }
.fc-toast { position: fixed; top: max(12px, env(safe-area-inset-top)); left: 50%; transform: translateX(-50%); z-index: 100; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
.fc-toast-success { background: #7c9a72; color: #14100c; }
.fc-toast-error { background: #b0584f; color: #fff; }
.fc-voice-circle { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 16px; background: var(--fc-surface); border: 1px dashed var(--fc-border); color: var(--fc-text); cursor: pointer; position: relative; transition: border-color 0.25s ease; }
.fc-voice-circle:hover { border-color: var(--fc-gold); }
.fc-voice-circle-active { border-style: solid; border-color: var(--fc-gold); }
.fc-voice-pulse { position: absolute; inset: -8px; border-radius: 50%; border: 2px solid var(--fc-gold); animation: fc-voice-pulse-anim 1.4s ease-out infinite; }
@keyframes fc-voice-pulse-anim { 0% { opacity: 0.7; transform: scale(0.9); } 100% { opacity: 0; transform: scale(1.25); } }
.fc-voice-transcript { font-size: 14px; color: var(--fc-text); background: var(--fc-surface2); border-radius: 10px; padding: 12px 14px; margin-bottom: 14px; text-align: left; line-height: 1.5; }

.fc-fab-wrap { position: fixed; right: 20px; bottom: max(20px, env(safe-area-inset-bottom)); z-index: 40; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.fc-fab-main { width: 58px; height: 58px; border-radius: 50%; background: var(--fc-gold, #c9a977); color: #14100c; border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(0,0,0,0.45); cursor: pointer; flex-shrink: 0; transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease; }
.fc-fab-main:active { transform: scale(0.88); }
.fc-fab-main:hover { transform: scale(1.1); box-shadow: 0 8px 22px rgba(0,0,0,0.5); }
.fc-fab-main-open:hover { transform: scale(1.1); }
.fc-fab-main-open { transform: scale(1.06); box-shadow: 0 8px 22px rgba(0,0,0,0.5); }
.fc-fab-icon { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.fc-fab-menu { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.fc-fab-mini { display: flex; align-items: center; gap: 8px; background: var(--fc-surface); border: 1px solid var(--fc-border); color: var(--fc-text); padding: 11px 18px; border-radius: 24px; box-shadow: 0 3px 12px rgba(0,0,0,0.35); font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer; opacity: 0; transform: translateY(10px) scale(0.85); animation: fcFabPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transition: transform 0.15s ease; }
.fc-fab-mini:active { transform: scale(0.94); }
.fc-fab-mini:hover { transform: scale(1.08) translateX(-2px); box-shadow: 0 5px 16px rgba(0,0,0,0.4); }
.fc-fab-mini-primary { border-color: var(--fc-gold); color: var(--fc-gold-bright); }
@keyframes fcFabPop { 0% { opacity: 0; transform: translateY(10px) scale(0.8); } 60% { opacity: 1; transform: translateY(-3px) scale(1.05); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.fc-advisor-log { display: flex; flex-direction: column; gap: 10px; max-height: 340px; overflow-y: auto; padding: 4px 0; }
.fc-advisor-suggestions { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.fc-advisor-msg { padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.55; max-width: 88%; white-space: pre-wrap; }
.fc-advisor-msg-user { align-self: flex-end; background: var(--fc-gold, #c9a977); color: #14100c; border-bottom-right-radius: 4px; }
.fc-advisor-msg-ai { align-self: flex-start; background: var(--fc-surface2); color: var(--fc-text); border-bottom-left-radius: 4px; }
.fc-advisor-thinking { opacity: 0.6; font-style: italic; }
.fc-advisor-input-row { display: flex; gap: 8px; margin-top: 10px; }
.fc-advisor-input { flex: 1; background: var(--fc-surface2); border: 1px solid var(--fc-border); color: var(--fc-text); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-family: 'Calibri','Segoe UI',sans-serif; }
.fc-legend-name { flex:1; color: var(--fc-text); }
.fc-legend-value { font-family: 'Calibri','Segoe UI',sans-serif; color: var(--fc-text-dim); }
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
.fc-greeting { font-size: 18px; font-weight: 600; color: var(--fc-gold-bright, #c9a977); margin-bottom: 12px; font-family: 'Calibri','Segoe UI',sans-serif; }
.fc-alert-banner { display:flex; align-items:center; gap: 10px; background: rgba(176,88,79,0.12); border: 1px solid rgba(176,88,79,0.35); color: #d99a91; padding: 12px 14px; border-radius: 10px; font-size: 12.5px; margin-bottom: 16px; line-height:1.5; }

/* Home V2 hierarchy */
.fc-home-hero { padding: 4px 0 22px; border-bottom: 1px solid var(--fc-border); margin-bottom: 20px; }
.fc-home-hero .fc-greeting { margin-bottom: 2px; }
.fc-greeting-sub { font-size: 13px; color: var(--fc-text-dim); margin-bottom: 22px; }
.fc-safe-block { margin-bottom: 10px; }
.fc-safe-label { font-size: 12px; letter-spacing: 0.6px; text-transform: uppercase; color: var(--fc-text-dim); margin-bottom: 6px; }
.fc-safe-amount { font-size: 38px; font-weight: 700; color: var(--fc-text); line-height: 1.1; letter-spacing: -0.5px; }
.fc-safe-sub { font-size: 12.5px; color: var(--fc-text-dim); margin-top: 6px; }
.fc-current-balance-row { font-size: 12.5px; color: var(--fc-text-dim); }
.fc-current-balance-row b { color: var(--fc-text); font-weight: 600; }
.fc-home-empty { padding: 18px 0 6px; }
.fc-home-empty-title { font-size: 19px; font-weight: 600; color: var(--fc-text); margin-bottom: 6px; }
.fc-home-empty-body { font-size: 13px; color: var(--fc-text-dim); }

.fc-section { margin-bottom: 22px; }
.fc-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.fc-section-title { font-size: 13px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: var(--fc-text-dim); margin-bottom: 10px; }
.fc-section-empty { font-size: 12.5px; color: var(--fc-text-dim); padding: 4px 0; }
.fc-link-btn { background: none; border: none; color: var(--fc-gold); font-size: 12.5px; cursor: pointer; padding: 0; }
.fc-link-btn:hover { text-decoration: underline; }

.fc-upcoming-list { display: flex; flex-direction: column; }
.fc-upcoming-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--fc-border); font-size: 13px; }
.fc-upcoming-item:last-child { border-bottom: none; }
.fc-upcoming-date { color: var(--fc-text-dim); font-size: 12px; width: 40px; flex-shrink: 0; }
.fc-upcoming-label { flex: 1; color: var(--fc-text); }
.fc-upcoming-amount { color: var(--fc-text); font-weight: 600; }

.fc-spend-total { font-size: 13px; color: var(--fc-text-dim); margin-bottom: 12px; }
.fc-spend-bars { display: flex; flex-direction: column; gap: 12px; }
.fc-spend-bar-row { display: grid; grid-template-columns: 90px 1fr 90px; align-items: center; gap: 10px; }
.fc-spend-bar-label { font-size: 12.5px; color: var(--fc-text-dim); }
.fc-spend-bar-track { height: 6px; background: var(--fc-surface2); border-radius: 3px; overflow: hidden; }
.fc-spend-bar-fill { height: 100%; background: var(--fc-gold-bright, #c9a977); border-radius: 3px; }
.fc-spend-bar-value { font-size: 12.5px; color: var(--fc-text); text-align: right; font-weight: 600; }

.fc-insight-banner { display: flex; align-items: flex-start; gap: 10px; background: var(--fc-surface); border: 1px solid var(--fc-border); border-radius: 12px; padding: 13px 14px; font-size: 12.5px; color: var(--fc-text); line-height: 1.5; margin-bottom: 20px; }

.fc-section-divider { font-size: 11px; letter-spacing: 0.8px; text-transform: uppercase; color: var(--fc-text-dim); text-align: center; margin: 8px 0 18px; position: relative; }
.fc-section-divider::before, .fc-section-divider::after { content: ''; display: inline-block; width: 30px; height: 1px; background: var(--fc-border); vertical-align: middle; margin: 0 10px; }
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
.fc-textarea { background: var(--fc-surface2); border: 1px solid var(--fc-border); color: var(--fc-text); padding: 9px 10px; border-radius: 8px; font-size: 14px; font-family: 'Calibri','Segoe UI',sans-serif; resize: vertical; }
.fc-image-preview-wrap { position: relative; border: 1px solid var(--fc-border); border-radius: 10px; overflow: hidden; }
.fc-image-preview { width: 100%; max-height: 220px; object-fit: contain; display: block; background: var(--fc-surface2); }
.fc-image-remove { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.6); border-radius: 50%; color: #fff; }
.fc-split-breakdown { background: var(--fc-surface2); border: 1px solid var(--fc-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.fc-split-items { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px; padding-bottom: 8px; border-bottom: 1px dashed var(--fc-border); }
.fc-split-item-row { font-size: 13.5px; color: var(--fc-text); display: flex; justify-content: space-between; gap: 10px; }
.fc-split-row { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--fc-text); }
.fc-split-row-dim { color: var(--fc-text-dim); font-size: 12px; }
.fc-split-final-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--fc-border); font-size: 15px; font-weight: 700; color: var(--fc-gold-bright, #c9a977); }
.fc-split-final-row span:last-child { font-family: 'Calibri','Segoe UI',sans-serif; font-size: 19px; }
.fc-field input:focus, .fc-field select:focus { outline: 1.5px solid #c9a977; }
.fc-field-note { font-size: 12px; color: var(--fc-text-dim); }
.fc-password-wrap { position: relative; display:flex; align-items:center; }
.fc-password-wrap input { width: 100%; padding-right: 38px; }
.fc-password-eye { position: absolute; right: 8px; background: none; border: none; color: var(--fc-text-dim); cursor: pointer; display:flex; padding: 4px; }
.fc-password-eye:hover { color: #c9a977; }
.fc-link-btn { background: none; border: none; color: #c9a977; font-size: 12px; text-align: left; cursor: pointer; padding: 0; margin-top: -4px; text-decoration: underline; text-underline-offset: 2px; }
.fc-modal-actions { display:flex; justify-content:flex-end; gap: 8px; margin-top: 6px; }

@media (max-width: 480px) {
  .fc-header { padding: max(14px, env(safe-area-inset-top)) 14px 12px; }
  .fc-logo { height: 28px; }
  .fc-title { font-size: 16px; letter-spacing: 2px; }
  .fc-subtitle { font-size: 8px; letter-spacing: 1.2px; }
  .fc-tabs { padding: 6px 14px 0; }
  .fc-tab { padding: 7px 10px; font-size: 12px; }
  .fc-monthnav { padding: 8px; gap: 10px; }
  .fc-monthlabel { font-size: 15px; min-width: 130px; }
  .fc-body { padding: 4px 14px 84px; }
  .fc-card { padding: 13px; margin-bottom: 12px; border-radius: 10px; }
  .fc-card-title { font-size: 15px; }
  .fc-card-header { margin-bottom: 10px; }
  .fc-stat-grid { gap: 8px; }
  .fc-stat { padding: 10px 11px; gap: 8px; }
  .fc-stat-label { font-size: 9.5px; }
  .fc-stat-value { font-size: 13.5px; }
  .fc-grid-2 { gap: 10px; margin-bottom: 12px; }
  .fc-gauge-card { padding-top: 4px; }
  .fc-gauge-wrap svg { width: 130px; height: 130px; }
  .fc-debt-list { gap: 10px; }
  .fc-debt-item { padding: 10px; }
  .fc-legend-item { font-size: 11.5px; }
  .fc-btn-ghost, .fc-btn-primary { padding: 8px 12px; font-size: 12px; }
  .fc-fab-main { width: 50px; height: 50px; }
  .fc-fab-wrap { right: 14px; }
}

/* Onboarding Wizard */
.fc-wizard-progress { height: 3px; background: var(--fc-border); width: 100%; }
.fc-wizard-progress-bar { height: 100%; background: var(--fc-gold-bright); transition: width 0.35s ease; }
.fc-wizard-screen { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: max(32px, env(safe-area-inset-top)) 26px max(24px, env(safe-area-inset-bottom)); }
.fc-wizard-body { display: flex; flex-direction: column; gap: 6px; padding-top: 12vh; }
.fc-wizard-title { font-family: 'Calibri','Segoe UI',sans-serif; font-size: 28px; font-weight: 700; line-height: 1.3; color: var(--fc-text); margin: 0 0 8px; letter-spacing: 0; }
.fc-wizard-desc { font-size: 14px; line-height: 1.6; color: var(--fc-text-dim); margin: 0 0 28px; max-width: 420px; }
.fc-wizard-error { font-size: 12.5px; color: #c9645c; margin: 14px 0 0; }
.fc-wizard-field-label { display: block; font-size: 12px; color: var(--fc-text-dim); margin: 18px 0 8px; text-transform: uppercase; letter-spacing: 1px; }
.fc-wizard-input, .fc-wizard-select {
  width: 100%; background: var(--fc-surface); border: 1px solid var(--fc-border); border-radius: 14px;
  color: var(--fc-text); font-size: 16px; padding: 16px 18px; font-family: inherit; outline: none;
}
.fc-wizard-input:focus, .fc-wizard-select:focus { border-color: var(--fc-gold); }
.fc-wizard-row { display: flex; gap: 12px; margin-top: 4px; }
.fc-wizard-actions { display: flex; gap: 10px; padding-top: 24px; }
.fc-wizard-cta { flex: 1; padding: 16px; font-size: 15px; border-radius: 14px; }
.fc-wizard-cta:disabled { opacity: 0.4; cursor: not-allowed; }
.fc-wizard-back { padding: 16px 20px; border-radius: 14px; }
`;
