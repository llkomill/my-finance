// Все даты операций хранятся строкой YYYY-MM-DD в локальном времени.

export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// toISOString() отдаёт дату по UTC, поэтому «сегодня» считаем по локальным часам.
export function todayISO() {
  return toISODate(new Date())
}

export function parseISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getDate() === day ? date : null
}

export function monthKey(value) {
  return value.slice(0, 7)
}

export function shiftMonth(key, delta) {
  const [year, month] = key.split('-').map(Number)
  return toISODate(new Date(year, month - 1 + delta, 1)).slice(0, 7)
}

// Сетка месяца с понедельника: 6 недель, включая дни соседних месяцев.
export function buildMonthGrid(key) {
  const [year, month] = key.split('-').map(Number)
  const first = new Date(year, month - 1, 1)
  const offset = (first.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month - 1, 1 - offset + index)
    return { iso: toISODate(date), day: date.getDate(), inMonth: date.getMonth() === month - 1 }
  })
}

export function formatMonth(key) {
  const [year, month] = key.split('-').map(Number)
  const label = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, 1))
    .replace(' г.', '')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatLongDate(value) {
  const date = parseISODate(value)
  if (!date) return 'Дата не указана'
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })
    .format(date)
}

// «Сегодня», «Вчера» или обычная дата — для заголовков групп по дням.
export function formatDayLabel(value) {
  const today = todayISO()
  const now = new Date()
  const yesterday = toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
  if (value === today) return 'Сегодня'
  if (value === yesterday) return 'Вчера'
  const date = parseISODate(value)
  if (!date) return 'Дата не указана'
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: sameYear ? undefined : 'numeric',
    weekday: 'short',
  }).format(date)
}
