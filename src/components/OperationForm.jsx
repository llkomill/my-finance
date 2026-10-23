import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addOperation } from '../redux/operationsSlice.js'

const categories = {
  expense: ['Еда', 'Транспорт', 'Жильё', 'Покупки', 'Здоровье', 'Развлечения', 'Другое'],
  income: ['Зарплата', 'Фриланс', 'Дополнительный доход', 'Подарок', 'Другое'],
}

function OperationForm() {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Еда')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  function handleTypeChange(nextType) {
    setType(nextType)
    setCategory(categories[nextType][0])
  }

  function handleSubmit(event) {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Сумма должна быть больше нуля.')
      return
    }

    if (!date) {
      setError('Выберите дату операции.')
      return
    }

    const operation = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      date,
      note: note.trim(),
    }

    dispatch(addOperation(operation))

    setTitle('')
    setAmount('')
    setNote('')
    setError('')
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === 'expense'
              ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          − Расход
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === 'income'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          + Доход
        </button>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Сумма (TJS)</span>
        <input
          className={inputClass}
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Категория</span>
          <select
            className={inputClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories[type].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Дата</span>
          <input
            className={inputClass}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>

      {error && <p role="alert" className="text-sm font-medium text-rose-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
      >
        Добавить операцию
      </button>
    </form>
  )
}

export default OperationForm
