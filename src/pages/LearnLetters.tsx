import { useState } from 'react'
import { Link } from 'react-router-dom'
import phonicsData from '../data/phonics.json'
import LetterCard from '../components/LetterCard'
import NavBar from '../components/NavBar'

type LetterData = typeof phonicsData.letters[0]

export default function LearnLetters() {
  const [selected, setSelected] = useState<LetterData | null>(null)
  const letters = phonicsData.letters

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="text-white/80 hover:text-white text-2xl">←</Link>
          <h1 className="font-fredoka text-3xl font-bold">Learn Letters 🔤</h1>
        </div>
        <p className="text-violet-200 font-semibold ml-9">Tap any letter to learn its sound!</p>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Expanded selected letter */}
        {selected && (
          <div className="mb-5">
            <LetterCard data={selected} expanded />
            <button
              onClick={() => setSelected(null)}
              className="mt-3 w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 active:scale-95 transition-all"
            >
              Close ✕
            </button>
          </div>
        )}

        {/* Alphabet grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {letters.map(letter => (
            <LetterCard
              key={letter.id}
              data={letter}
              onClick={(d) => setSelected(selected?.id === d.id ? null : d)}
            />
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  )
}
