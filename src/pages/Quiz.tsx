import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import quizData from '../data/quizzes.json'
import QuizCard from '../components/QuizCard'
import NavBar from '../components/NavBar'
import { saveProgress, loadLocalProgress } from '../services/supabase'

type Phase = 'intro' | 'playing' | 'result'

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [questions, setQuestions] = useState(shuffleArray(quizData.quizzes).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [studentName, setStudentName] = useState('')
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    loadLocalProgress().then(p => {
      if (p) setStudentName(p.student_name)
    })
  }, [])

  const startQuiz = () => {
    const name = nameInput.trim() || studentName || 'Student'
    setStudentName(name)
    setQuestions(shuffleArray(quizData.quizzes).slice(0, 10))
    setCurrent(0)
    setScore(0)
    setPhase('playing')
  }

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setScore(s => s + 1)
    setCurrent(c => {
      if (c + 1 >= questions.length) {
        setPhase('result')
        return c
      }
      return c + 1
    })
  }, [questions.length])

  useEffect(() => {
    if (phase === 'result') {
      saveProgress({
        student_name: studentName,
        lesson_completed: 26,
        quiz_score: score,
      })
    }
  }, [phase, score, studentName])

  const getStars = () => {
    const pct = score / questions.length
    if (pct >= 0.9) return 3
    if (pct >= 0.6) return 2
    return 1
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen pb-24">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/" className="text-white/80 hover:text-white text-2xl">←</Link>
            <h1 className="font-fredoka text-3xl font-bold">Quiz Time! 🎯</h1>
          </div>
          <p className="text-amber-100 font-semibold ml-9">Test what you've learned!</p>
        </div>

        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="card text-center">
            <div className="text-6xl mb-4 animate-bounce-slow">🎯</div>
            <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-2">Ready to Quiz?</h2>
            <p className="text-gray-500 font-semibold mb-6">10 questions • Multiple choice</p>

            <div className="mb-6">
              <label className="block text-left text-gray-600 font-bold mb-2">Your name:</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder={studentName || 'Enter your name...'}
                className="w-full border-2 border-violet-200 rounded-2xl px-4 py-3 text-lg font-bold text-gray-700
                           focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>

            <button onClick={startQuiz} className="btn-primary w-full">
              🚀 Start Quiz!
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {['Learn letters first!', '10 questions', 'Earn stars! ⭐'].map((tip, i) => (
              <div key={i} className="card bg-amber-50 border-2 border-amber-200 p-3">
                <p className="text-amber-700 font-bold text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
        <NavBar />
      </div>
    )
  }

  if (phase === 'result') {
    const stars = getStars()
    const pct = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen pb-24">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 pt-10 pb-6">
          <h1 className="font-fredoka text-3xl font-bold text-center">Quiz Complete! 🎉</h1>
        </div>

        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="card text-center animate-pop">
            <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '😊' : '💪'}</div>
            <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-1">
              {score}/{questions.length}
            </h2>
            <p className="text-gray-500 font-bold text-lg mb-4">{pct}% Correct!</p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-4xl transition-all duration-300 ${i < stars ? 'text-yellow-400 scale-110' : 'text-gray-200'}`}>
                  ⭐
                </span>
              ))}
            </div>

            <p className="text-gray-600 font-semibold mb-6">
              {pct >= 90 ? '🌟 Outstanding! You\'re a phonics superstar!' :
               pct >= 70 ? '🎉 Great job, keep it up!' :
               pct >= 50 ? '😊 Good try! Practice makes perfect!' :
               '💪 Keep learning! You\'ll do better next time!'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={startQuiz} className="btn-primary">
                🔄 Try Again
              </button>
              <Link to="/learn" className="btn-secondary text-center inline-flex items-center justify-center">
                📚 Learn More
              </Link>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-5 card">
            <p className="font-bold text-gray-700 mb-2">Your Score</p>
            <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-right text-sm font-bold text-gray-500 mt-1">{pct}%</p>
          </div>
        </div>
        <NavBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button onClick={() => setPhase('intro')} className="text-white/80 hover:text-white text-2xl">←</button>
            <h1 className="font-fredoka text-2xl font-bold">Quiz Time! 🎯</h1>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-1">
            <span className="font-bold text-lg">⭐ {score}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <QuizCard
          key={current}
          question={questions[current]}
          questionNumber={current + 1}
          total={questions.length}
          onAnswer={handleAnswer}
        />
      </div>
      <NavBar />
    </div>
  )
}
