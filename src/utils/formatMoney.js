import { parseISODate } from './date.js'

export function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'TJS',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date) {
  const parsed = parseISODate(date)
  if (!parsed) return 'Дата не указана'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}
