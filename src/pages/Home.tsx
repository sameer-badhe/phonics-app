import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadLocalProgress, type ProgressRecord } from '../services/supabase'
import NavBar from '../components/NavBar'

const menuItems = [
  {
    path: '/learn',
    emoji: '🔤',
    label: 'Learn Letters',
    desc: 'A to Z sounds & words',
    color: 'from-violet-400 to-purple-600',
    shadow: 'shadow-violet-300',
    hover: 'hover:shadow-violet-400',
  },
  {
    path: '/words',
    emoji: '📖',
    label: 'Practice Words',
    desc: 'Simple phonics words',
    color: 'from-pink-400 to-rose-500',
    shadow: 'shadow-pink-300',
    hover: 'hover:shadow-pink-400',
  },
  {
    path: '/quiz',
    emoji: '🎯',
    label: 'Quiz Time!',
    desc: 'Test your knowledge',
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-300',
    hover: 'hover:shadow-amber-400',
  },
  {
    path: '/progress',
    emoji: '⭐',
    label: 'My Progress',
    desc: 'See your stars',
    color: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-300',
    hover: 'hover:shadow-emerald-400',
  },
]

export default function Home() {
  const [progress, setProgress] = useState<ProgressRecord | null>(null)

  useEffect(() => {
    loadLocalProgress().then(setProgress)
  }, [])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-white px-6 pt-12 pb-16 text-center relative overflow-hidden">
        {/* Decorative bubbles */}
        <div className="absolute top-4 left-4 text-6xl opacity-20 animate-float">🌟</div>
        <div className="absolute top-8 right-6 text-5xl opacity-20 animate-bounce-slow">🎈</div>
        <div className="absolute bottom-4 left-8 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-2 right-4 text-5xl opacity-20 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🦋</div>

        <div className="relative z-10">
          <div className="text-6xl mb-3 animate-bounce-slow">📚</div>
          <h1 className="font-fredoka text-4xl font-black mb-2 drop-shadow-lg">
            Phonics Learning!
          </h1>
          <p className="text-violet-200 text-lg font-semibold">
            Let's learn letters, sounds & words! 🌈
          </p>
          {progress && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2">
              <span className="text-yellow-300 text-xl">⭐</span>
              <span className="font-bold">
                Welcome back, {progress.student_name}! Score: {progress.quiz_score}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 -mt-8 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                rounded-3xl p-5 flex flex-col items-center text-center gap-2
                bg-gradient-to-br ${item.color} text-white
                shadow-xl ${item.shadow} ${item.hover}
                hover:scale-105 active:scale-95
                transition-all duration-200
                animate-pop
              `}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-5xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                {item.emoji}
              </span>
              <span className="font-fredoka text-xl font-bold leading-tight">{item.label}</span>
              <span className="text-xs font-semibold text-white/80">{item.desc}</span>
            </Link>
          ))}
        </div>

        {/* Fun facts / tip */}
        <div className="mt-6 card bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <p className="font-bold text-amber-700 text-lg">Tip of the day!</p>
              <p className="text-amber-600 font-semibold mt-1">
                Say each letter sound out loud — it helps you remember! Try "A says /æ/ like Apple!" 🍎
              </p>
            </div>
          </div>
        </div>

        {/* Alphabet strip */}
        <div className="mt-4 card overflow-x-auto">
          <p className="font-fredoka text-lg font-bold text-gray-600 mb-3 text-center">The Alphabet</p>
          <div className="flex gap-2 pb-1 min-w-max mx-auto">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
              <Link
                key={l}
                to="/learn"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500
                           text-white font-fredoka font-black text-lg flex items-center justify-center
                           hover:scale-110 active:scale-95 transition-transform shadow-md"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
