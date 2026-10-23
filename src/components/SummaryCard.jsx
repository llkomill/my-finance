function SummaryCard({ title, amount, description, tone = 'slate', symbol }) {
  const tones = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-900',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 ring-rose-100 dark:ring-rose-900',
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 ring-blue-100 dark:ring-blue-900',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-700',
  }

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {amount}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <span className={`grid size-11 place-items-center rounded-xl text-lg font-bold ring-1 ${tones[tone]}`}>
          {symbol}
        </span>
      </div>
    </section>
  )
}

export default SummaryCard
