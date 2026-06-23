import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Home', emoji: '🏠' },
  { path: '/learn', label: 'Letters', emoji: '🔤' },
  { path: '/words', label: 'Words', emoji: '📖' },
  { path: '/quiz', label: 'Quiz', emoji: '🎯' },
  { path: '/progress', label: 'Progress', emoji: '⭐' },
]

export default function NavBar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-2 border-violet-100 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px] ${
                active
                  ? 'bg-violet-100 text-violet-700 scale-110'
                  : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className={`text-xs font-bold ${active ? 'text-violet-700' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
