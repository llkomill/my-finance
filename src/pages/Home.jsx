import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import SummaryCard from '../components/SummaryCard.jsx'
import OperationList from '../components/OperationList.jsx'
import { calculateTotals } from '../utils/finance.js'
import { formatMoney } from '../utils/formatMoney.js'

function Home() {
  const operations = useSelector((state) => state.operations)
  const totals = calculateTotals(operations)

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">ОБЗОР ФИНАНСОВ</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Всё под контролем</h1>
          <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400">Следите за доходами и расходами в одном месте.</p>
        </div>
        <Link to="/operations" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700">
          + Добавить операцию
        </Link>
      </section>

      <section className="rounded-2xl bg-green-800 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium text-slate-300">Текущий баланс</p>
        <p className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{formatMoney(totals.balance)}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard title="Доходы" amount={formatMoney(totals.income)} description="Все зарегистрированные доходы" tone="emerald" symbol="↗" />
        <SummaryCard title="Расходы" amount={formatMoney(totals.expenses)} description="Все зарегистрированные расходы" tone="rose" symbol="↘" />
        <SummaryCard title="Операции" amount={operations.length.toString()} description="Всего записей в журнале" tone="blue" symbol="≡" />
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Последние операции</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Недавно добавленные записи</p>
          </div>
          <Link to="/operations" className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800">Все операции →</Link>
        </div>
        <OperationList operations={operations} />
      </section>
    </div>
  )
}

export default Home
