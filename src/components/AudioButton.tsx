import { useState } from 'react'

interface AudioButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AudioButton({ text, label = 'Listen', size = 'md', className = '' }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false)

  const speak = () => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1.1
    utterance.volume = 1

    // Prefer a child-friendly voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Google UK') || v.lang === 'en-US'
    )
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setPlaying(true)
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const sizeClasses = {
    sm: 'text-sm py-2 px-4 gap-1',
    md: 'text-base py-3 px-6 gap-2',
    lg: 'text-xl py-4 px-8 gap-3',
  }

  return (
    <button
      onClick={speak}
      className={`
        inline-flex items-center justify-center font-bold rounded-2xl
        bg-gradient-to-r from-emerald-400 to-teal-500
        text-white shadow-lg shadow-emerald-200
        hover:shadow-xl hover:scale-105 active:scale-95
        transition-all duration-200 select-none
        ${sizeClasses[size]}
        ${playing ? 'animate-pulse' : ''}
        ${className}
      `}
      aria-label={`Listen to ${text}`}
    >
      <span className={`${playing ? 'animate-bounce' : ''}`}>
        {playing ? '🔊' : '▶️'}
      </span>
      {label}
    </button>
  )
}
