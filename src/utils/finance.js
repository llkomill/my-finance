export const categories = {
  expense: ['Еда', 'Транспорт', 'Жильё', 'Покупки', 'Здоровье', 'Развлечения', 'Другое'],
  income: ['Зарплата', 'Фриланс', 'Дополнительный доход', 'Подарок', 'Другое'],
}

const categoryIcons = {
  expense: {
    Еда: '🍔',
    Транспорт: '🚕',
    Жильё: '🏠',
    Покупки: '🛍️',
    Здоровье: '💊',
    Развлечения: '🎬',
  },
  income: {
    Зарплата: '💼',
    Фриланс: '💻',
    'Дополнительный доход': '💰',
    Подарок: '🎁',
  },
}

export function categoryIcon(operation) {
  return categoryIcons[operation.type]?.[operation.category] ?? (operation.type === 'income' ? '✨' : '📦')
}

export function operationTitle(operation) {
  return operation.title || operation.category || 'Без названия'
}

// Копейки складываются без накопления ошибок плавающей точки.
function round(value) {
  return Math.round(value * 100) / 100
}

export function calculateTotals(operations) {
  const totals = operations.reduce(
    (sums, operation) => {
      const amount = Number(operation.amount) || 0
      if (operation.type === 'income') {
        sums.income += amount
      } else {
        sums.expenses += amount
      }
      return sums
    },
    { income: 0, expenses: 0 },
  )

  return {
    income: round(totals.income),
    expenses: round(totals.expenses),
    balance: round(totals.income - totals.expenses),
  }
}

export function groupExpensesByCategory(operations) {
  return operations
    .filter((operation) => operation.type === 'expense')
    .reduce((groups, operation) => {
      const category = operation.category || 'Без категории'
      groups[category] = round((groups[category] || 0) + (Number(operation.amount) || 0))
      return groups
    }, {})
}

// Новые даты сверху. Сортировка стабильна, поэтому внутри одного дня
// сохраняется порядок добавления (последняя добавленная — первой).
export function sortByDate(operations) {
  return [...operations].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function groupByDate(operations) {
  const groups = new Map()
  for (const operation of sortByDate(operations)) {
    const list = groups.get(operation.date) ?? []
    list.push(operation)
    groups.set(operation.date, list)
  }
  return [...groups.entries()].map(([date, items]) => ({ date, items, totals: calculateTotals(items) }))
}
