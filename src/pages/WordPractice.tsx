import { useState } from 'react'
import { Link } from 'react-router-dom'
import phonicsData from '../data/phonics.json'
import WordCard from '../components/WordCard'
import CustomWordReader from '../components/CustomWordReader'
import NavBar from '../components/NavBar'

const categories = ['all', 'animals', 'nature', 'objects']

export default function WordPractice() {
  const [activeCategory, setActiveCategory] = useState('all')
  const words = phonicsData.words

  const filtered = activeCategory === 'all'
    ? words
    : words.filter(w => w.category === activeCategory)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="text-white/80 hover:text-white text-2xl">←</Link>
          <h1 className="font-fredoka text-3xl font-bold">Practice Words 📖</h1>
        </div>
        <p className="text-pink-100 font-semibold ml-9">Tap the play button to hear each word!</p>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Category filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl font-bold text-sm capitalize whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-300 scale-105'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-pink-300'
              }`}
            >
              {cat === 'all' ? '🌟 All Words' : cat === 'animals' ? '🐾 Animals' : cat === 'nature' ? '🌿 Nature' : '🏠 Objects'}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-gray-500 font-bold text-sm mb-4 text-center">
          {filtered.length} word{filtered.length !== 1 ? 's' : ''} to practice
        </p>

        {/* Word cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((word, index) => (
            <WordCard key={word.id} data={word} index={index} />
          ))}
        </div>

        {/* Custom word reader */}
        <CustomWordReader />

        {/* Rhyme families hint */}
        <div className="mt-6 card bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200">
          <p className="font-bold text-pink-700 text-lg mb-2">🎵 Rhyme Families!</p>
          <div className="flex flex-wrap gap-2">
            {[['CAT','BAT','HAT','RAT'], ['PEN','HEN'], ['BUS','SUN']].map(group => (
              <div key={group[0]} className="bg-white rounded-2xl px-3 py-2 border-2 border-pink-200">
                <span className="font-bold text-pink-600 text-sm">{group.join(' · ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
