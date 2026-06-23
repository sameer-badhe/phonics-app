import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadLocalProgress, saveProgress, type ProgressRecord } from '../services/supabase'
import NavBar from '../components/NavBar'

const badges = [
  { id: 'first_quiz', label: 'First Quiz!', emoji: '🎯', condition: (p: ProgressRecord) => p.quiz_score > 0 },
  { id: 'perfect', label: 'Perfect Score!', emoji: '🏆', condition: (p: ProgressRecord) => p.quiz_score >= 10 },
  { id: 'all_letters', label: 'A-Z Explorer', emoji: '🔤', condition: (p: ProgressRecord) => p.lesson_completed >= 26 },
  { id: 'streak', label: 'Star Learner', emoji: '⭐', condition: (p: ProgressRecord) => p.quiz_score >= 7 },
  { id: 'fan', label: 'Phonics Fan', emoji: '📚', condition: (p: ProgressRecord) => p.lesson_completed >= 10 },
]

export default function Progress() {
  const [progress, setProgress] = useState<ProgressRecord | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadLocalProgress().then(p => {
      setProgress(p)
      if (p) setNameInput(p.student_name)
    })
  }, [])

  const handleSave = async () => {
    const name = nameInput.trim() || 'Student'
    const updated: ProgressRecord = {
      student_name: name,
      lesson_completed: progress?.lesson_completed ?? 0,
      quiz_score: progress?.quiz_score ?? 0,
    }
    await saveProgress(updated)
    setProgress(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    localStorage.removeItem('phonics_progress')
    setProgress(null)
    setNameInput('')
  }

  const earnedBadges = progress ? badges.filter(b => b.condition(progress)) : []
  const quizPct = progress ? Math.round((progress.quiz_score / 10) * 100) : 0

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="text-white/80 hover:text-white text-2xl">←</Link>
          <h1 className="font-fredoka text-3xl font-bold">My Progress ⭐</h1>
        </div>
        <p className="text-emerald-100 font-semibold ml-9">See how well you're doing!</p>
      </div>

      <div className="px-4 py-5 max-w-md mx-auto space-y-4">
        {/* Student name */}
        <div className="card">
          <label className="block text-gray-600 font-bold mb-2">👤 Student Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              className="flex-1 border-2 border-emerald-200 rounded-2xl px-4 py-2.5 font-bold text-gray-700
                         focus:border-emerald-400 focus:outline-none"
            />
            <button
              onClick={handleSave}
              className={`px-4 py-2.5 rounded-2xl font-bold text-white transition-all ${
                saved
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:scale-105 active:scale-95'
              }`}
            >
              {saved ? '✓ Saved!' : 'Save'}
            </button>
          </div>
        </div>

        {progress ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card text-center bg-violet-50 border-2 border-violet-200">
                <div className="text-4xl mb-1">🔤</div>
                <p className="font-fredoka text-3xl font-bold text-violet-600">{progress.lesson_completed}</p>
                <p className="text-violet-500 font-bold text-sm">Letters Learned</p>
              </div>
              <div className="card text-center bg-amber-50 border-2 border-amber-200">
                <div className="text-4xl mb-1">🎯</div>
                <p className="font-fredoka text-3xl font-bold text-amber-600">{progress.quiz_score}</p>
                <p className="text-amber-500 font-bold text-sm">Best Quiz Score</p>
              </div>
            </div>

            {/* Quiz progress bar */}
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-700">Quiz Performance</p>
                <span className="font-bold text-emerald-600">{quizPct}%</span>
              </div>
              <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000"
                  style={{ width: `${quizPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400 font-semibold">0</span>
                <span className="text-xs text-gray-400 font-semibold">10</span>
              </div>
            </div>

            {/* Stars */}
            <div className="card text-center">
              <p className="font-bold text-gray-700 mb-3">⭐ Your Stars</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < progress.quiz_score ? 'text-yellow-400' : 'text-gray-200'}`}>
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-500 font-semibold mt-2 text-sm">
                {progress.quiz_score}/10 stars earned
              </p>
            </div>

            {/* Badges */}
            <div className="card">
              <p className="font-bold text-gray-700 mb-3">🏅 Badges Earned ({earnedBadges.length}/{badges.length})</p>
              <div className="grid grid-cols-5 gap-2">
                {badges.map(badge => {
                  const earned = earnedBadges.some(b => b.id === badge.id)
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                        earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 opacity-40'
                      }`}
                      title={badge.label}
                    >
                      <span className="text-2xl">{badge.emoji}</span>
                      <span className="text-xs font-bold text-center text-gray-600 leading-tight">
                        {badge.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Last activity */}
            {progress.updated_at && (
              <div className="card bg-gray-50 border-2 border-gray-200 text-center">
                <p className="text-gray-500 font-semibold text-sm">
                  Last activity: {new Date(progress.updated_at).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 active:scale-95 transition-all"
            >
              🗑️ Reset Progress
            </button>
          </>
        ) : (
          <div className="card text-center py-10">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="font-fredoka text-2xl font-bold text-gray-700 mb-2">No progress yet!</h2>
            <p className="text-gray-500 font-semibold mb-6">Start learning and your progress will show here.</p>
            <Link to="/learn" className="btn-primary inline-block">
              🚀 Start Learning!
            </Link>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  )
}
