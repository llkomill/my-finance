import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addOperation, updateOperation } from '../redux/operationsSlice.js'
import { categories } from '../utils/finance.js'
import { parseISODate, todayISO } from '../utils/date.js'

// Пользователь может ввести «1 250,50» — приводим к числу.
function parseAmount(value) {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return NaN
  return Number(normalized)
}

function OperationForm({ editingOperation, initialDate, onSaved, onCancel }) {
  const dispatch = useDispatch()
  const isEditing = Boolean(editingOperation)
  const [title, setTitle] = useState(editingOperation?.title ?? '')
  const [amount, setAmount] = useState(editingOperation ? String(editingOperation.amount) : '')
  const [type, setType] = useState(editingOperation?.type ?? 'expense')
  const [category, setCategory] = useState(editingOperation?.category ?? categories.expense[0])
  const [date, setDate] = useState(editingOperation?.date ?? (parseISODate(initialDate) ? initialDate : todayISO()))
  const [note, setNote] = useState(editingOperation?.note ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleTypeChange(nextType) {
    if (nextType === type) return
    setType(nextType)
    setCategory(categories[nextType][0])
  }

  function handleSubmit(event) {
    event.preventDefault()

    const numericAmount = parseAmount(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Введите сумму больше нуля, не более двух знаков после запятой.')
      return
    }

    if (!parseISODate(date)) {
      setError('Выберите дату операции.')
      return
    }

    const operation = {
      id: editingOperation?.id ?? crypto.randomUUID(),
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      date,
      note: note.trim(),
    }

    dispatch(isEditing ? updateOperation(operation) : addOperation(operation))

    setError('')
    if (!isEditing) {
      // Дату и тип оставляем: так удобнее вносить несколько операций подряд.
      setTitle('')
      setAmount('')
      setNote('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    onSaved?.(operation)
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-900/60'
  const labelClass = 'text-sm font-semibold text-slate-700 dark:text-slate-200'

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          aria-pressed={type === 'expense'}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === 'expense'
              ? 'bg-white text-rose-600 shadow-sm dark:bg-slate-950 dark:text-rose-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          − Расход
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          aria-pressed={type === 'income'}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            type === 'income'
              ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-950 dark:text-emerald-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          + Доход
        </button>
      </div>

      <label className="block space-y-1.5">
        <span className={labelClass}>Сумма, TJS</span>
        <input
          className={`${inputClass} text-lg font-semibold sm:text-lg`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0,00"
        />
      </label>

      <label className="block space-y-1.5">
        <span className={labelClass}>
          Название <span className="font-normal text-slate-400">— необязательно</span>
        </span>
        <input
          className={inputClass}
          type="text"
          value={title}
          maxLength={60}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={type === 'expense' ? 'Например, продукты' : 'Например, аванс'}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block min-w-0 space-y-1.5">
          <span className={labelClass}>Категория</span>
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

        <label className="block min-w-0 space-y-1.5">
          <span className={labelClass}>Дата</span>
          <input
            className={inputClass}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className={labelClass}>
          Заметка <span className="font-normal text-slate-400">— необязательно</span>
        </span>
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={note}
          maxLength={200}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Комментарий к операции"
        />
      </label>

      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">{error}</p>}
      {saved && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">Операция добавлена</p>}

      <div className="flex gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Отмена
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 active:scale-[0.99] dark:focus:ring-emerald-900"
        >
          {isEditing ? 'Сохранить изменения' : 'Добавить операцию'}
        </button>
      </div>
    </form>
  )
}

export default OperationForm
