import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import OperationForm from '../components/OperationForm.jsx'
import OperationList from '../components/OperationList.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { SearchIcon } from '../components/Icons.jsx'

const filters = [
  { value: 'all', label: 'Все' },
  { value: 'income', label: 'Доходы' },
  { value: 'expense', label: 'Расходы' },
]

function Operations() {
  const operations = useSelector((state) => state.operations)
  const location = useLocation()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  // Другие страницы открывают операцию на редактирование или форму на нужную дату через state ссылки.
  const [editingId, setEditingId] = useState(location.state?.editId ?? null)
  const editingOperation = operations.find((operation) => operation.id === editingId)

  function handleEdit(operation) {
    setEditingId(operation.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredOperations = useMemo(() => {
    const query = search.toLowerCase().trim()
    return operations.filter((operation) => {
      const matchesType = filter === 'all' || operation.type === filter
      const matchesSearch = `${operation.title ?? ''} ${operation.category ?? ''} ${operation.note ?? ''}`
        .toLowerCase()
        .includes(query)
      return matchesType && matchesSearch
    })
  }, [operations, filter, search])

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="ЖУРНАЛ"
        title="Операции"
        description="Добавляйте доходы и расходы, ищите, редактируйте и удаляйте записи."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-bold sm:text-xl">
            {editingOperation ? 'Редактирование' : 'Новая операция'}
          </h2>
          <OperationForm
            key={editingOperation?.id ?? 'new'}
            editingOperation={editingOperation}
            initialDate={location.state?.date}
            onSaved={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold sm:text-xl">История операций</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Найдено: {filteredOperations.length}</p>
          </div>

          <div className="relative mb-3">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-900/60"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по названию, категории, заметке"
            />
          </div>

          <div className="mb-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 sm:inline-grid dark:bg-slate-800">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === item.value
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <OperationList
            operations={filteredOperations}
            grouped
            onEdit={handleEdit}
            editingId={editingId}
            emptyTitle={operations.length ? 'Ничего не найдено' : 'Операций пока нет'}
            emptyText={operations.length ? 'Измените запрос или фильтр.' : 'Добавьте первую операцию с помощью формы.'}
          />
        </section>
      </div>
    </div>
  )
}

export default Operations
