import { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router'
import OperationList from '../components/OperationList.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../components/Icons.jsx'
import { calculateTotals } from '../utils/finance.js'
import { formatMoney } from '../utils/formatMoney.js'
import {
  buildMonthGrid,
  formatLongDate,
  formatMonth,
  monthKey,
  parseISODate,
  shiftMonth,
  toISODate,
  todayISO,
} from '../utils/date.js'

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const compactNumber = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 })

function Calendar() {
  const operations = useSelector((state) => state.operations)
  const [searchParams, setSearchParams] = useSearchParams()
  const today = todayISO()
  const paramDate = searchParams.get('date')
  const selectedDate = parseISODate(paramDate) ? paramDate : today
  const [viewMonth, setViewMonth] = useState(monthKey(selectedDate))
  const detailsRef = useRef(null)

  // Суммы по каждому дню, чтобы отметить дни с операциями в календаре.
  const dayTotals = useMemo(() => {
    const map = new Map()
    for (const operation of operations) {
      const entry = map.get(operation.date) ?? { income: 0, expenses: 0, count: 0 }
      if (operation.type === 'income') entry.income += Number(operation.amount) || 0
      else entry.expenses += Number(operation.amount) || 0
      entry.count += 1
      map.set(operation.date, entry)
    }
    return map
  }, [operations])

  const grid = buildMonthGrid(viewMonth)
  const monthTotals = calculateTotals(operations.filter((operation) => operation.date?.startsWith(viewMonth)))
  const dayOperations = operations.filter((operation) => operation.date === selectedDate)
  const selectedTotals = calculateTotals(dayOperations)

  function selectDate(iso, { scroll = true } = {}) {
    if (!parseISODate(iso)) return
    setSearchParams({ date: iso }, { replace: true })
    setViewMonth(monthKey(iso))
    // На телефоне детали дня находятся под календарём — прокручиваем к ним.
    if (scroll && window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  function shiftDay(delta) {
    const date = parseISODate(selectedDate)
    date.setDate(date.getDate() + delta)
    selectDate(toISODate(date), { scroll: false })
  }

  const navButton =
    'grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="ИСТОРИЯ ПО ДНЯМ"
        title="Календарь"
        description="Нажмите на любую дату, чтобы увидеть операции за этот день."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-2 px-1">
            <button type="button" className={navButton} onClick={() => setViewMonth(shiftMonth(viewMonth, -1))} aria-label="Предыдущий месяц">
              <ChevronLeftIcon />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold sm:text-xl">{formatMonth(viewMonth)}</h2>
              {viewMonth !== monthKey(today) && (
                <button
                  type="button"
                  onClick={() => selectDate(today, { scroll: false })}
                  className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Вернуться к сегодня
                </button>
              )}
            </div>
            <button type="button" className={navButton} onClick={() => setViewMonth(shiftMonth(viewMonth, 1))} aria-label="Следующий месяц">
              <ChevronRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-slate-400 sm:gap-1.5 sm:text-xs">
            {weekDays.map((day, index) => (
              <div key={day} className={`py-1 ${index > 4 ? 'text-rose-400/80' : ''}`}>{day}</div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5" role="grid" aria-label={formatMonth(viewMonth)}>
            {grid.map((cell) => {
              const totals = dayTotals.get(cell.iso)
              const isSelected = cell.iso === selectedDate
              const isToday = cell.iso === today
              const isFuture = cell.iso > today
              return (
                <button
                  key={cell.iso}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  aria-label={`${formatLongDate(cell.iso)}${totals ? `, операций: ${totals.count}` : ''}`}
                  onClick={() => selectDate(cell.iso)}
                  className={`relative flex aspect-square flex-col items-center justify-start rounded-xl pt-1.5 text-sm transition sm:aspect-[1/0.9] sm:pt-2 ${
                    isSelected
                      ? 'bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/30'
                      : isToday
                        ? 'bg-emerald-50 font-bold text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800'
                        : totals
                          ? 'bg-slate-50 font-semibold hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  } ${!cell.inMonth && !isSelected ? 'opacity-35' : ''} ${isFuture && !isSelected && !totals ? 'text-slate-400 dark:text-slate-600' : ''}`}
                >
                  <span>{cell.day}</span>
                  {totals && (
                    <>
                      {/* Телефон: цветные точки. Планшет и ПК: суммы. */}
                      <span className="mt-1 flex gap-0.5 sm:hidden">
                        {totals.income > 0 && <span className={`size-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />}
                        {totals.expenses > 0 && <span className={`size-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-rose-500'}`} />}
                      </span>
                      <span className="mt-0.5 hidden flex-col text-[10px] font-semibold leading-tight sm:flex md:text-[11px]">
                        {totals.income > 0 && <span className={isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}>+{compactNumber.format(totals.income)}</span>}
                        {totals.expenses > 0 && <span className={isSelected ? 'text-white/80' : 'text-rose-500 dark:text-rose-400'}>−{compactNumber.format(totals.expenses)}</span>}
                      </span>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            <div className="rounded-xl bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/30">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Доходы за месяц</p>
              <p className="mt-0.5 truncate font-bold text-emerald-800 dark:text-emerald-300">{formatMoney(monthTotals.income)}</p>
            </div>
            <div className="rounded-xl bg-rose-50 px-3 py-2.5 dark:bg-rose-950/30">
              <p className="text-xs text-rose-700 dark:text-rose-400">Расходы за месяц</p>
              <p className="mt-0.5 truncate font-bold text-rose-800 dark:text-rose-300">{formatMoney(monthTotals.expenses)}</p>
            </div>
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 px-1 text-sm">
            <span className="font-medium text-slate-500 dark:text-slate-400">Перейти к дате</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => selectDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-base outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-emerald-900/60"
            />
          </label>
        </section>

        <section
          ref={detailsRef}
          className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-2">
            <button type="button" className={navButton} onClick={() => shiftDay(-1)} aria-label="Предыдущий день">
              <ChevronLeftIcon />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {selectedDate === today ? 'Сегодня' : selectedDate > today ? 'Запланировано' : 'Выбранный день'}
              </p>
              <h2 className="mt-0.5 text-lg font-bold first-letter:uppercase sm:text-xl">{formatLongDate(selectedDate)}</h2>
            </div>
            <button type="button" className={navButton} onClick={() => shiftDay(1)} aria-label="Следующий день">
              <ChevronRightIcon />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 px-2 py-2.5 dark:bg-slate-800/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Доходы</p>
              <p className="mt-0.5 truncate text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(selectedTotals.income)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-2.5 dark:bg-slate-800/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Расходы</p>
              <p className="mt-0.5 truncate text-sm font-bold text-rose-600 dark:text-rose-400">{formatMoney(selectedTotals.expenses)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-2 py-2.5 dark:bg-slate-800/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Итог дня</p>
              <p className="mt-0.5 truncate text-sm font-bold">{formatMoney(selectedTotals.balance)}</p>
            </div>
          </div>

          <div className="mt-5">
            <OperationList
              operations={dayOperations}
              hideDate
              emptyTitle="В этот день операций нет"
              emptyText="Выберите другую дату или добавьте операцию."
            />
          </div>

          <Link
            to="/operations"
            state={{ date: selectedDate }}
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            <PlusIcon className="size-4" /> Добавить операцию на этот день
          </Link>
        </section>
      </div>
    </div>
  )
}

export default Calendar
