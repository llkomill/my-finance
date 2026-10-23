import { BrowserRouter, Route, Routes } from 'react-router'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Operations from './pages/Operations.jsx'
import Statistics from './pages/Statistics.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="flex justify-between gap-4 border-t border-slate-200 px-10 py-5 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span>Личные финансы</span>
          <span>Управляй деньгами осознанно</span>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
