import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import OperationForm from '../components/OperationForm.jsx'
import OperationList from '../components/OperationList.jsx'

function Operations() {
  const operations = useSelector((state) => state.operations)
  const location = useLocation()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  // Главная страница может открыть операцию на редактирование через state ссылки.
  const [editingId, setEditingId] = useState(location.state?.editId ?? null)
  const editingOperation = operations.find((operation) => operation.id === editingId)

  function handleEdit(operation) {
    setEditingId(operation.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredOperations = useMemo(() => {
    return operations.filter((operation) => {
      const matchesType = filter === 'all' || operation.type === filter
      const matchesSearch = `${operation.title} ${operation.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim())
      return matchesType && matchesSearch
    })
  }, [operations, filter, search])

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">ЖУРНАЛ</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Операции</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Добавляйте доходы и расходы, ищите записи и удаляйте ненужные.</p>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-bold">
            {editingOperation ? 'Редактирование операции' : 'Новая операция'}
          </h2>
          <OperationForm
            key={editingOperation?.id ?? 'new'}
            editingOperation={editingOperation}
            onSaved={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold">История операций</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Найдено: {filteredOperations.length}</p>
          </div>

          <input
            className="mb-4 w-full rounded-xl border border-slate-200 dark:border-slate-800 px-3.5 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по названию или категории"
          />

          <div className="mb-5 flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Все' },
              { value: 'income', label: 'Доходы' },
              { value: 'expense', label: 'Расходы' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  filter === item.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <OperationList
            operations={filteredOperations}
            showAll
            onEdit={handleEdit}
            editingId={editingId}
          />
        </section>
      </div>
    </div>
  )
}

export default Operations
