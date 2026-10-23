export function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'TJS',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date) {
  if (!date) return 'Дата не указана'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}
  