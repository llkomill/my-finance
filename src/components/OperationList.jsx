import { useDispatch } from 'react-redux'
import { deleteOperation } from '../redux/operationsSlice.js'
import { formatDate, formatMoney } from '../utils/formatMoney.js'

function OperationList({ operations, showAll = false }) {
  const dispatch = useDispatch()
  const visibleOperations = showAll ? operations : operations.slice(0, 5)

  if (visibleOperations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-5 py-10 text-center">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Операций пока нет</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Добавьте первую операцию, чтобы увидеть её здесь.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {visibleOperations.map((operation) => (
        <article
          key={operation.id}
          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
        >
          <div className={`grid size-11 shrink-0 place-items-center rounded-xl text-lg font-bold ${
            operation.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
          }`}>
            {operation.type === 'income' ? '+' : '−'}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{operation.title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {operation.category} · {formatDate(operation.date)}
            </p>
          </div>

          <div className="text-right">
            <p className={`whitespace-nowrap font-bold ${
              operation.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
            }`}>
              {operation.type === 'income' ? '+' : '−'}{formatMoney(operation.amount)}
            </p>
            <div className="mt-1 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => dispatch(deleteOperation(operation.id))}
                className="text-xs text-slate-400 transition hover:text-rose-600"
                aria-label={`Удалить операцию ${operation.title}`}
              >
                Удалить
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default OperationList
