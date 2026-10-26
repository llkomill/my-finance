function PageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-slate-500 sm:text-base dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </section>
  )
}

export default PageHeader
