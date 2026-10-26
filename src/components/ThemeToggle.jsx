import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import './ThemeToggle.css'

const STORAGE_KEY = 'finance-app-theme'
const THEME_DURATION = 1100
// Мягкий старт и долгое плавное торможение.
const THEME_EASING = 'cubic-bezier(0.45, 0, 0.15, 1)'
// Доля радиуса круга без размытия; остальное — мягкий край.
const SOFT_EDGE_START = 0.75

const stars = [
  { left: 24, top: 18, size: 8, delay: 0.1 },
  { left: 46, top: 44, size: 5, delay: 0.2 },
  { left: 30, top: 64, size: 6, delay: 0.3 },
  { left: 72, top: 24, size: 4, delay: 0.15 },
  { left: 88, top: 58, size: 7, delay: 0.25 },
  { left: 60, top: 72, size: 3, delay: 0.35 },
]

// Начальная тема уже выставлена скриптом в index.html, здесь читаем её с <html>.
function readInitialNight() {
  return document.documentElement.classList.contains('dark')
}

function ThemeToggle() {
  const [isNight, setIsNight] = useState(readInitialNight)
  const buttonRef = useRef(null)

  function applyTheme(next) {
    flushSync(() => setIsNight(next))
    document.documentElement.classList.toggle('dark', next)
  }

  function handleToggle() {
    const next = !isNight
    const root = document.documentElement

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next)
      return
    }

    // Браузер без View Transitions: плавно перетекают цвета всех элементов.
    if (!document.startViewTransition) {
      root.classList.add('theme-fading')
      applyTheme(next)
      setTimeout(() => root.classList.remove('theme-fading'), THEME_DURATION)
      return
    }

    // Новая тема раскрывается кругом с размытым краем из центра переключателя.
    const rect = buttonRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const farthestCorner = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    // Увеличиваем радиус, чтобы мягкий край тоже ушёл за пределы экрана.
    const radius = farthestCorner / SOFT_EDGE_START

    const transition = document.startViewTransition(() => applyTheme(next))

    // Если браузер пропустил переход (например, вкладка скрыта), тема уже применена.
    transition.ready.catch(() => {})
    transition.ready.then(() => {
      root.animate(
        {
          maskSize: ['0px 0px', `${radius * 2}px ${radius * 2}px`],
          maskPosition: [`${x}px ${y}px`, `${x - radius}px ${y - radius}px`],
        },
        {
          duration: THEME_DURATION,
          easing: THEME_EASING,
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isNight)
    // Цвет строки состояния телефона подстраивается под тему.
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isNight ? '#020617' : '#f8fafc')
    try {
      localStorage.setItem(STORAGE_KEY, isNight ? 'dark' : 'light')
    } catch {
      // Тема просто не запомнится, если localStorage недоступен.
    }
  }, [isNight])

  return (
    <div className="theme-toggle-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={isNight}
        aria-label="Переключить день и ночь"
        title={isNight ? 'Включить дневную тему' : 'Включить ночную тему'}
        ref={buttonRef}
        onClick={handleToggle}
        className={`theme-toggle ${isNight ? 'night' : ''}`}
      >
        <span className="halo" />
        <span className="knob">
          <span className="crater c1" />
          <span className="crater c2" />
          <span className="crater c3" />
        </span>
        <span className="cloud small" />
        <span className="cloud big" />
        {stars.map((star) => (
          <span
            key={`${star.left}-${star.top}`}
            className="star"
            style={{ left: star.left, top: star.top, '--s': `${star.size}px`, '--d': `${star.delay}s` }}
          />
        ))}
      </button>
    </div>
  )
}

export default ThemeToggle
