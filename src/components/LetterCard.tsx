import { useState } from 'react'
import AudioButton from './AudioButton'

interface LetterData {
  id: number
  letter: string
  sound: string
  word: string
  emoji: string
  color: string
  bgColor: string
  textColor: string
}

interface LetterCardProps {
  data: LetterData
  onClick?: (data: LetterData) => void
  expanded?: boolean
}

export default function LetterCard({ data, onClick, expanded = false }: LetterCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
    onClick?.(data)
  }

  if (expanded) {
    return (
      <div className={`card ${data.bgColor} border-4 border-white animate-pop`}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${data.color} flex items-center justify-center shadow-lg`}>
            <span className={`font-fredoka text-7xl text-white font-black`}>{data.letter}</span>
          </div>
          <div className="text-8xl animate-float">{data.emoji}</div>
          <div>
            <p className={`font-fredoka text-4xl font-bold ${data.textColor}`}>{data.word}</p>
            <p className="text-xl text-gray-500 font-semibold mt-1">Sound: <span className="font-bold text-gray-700">{data.sound}</span></p>
          </div>
          <AudioButton text={data.word} label={`Listen to "${data.word}"`} size="lg" />
          <AudioButton text={data.letter} label={`Say "${data.letter}"`} size="md" className="!from-violet-400 !to-purple-500 !shadow-violet-200" />
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`
        letter-card ${data.bgColor} border-4
        ${isFlipped ? 'border-violet-400 scale-105' : 'border-white'}
        min-h-[140px] flex flex-col items-center justify-center gap-2
        w-full
      `}
      aria-label={`Letter ${data.letter} - ${data.word}`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shadow-md`}>
        <span className="font-fredoka text-3xl text-white font-black">{data.letter}</span>
      </div>
      <span className="text-3xl">{data.emoji}</span>
      <span className={`font-bold text-sm ${data.textColor}`}>{data.word}</span>
    </button>
  )
}
