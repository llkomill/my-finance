export function calculateTotals(operations) {
  return operations.reduce(
    (totals, operation) => {
      if (operation.type === 'income') {
        totals.income += Number(operation.amount)
      } else {
        totals.expenses += Number(operation.amount)
      }

      totals.balance = totals.income - totals.expenses
      return totals
    },
    { income: 0, expenses: 0, balance: 0 },
  )
}

export function groupExpensesByCategory(operations) {
  return operations
    .filter((operation) => operation.type === 'expense')
    .reduce((groups, operation) => {
      const category = operation.category || 'Без категории'
      groups[category] = (groups[category] || 0) + Number(operation.amount)
      return groups
    }, {})
}
