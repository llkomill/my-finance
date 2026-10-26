import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Operations from './pages/Operations.jsx'
import Calendar from './pages/Calendar.jsx'
import Statistics from './pages/Statistics.jsx'
import NotFound from './pages/NotFound.jsx'

// При переходе между страницами начинаем с верха, а не с прошлой прокрутки.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-10 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="hidden border-t border-slate-200 md:block dark:border-slate-800">
          <div className="mx-auto flex max-w-6xl justify-between gap-4 px-4 py-5 text-xs text-slate-400 sm:px-6 lg:px-8 dark:text-slate-500">
            <span>Личные финансы</span>
            <span>Управляй деньгами осознанно</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
