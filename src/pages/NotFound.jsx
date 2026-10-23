import { Link } from 'react-router'

function NotFound() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <p className="text-sm font-bold text-emerald-700">404</p>
      <h1 className="mt-2 text-3xl font-bold">Страница не найдена</h1>
      <p className="mt-3 text-slate-500">Проверьте адрес или вернитесь на главную.</p>
      <Link to="/" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
        На главную
      </Link>
    </section>
  )
}

export default NotFound
