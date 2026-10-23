import { useSelector } from 'react-redux'
import SummaryCard from '../components/SummaryCard.jsx'
import { calculateTotals, groupExpensesByCategory } from '../utils/finance.js'
import { formatMoney } from '../utils/formatMoney.js'

function Statistics() {
  const operations = useSelector((state) => state.operations)
  const totals = calculateTotals(operations)
  const categoryTotals = groupExpensesByCategory(operations)
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const largestExpense = sortedCategories[0]

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">АНАЛИТИКА</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Статистика</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Сводка по всем операциям, которые есть в приложении.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard title="Доходы" amount={formatMoney(totals.income)} description="Поступления" tone="emerald" symbol="↗" />
        <SummaryCard title="Расходы" amount={formatMoney(totals.expenses)} description="Траты" tone="rose" symbol="↘" />
        <SummaryCard title="Разница" amount={formatMoney(totals.balance)} description="Остаток" tone="blue" symbol="±" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">Расходы по категориям</h2>

          {sortedCategories.length === 0 ? (
            <p className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-5 text-sm text-slate-500 dark:text-slate-400">Пока нет расходов для анализа.</p>
          ) : (
            <div className="mt-6 space-y-5">
              {sortedCategories.map(([category, amount]) => {
                const percentage = totals.expenses > 0 ? (amount / totals.expenses) * 100 : 0
                return (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{category}</span>
                      <span className="whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">{formatMoney(amount)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="mt-1 text-right text-xs text-slate-400">{percentage.toFixed(0)}% расходов</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold">Краткие выводы</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4">
              <p className="text-sm text-emerald-800 dark:text-emerald-300">Баланс</p>
              <p className="mt-1 text-lg font-bold text-emerald-900 dark:text-emerald-200">{formatMoney(totals.balance)}</p>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
                {totals.balance >= 0 ? 'Доходы не меньше расходов.' : 'Расходы превышают доходы.'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Самая затратная категория</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                {largestExpense ? largestExpense[0] : 'Пока нет данных'}
              </p>
              {largestExpense && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatMoney(largestExpense[1])}</p>}
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Всего операций</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{operations.length}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Statistics
