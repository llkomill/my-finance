import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import SummaryCard from '../components/SummaryCard.jsx'
import OperationList from '../components/OperationList.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { PlusIcon } from '../components/Icons.jsx'
import { calculateTotals } from '../utils/finance.js'
import { formatMoney } from '../utils/formatMoney.js'
import { formatMonth, monthKey, todayISO } from '../utils/date.js'

function Home() {
  const operations = useSelector((state) => state.operations)
  const today = todayISO()
  const currentMonth = monthKey(today)
  const totals = calculateTotals(operations)
  const monthTotals = calculateTotals(operations.filter((operation) => operation.date?.startsWith(currentMonth)))
  const todayOperations = operations.filter((operation) => operation.date === today)
  const todayTotals = calculateTotals(todayOperations)

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="ОБЗОР ФИНАНСОВ"
        title="Всё под контролем"
        description="Следите за доходами и расходами в одном месте."
        action={
          <Link
            to="/operations"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700"
          >
            <PlusIcon className="size-5" /> Добавить операцию
          </Link>
        }
      />

      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white shadow-lg shadow-emerald-900/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-24 size-48 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-sm font-medium text-emerald-100">Текущий баланс</p>
          <p className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-5xl">{formatMoney(totals.balance)}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:max-w-md">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs text-emerald-100">↗ Доходы</p>
              <p className="mt-1 truncate font-semibold sm:text-lg">{formatMoney(totals.income)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xs text-emerald-100">↘ Расходы</p>
              <p className="mt-1 truncate font-semibold sm:text-lg">{formatMoney(totals.expenses)}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{formatMonth(currentMonth)}</h2>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <SummaryCard title="Доходы за месяц" amount={formatMoney(monthTotals.income)} tone="emerald" symbol="↗" />
          <SummaryCard title="Расходы за месяц" amount={formatMoney(monthTotals.expenses)} tone="rose" symbol="↘" />
          <Link to={`/calendar?date=${today}`} className="block transition hover:-translate-y-0.5 sm:col-span-2 lg:col-span-1">
            <SummaryCard
              title="Сегодня"
              amount={formatMoney(todayTotals.expenses)}
              description={todayOperations.length ? `Потрачено · операций: ${todayOperations.length}` : 'Сегодня операций нет'}
              tone="blue"
              symbol="📅"
            />
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">Последние операции</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Всего записей: {operations.length}</p>
          </div>
          <Link to="/operations" className="shrink-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Все →</Link>
        </div>
        <OperationList operations={operations} limit={5} />
      </section>
    </div>
  )
}

export default Home
