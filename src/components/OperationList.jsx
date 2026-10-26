import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { deleteOperation } from '../redux/operationsSlice.js'
import { categoryIcon, groupByDate, operationTitle, sortByDate } from '../utils/finance.js'
import { formatDate, formatMoney } from '../utils/formatMoney.js'
import { formatDayLabel } from '../utils/date.js'
import { PencilIcon, TrashIcon } from './Icons.jsx'

function signedMoney(operation) {
  return `${operation.type === 'income' ? '+' : '−'}${formatMoney(operation.amount)}`
}

function OperationItem({ operation, onEdit, isEditing, hideDate }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const title = operationTitle(operation)

  function handleEdit() {
    if (onEdit) {
      onEdit(operation)
    } else {
      navigate('/operations', { state: { editId: operation.id } })
    }
  }

  function handleDelete() {
    if (window.confirm(`Удалить операцию «${title}» на ${formatMoney(operation.amount)}?`)) {
      dispatch(deleteOperation(operation.id))
    }
  }

  return (
    <article
      className={`group flex items-center gap-3 rounded-xl px-2 py-3 transition sm:px-3 ${
        isEditing ? 'bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:ring-emerald-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div
        className={`grid size-11 shrink-0 place-items-center rounded-xl text-xl ${
          operation.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'bg-rose-50 dark:bg-rose-950/40'
        }`}
        aria-hidden="true"
      >
        {categoryIcon(operation)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {operation.title ? operation.category : operation.type === 'income' ? 'Доход' : 'Расход'}
          {!hideDate && (
            <>
              {' · '}
              <Link
                to={`/calendar?date=${operation.date}`}
                className="underline decoration-dotted underline-offset-2 hover:text-emerald-600 dark:hover:text-emerald-400"
                title="Все операции за этот день"
              >
                {formatDate(operation.date)}
              </Link>
            </>
          )}
        </p>
        {operation.note && <p className="mt-1 line-clamp-2 text-xs text-slate-400 dark:text-slate-500">{operation.note}</p>}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className={`whitespace-nowrap text-sm font-bold sm:text-base ${
          operation.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
        }`}>
          {signedMoney(operation)}
        </p>
        <div className="flex gap-1 text-slate-400">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-md p-1 transition hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
            aria-label={`Изменить операцию ${title}`}
            title="Изменить"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md p-1 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            aria-label={`Удалить операцию ${title}`}
            title="Удалить"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
      <p className="text-3xl" aria-hidden="true">🗂️</p>
      <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  )
}

function OperationList({
  operations,
  limit,
  grouped = false,
  hideDate = false,
  onEdit,
  editingId,
  emptyTitle = 'Операций пока нет',
  emptyText = 'Добавьте первую операцию, чтобы увидеть её здесь.',
}) {
  if (operations.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyText} />
  }

  if (grouped) {
    return (
      <div className="-mx-2 space-y-5 sm:-mx-3">
        {groupByDate(operations).map((group) => (
          <section key={group.date}>
            <div className="mb-1 flex items-center justify-between gap-3 px-2 sm:px-3">
              <Link
                to={`/calendar?date=${group.date}`}
                className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
              >
                {formatDayLabel(group.date)}
              </Link>
              <span className={`text-xs font-semibold ${group.totals.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {group.totals.balance > 0 ? '+' : group.totals.balance < 0 ? '−' : ''}
                {formatMoney(Math.abs(group.totals.balance))}
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {group.items.map((operation) => (
                <OperationItem
                  key={operation.id}
                  operation={operation}
                  onEdit={onEdit}
                  isEditing={operation.id === editingId}
                  hideDate
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  }

  const sorted = sortByDate(operations)
  const visible = limit ? sorted.slice(0, limit) : sorted

  return (
    <div className="-mx-2 divide-y divide-slate-100 sm:-mx-3 dark:divide-slate-800/70">
      {visible.map((operation) => (
        <OperationItem
          key={operation.id}
          operation={operation}
          onEdit={onEdit}
          isEditing={operation.id === editingId}
          hideDate={hideDate}
        />
      ))}
    </div>
  )
}

export default OperationList
