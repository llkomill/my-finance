import { Link } from 'react-router'

function NotFound() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">404</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Страница не найдена</h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400">Проверьте адрес или вернитесь на главную.</p>
      <Link to="/" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
        На главную
      </Link>
    </section>
  )
}

export default NotFound
