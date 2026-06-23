import AudioButton from './AudioButton'

interface WordData {
  id: number
  word: string
  emoji: string
  phonics: string
  highlight: string
  sound: string
  category: string
}

interface WordCardProps {
  data: WordData
  index: number
}

const cardColors = [
  { bg: 'from-pink-400 to-rose-500', light: 'bg-pink-50', border: 'border-pink-200' },
  { bg: 'from-violet-400 to-purple-500', light: 'bg-violet-50', border: 'border-violet-200' },
  { bg: 'from-blue-400 to-cyan-500', light: 'bg-blue-50', border: 'border-blue-200' },
  { bg: 'from-emerald-400 to-teal-500', light: 'bg-emerald-50', border: 'border-emerald-200' },
  { bg: 'from-orange-400 to-amber-500', light: 'bg-orange-50', border: 'border-orange-200' },
  { bg: 'from-fuchsia-400 to-pink-500', light: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
]

export default function WordCard({ data, index }: WordCardProps) {
  const color = cardColors[index % cardColors.length]

  // Render word with first two letters highlighted differently
  const renderWord = () => {
    const h = data.highlight
    const rest = data.word.slice(h.length)
    return (
      <span className="font-fredoka text-5xl font-black tracking-wider">
        <span className="text-white drop-shadow-md">{h}</span>
        <span className="text-white/70">{rest}</span>
      </span>
    )
  }

  return (
    <div className={`card ${color.light} border-2 ${color.border} overflow-hidden`}>
      {/* Colored header */}
      <div className={`-mx-6 -mt-6 px-6 pt-6 pb-4 bg-gradient-to-r ${color.bg} mb-4`}>
        <div className="flex items-center justify-between">
          {renderWord()}
          <span className="text-6xl">{data.emoji}</span>
        </div>
      </div>

      {/* Phonics breakdown */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm font-bold text-gray-500">Phonics:</span>
        {data.phonics.split('-').map((part, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-xl font-bold text-sm ${
              i === 0
                ? `bg-gradient-to-r ${color.bg} text-white`
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {part}
          </span>
        ))}
      </div>

      <AudioButton text={data.word.toLowerCase()} label={`Say "${data.word}"`} size="md" className="w-full justify-center" />
    </div>
  )
}
