import { NavLink, Link } from 'react-router'
import ThemeToggle from './ThemeToggle.jsx'
import { CalendarIcon, ChartIcon, HomeIcon, ListIcon } from './Icons.jsx'

const navItems = [
  { to: '/', label: 'Главная', end: true, icon: HomeIcon },
  { to: '/operations', label: 'Операции', icon: ListIcon },
  { to: '/calendar', label: 'По дням', icon: CalendarIcon },
  { to: '/statistics', label: 'Статистика', icon: ChartIcon },
]

function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src="/favicon.svg" alt="" className="size-10 shrink-0 rounded-xl shadow-sm shadow-emerald-600/30" />
            <span className="min-w-0">
              <span className="block truncate text-base font-bold tracking-tight sm:text-lg">Личные финансы</span>
              <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">Ваш бюджет под вашим контролем</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Главная навигация">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      {/* Нижняя панель навигации на телефонах */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/80 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden dark:border-slate-800/80 dark:bg-slate-950/90"
        aria-label="Навигация"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-7 w-12 place-items-center rounded-full transition ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''}`}>
                    <item.icon className="size-5" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Navbar
