import { useState } from 'react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: string
  emoji: string
}

interface QuizCardProps {
  question: QuizQuestion
  questionNumber: number
  total: number
  onAnswer: (correct: boolean) => void
}

export default function QuizCard({ question, questionNumber, total, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (option: string) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
    const correct = option === question.answer
    setTimeout(() => onAnswer(correct), 1200)
  }

  const getOptionClass = (option: string) => {
    if (!revealed) return 'quiz-option'
    if (option === question.answer) return 'quiz-option quiz-option-correct border-3 border-green-400 scale-105'
    if (option === selected) return 'quiz-option quiz-option-wrong border-3 border-red-400'
    return 'quiz-option opacity-50'
  }

  return (
    <div className="card animate-pop max-w-lg mx-auto w-full">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-500">Question {questionNumber} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < questionNumber - 1 ? 'bg-violet-400 w-4' : i === questionNumber - 1 ? 'bg-violet-600 w-6' : 'bg-gray-200 w-4'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{question.emoji}</div>
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`${getOptionClass(option)} transition-all duration-300`}
            disabled={revealed}
          >
            <span className="mr-2">
              {revealed && option === question.answer && '✅'}
              {revealed && option === selected && option !== question.answer && '❌'}
            </span>
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className={`mt-4 p-3 rounded-2xl text-center font-bold text-lg animate-pop ${
          selected === question.answer
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {selected === question.answer
            ? '🌟 Amazing! Correct!'
            : `The answer is: "${question.answer}" 😊`}
        </div>
      )}
    </div>
  )
}
