import { useState } from 'react'
import { useSelector } from 'react-redux'
import SummaryCard from '../components/SummaryCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { calculateTotals, categoryIcon, groupExpensesByCategory } from '../utils/finance.js'
import { formatMoney } from '../utils/formatMoney.js'
import { monthKey, parseISODate, shiftMonth, todayISO } from '../utils/date.js'

const barColors = ['bg-emerald-500', 'bg-teal-500', 'bg-sky-500', 'bg-indigo-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500']

function daysBetween(fromIso, toIso) {
  return Math.round((parseISODate(toIso) - parseISODate(fromIso)) / 86400000) + 1
}

function Statistics() {
  const operations = useSelector((state) => state.operations)
  const [period, setPeriod] = useState('month')
  const today = todayISO()
  const currentMonth = monthKey(today)
  const previousMonth = shiftMonth(currentMonth, -1)

  const periods = [
    { value: 'month', label: 'Этот месяц', prefix: currentMonth },
    { value: 'previous', label: 'Прошлый месяц', prefix: previousMonth },
    { value: 'all', label: 'Всё время', prefix: '' },
  ]
  const activePeriod = periods.find((item) => item.value === period)
  const periodOperations = operations.filter((operation) => operation.date?.startsWith(activePeriod.prefix))

  const totals = calculateTotals(periodOperations)
  const categoryTotals = groupExpensesByCategory(periodOperations)
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const largestExpense = sortedCategories[0]

  // Число дней периода для среднего расхода в день (будущие дни не считаем).
  let periodDays = 0
  if (period === 'month') {
    periodDays = Number(today.slice(8, 10))
  } else if (period === 'previous') {
    const [year, month] = previousMonth.split('-').map(Number)
    periodDays = new Date(year, month, 0).getDate()
  } else if (periodOperations.length) {
    const firstDate = periodOperations.reduce((min, operation) => (operation.date < min ? operation.date : min), today)
    periodDays = Math.max(1, daysBetween(firstDate, today))
  }
  const averagePerDay = periodDays ? totals.expenses / periodDays : 0
  const savingsRate = totals.income > 0 ? Math.round((totals.balance / totals.income) * 100) : null

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="АНАЛИТИКА"
        title="Статистика"
        description="Сводка по доходам и расходам за выбранный период."
      />

      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-grid dark:bg-slate-800">
        {periods.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setPeriod(item.value)}
            aria-pressed={period === item.value}
            className={`rounded-lg px-2 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
              period === item.value
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <SummaryCard title="Доходы" amount={formatMoney(totals.income)} description="Поступления" tone="emerald" symbol="↗" />
        <SummaryCard title="Расходы" amount={formatMoney(totals.expenses)} description="Траты" tone="rose" symbol="↘" />
        <div className="sm:col-span-2 lg:col-span-1">
          <SummaryCard
            title="Разница"
            amount={formatMoney(totals.balance)}
            description={totals.balance >= 0 ? 'Остаток' : 'Перерасход'}
            tone={totals.balance >= 0 ? 'blue' : 'rose'}
            symbol="±"
          />
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold sm:text-xl">Расходы по категориям</h2>

          {sortedCategories.length === 0 ? (
            <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">За этот период расходов нет.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {sortedCategories.map(([category, amount], index) => {
                const percentage = totals.expenses > 0 ? (amount / totals.expenses) * 100 : 0
                return (
                  <div key={category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                        <span aria-hidden="true">{categoryIcon({ type: 'expense', category })}</span>
                        <span className="truncate">{category}</span>
                      </span>
                      <span className="whitespace-nowrap font-semibold text-slate-900 dark:text-slate-100">
                        {formatMoney(amount)}
                        <span className="ml-2 text-xs font-medium text-slate-400">{percentage.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={`h-full rounded-full ${barColors[index % barColors.length]}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold sm:text-xl">Краткие выводы</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className={`rounded-xl p-4 sm:col-span-2 lg:col-span-1 ${totals.balance >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-rose-50 dark:bg-rose-950/40'}`}>
              <p className={`text-sm ${totals.balance >= 0 ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>Баланс за период</p>
              <p className={`mt-1 text-lg font-bold ${totals.balance >= 0 ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}`}>{formatMoney(totals.balance)}</p>
              <p className={`mt-1 text-sm ${totals.balance >= 0 ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                {periodOperations.length === 0
                  ? 'Операций за период нет.'
                  : totals.balance >= 0
                    ? `Доходы не меньше расходов${savingsRate !== null ? ` · отложено ${savingsRate}% дохода` : ''}.`
                    : 'Расходы превышают доходы.'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">Самая затратная категория</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                {largestExpense ? largestExpense[0] : 'Пока нет данных'}
              </p>
              {largestExpense && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatMoney(largestExpense[1])}</p>}
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">Средний расход в день</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{formatMoney(averagePerDay)}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Операций за период: {periodOperations.length}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Statistics
