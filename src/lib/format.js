export const EXPENSE_CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Tagihan & Utilitas',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
]

export const INCOME_CATEGORIES = [
  'Gaji',
  'Bonus',
  'Investasi',
  'Hadiah',
  'Lainnya',
]

export const CATEGORY_COLORS = {
  'Makanan & Minuman': '#c88a3f',
  'Transportasi': '#7a8f6d',
  'Belanja': '#b0654f',
  'Tagihan & Utilitas': '#8a7a9e',
  'Hiburan': '#4f8fa3',
  'Kesehatan': '#a35f7a',
  'Pendidikan': '#5f8f7a',
  'Lainnya': '#8a8378',
  'Gaji': '#d4a24e',
  'Bonus': '#c9b458',
  'Investasi': '#9fae6a',
  'Hadiah': '#c17f5e',
}

export function formatIDR(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function formatDateID(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}
