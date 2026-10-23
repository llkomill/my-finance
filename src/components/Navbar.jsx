import { NavLink, Link } from 'react-router'
import ThemeToggle from './ThemeToggle.jsx'

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/operations', label: 'Операции' },
  { to: '/statistics', label: 'Статистика' },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3 self-start">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-xl text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            $
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">Личные финансы</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Ваш бюджет под вашим контролем</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Главная навигация">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
