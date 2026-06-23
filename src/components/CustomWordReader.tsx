import { useState, useRef } from 'react'

// ─── Phonics chunks: what to GROUP visually ────────────────────────────────

const VOWEL_DIGRAPHS    = ['oo','ee','ai','ay','ea','oa','ou','ow','ie','ue','oi','oy','au','aw','ew','ey']
const CONSONANT_DIGRAPHS = ['sh','ch','th','wh','ph','ck','ng','nk','gh']
const THREE_BLENDS       = ['str','spr','spl','thr','chr','sch','scr']
const TWO_BLENDS         = ['br','cr','dr','fr','gr','pr','tr','bl','cl','fl','gl','pl','sl','sk','sm','sn','sp','st','sw','tw','sc']

const ALL_DIGRAPHS = [...VOWEL_DIGRAPHS, ...CONSONANT_DIGRAPHS]

// ─── Phonetic pronunciation: what the TTS should SAY for each chunk ─────────
// Key = display chunk (uppercase), Value = text to pass to TTS
const PHONETIC_SAY: Record<string, string> = {
  // Short vowels
  A: 'aah', E: 'eh', I: 'ih', O: 'aw', U: 'uh',
  // Vowel digraphs
  OO: 'ooh', EE: 'ee', AI: 'ay', AY: 'ay', EA: 'ee', OA: 'oh',
  OU: 'ow',  OW: 'oh', IE: 'eye', UE: 'yoo', OI: 'oy', OY: 'oy',
  AU: 'aw',  AW: 'aw', EW: 'yoo', EY: 'ay',
  // Consonant digraphs (phoneme sounds)
  SH: 'shh', CH: 'ch', TH: 'th', WH: 'wh', PH: 'ff',
  CK: 'k',   NG: 'ng', NK: 'nk', GH: 'ff',
  // Consonant blends — spoken as blend sounds
  BR:'br', CR:'cr', DR:'dr', FR:'fr', GR:'gr', PR:'pr', TR:'tr',
  BL:'bl', CL:'cl', FL:'fl', GL:'gl', PL:'pl', SL:'sl',
  SK:'sk', SM:'sm', SN:'sn', SP:'sp', ST:'st', SW:'sw', TW:'tw', SC:'sc',
  STR:'str', SPR:'spr', SPL:'spl', THR:'thr', CHR:'chr', SCR:'scr',
  // Single consonants — phonemic sounds, NOT letter names
  B:'buh', C:'kuh', D:'duh', F:'fff', G:'guh', H:'huh', J:'juh',
  K:'kuh', L:'lll', M:'mmm', N:'nnn', P:'puh', Q:'kwuh', R:'rrr',
  S:'sss', T:'tuh', V:'vvv', W:'wuh', X:'ks',  Y:'yuh', Z:'zzz',
}

function getChunkSay(chunk: string): string {
  return PHONETIC_SAY[chunk.toUpperCase()] ?? chunk.toLowerCase()
}

// ─── Build phonics chunks from a word ────────────────────────────────────────

type Segment = { text: string; isVowel: boolean }

function wordToSegments(word: string): Segment[] {
  const w   = word.toLowerCase()
  const segs: Segment[] = []
  const VOWELS = new Set(['a','e','i','o','u'])
  let i = 0

  while (i < w.length) {
    // 3-letter blends first
    if (i + 2 < w.length && THREE_BLENDS.includes(w.slice(i, i + 3))) {
      segs.push({ text: w.slice(i, i + 3), isVowel: false }); i += 3; continue
    }
    // 2-letter digraphs
    if (i + 1 < w.length) {
      const two = w.slice(i, i + 2)
      if (ALL_DIGRAPHS.includes(two) || TWO_BLENDS.includes(two)) {
        const isV = VOWEL_DIGRAPHS.includes(two)
        segs.push({ text: two, isVowel: isV }); i += 2; continue
      }
    }
    // Single character — treat Y as vowel unless it's the very first character
    const ch = w[i]
    if (ch !== ' ') {
      const isV = VOWELS.has(ch) || (ch === 'y' && i > 0)
      segs.push({ text: ch, isVowel: isV })
    }
    i++
  }
  return segs
}

function splitIntoPhonicsChunks(word: string): string[] {
  return wordToSegments(word).map(s => s.text.toUpperCase())
}

// ─── Syllabify using vowel-nucleus + consonant-distribution rules ─────────────
//
// Rules (standard English phonics):
//   VCV  (1 consonant between vowels) → consonant goes with NEXT syllable  (open: po-ta-to)
//   VCCV (2 consonants between vowels) → split between them               (car-toon, but-ter)
//   VCCCV (3+ consonants) → first with prev syllable, rest start new one   (hun-dred)
//
// "Silent-E" edge case: if the last syllable is a single silent vowel (e.g. 'E' alone),
//   merge it back into the previous syllable.

function syllabifyWord(word: string): string[] {
  const segs = wordToSegments(word)
  if (segs.length === 0) return [word.toUpperCase()]

  // Positions of vowel segments
  const vPos = segs.map((s, i) => s.isVowel ? i : -1).filter(i => i >= 0)

  // Single syllable (0 or 1 vowel nucleus)
  if (vPos.length <= 1) return [segs.map(s => s.text).join('').toUpperCase()]

  // Build split points (index of segment that STARTS a new syllable)
  const splitAt = new Set<number>()

  for (let v = 0; v < vPos.length - 1; v++) {
    const v1 = vPos[v]
    const v2 = vPos[v + 1]
    const consonantCount = v2 - v1 - 1

    if (consonantCount === 0) {
      // Adjacent vowels not a digraph: split between them
      splitAt.add(v2)
    } else if (consonantCount === 1) {
      // VCV → consonant opens the next syllable
      splitAt.add(v2 - 1)
    } else if (consonantCount === 2) {
      // VCCV → split between the two consonants
      splitAt.add(v1 + 2)
    } else {
      // VCCCV+ → first consonant stays, rest open next syllable
      splitAt.add(v1 + 2)
    }
  }

  // Assemble syllables
  const syllables: string[] = []
  let cur = ''
  for (let s = 0; s < segs.length; s++) {
    if (splitAt.has(s) && cur) {
      syllables.push(cur.toUpperCase())
      cur = segs[s].text
    } else {
      cur += segs[s].text
    }
  }
  if (cur) syllables.push(cur.toUpperCase())

  // Post-process: if last syllable is only a silent-E vowel alone, merge it back
  if (syllables.length >= 2) {
    const last = syllables[syllables.length - 1]
    if (last === 'E' || last === 'A') {
      syllables[syllables.length - 2] += last
      syllables.pop()
    }
  }

  return syllables.filter(Boolean)
}

// ─── TTS helper ──────────────────────────────────────────────────────────────

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function speakText(text: string, rate = 0.75, pitch = 1.1): Promise<void> {
  return new Promise(res => {
    if (!('speechSynthesis' in window)) { res(); return }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate   = rate
    u.pitch  = pitch
    u.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const pref = voices.find(v => v.lang === 'en-US' || v.name.includes('Samantha'))
    if (pref) u.voice = pref
    u.onend  = () => res()
    u.onerror = () => res()
    window.speechSynthesis.speak(u)
  })
}

// ─── Colours ─────────────────────────────────────────────────────────────────

const CHUNK_COLORS = [
  { bg: 'bg-red-400',     ring: 'ring-red-300' },
  { bg: 'bg-blue-500',    ring: 'ring-blue-300' },
  { bg: 'bg-emerald-500', ring: 'ring-emerald-300' },
  { bg: 'bg-violet-500',  ring: 'ring-violet-300' },
  { bg: 'bg-orange-500',  ring: 'ring-orange-300' },
  { bg: 'bg-pink-500',    ring: 'ring-pink-300' },
  { bg: 'bg-teal-500',    ring: 'ring-teal-300' },
  { bg: 'bg-amber-500',   ring: 'ring-amber-300' },
]

const SYL_COLORS = [
  { bg: 'bg-rose-500',    ring: 'ring-rose-300' },
  { bg: 'bg-indigo-500',  ring: 'ring-indigo-300' },
  { bg: 'bg-lime-500',    ring: 'ring-lime-300' },
  { bg: 'bg-cyan-500',    ring: 'ring-cyan-300' },
]

// ─── Component ───────────────────────────────────────────────────────────────

type Phase = 'idle' | 'chunk' | 'syllable' | 'full' | 'done'

const EXAMPLES = ['ROOM', 'POTATO', 'CARTOON', 'ELEPHANT', 'RAINBOW', 'BUTTERFLY', 'SUNSHINE', 'SCHOOL']

export default function CustomWordReader() {
  const [input,          setInput]          = useState('')
  const [word,           setWord]           = useState('')
  const [chunks,         setChunks]         = useState<string[]>([])
  const [syllables,      setSyllables]      = useState<string[]>([])
  const [activeChunk,    setActiveChunk]    = useState<number | null>(null)
  const [activeSyllable, setActiveSyllable] = useState<number | null>(null)
  const [phase,          setPhase]          = useState<Phase>('idle')
  const cancelRef = useRef(false)

  const runReading = async (w: string) => {
    cancelRef.current = true
    window.speechSynthesis?.cancel()
    await delay(80)
    cancelRef.current = false

    const c   = splitIntoPhonicsChunks(w)
    const syl = syllabifyWord(w)

    setWord(w.toUpperCase())
    setChunks(c)
    setSyllables(syl)
    setActiveChunk(null)
    setActiveSyllable(null)
    setPhase('chunk')

    // ── Step 1: each phonics chunk spoken as its SOUND ──────────────────────
    for (let i = 0; i < c.length; i++) {
      if (cancelRef.current) return
      setActiveChunk(i)
      await speakText(getChunkSay(c[i]), 0.6, 1.15)
      await delay(320)
    }
    setActiveChunk(null)
    if (cancelRef.current) return
    await delay(450)

    // ── Step 2: each syllable spoken naturally ───────────────────────────────
    if (syl.length > 1) {
      setPhase('syllable')
      for (let i = 0; i < syl.length; i++) {
        if (cancelRef.current) return
        setActiveSyllable(i)
        // Speak the syllable text directly — TTS pronounces syllables correctly
        await speakText(syl[i].toLowerCase(), 0.7, 1.1)
        await delay(420)
      }
      setActiveSyllable(null)
      if (cancelRef.current) return
      await delay(500)
    }

    // ── Step 3: full word at natural pace ────────────────────────────────────
    setPhase('full')
    await speakText(w.toLowerCase(), 0.88, 1.0)
    setPhase('done')
  }

  const handleRead = () => {
    const w = input.trim()
    if (!w) return
    runReading(w)
  }

  const handleStop = () => {
    cancelRef.current = true
    window.speechSynthesis?.cancel()
    setPhase('idle')
    setWord('')
  }

  const handleExample = (ex: string) => {
    setInput(ex)
    runReading(ex)
  }

  const isReading = phase === 'chunk' || phase === 'syllable' || phase === 'full'

  return (
    <div className="card border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🧑‍🏫</span>
        <div>
          <h2 className="font-fredoka text-xl font-bold text-violet-700">Try Your Own Word!</h2>
          <p className="text-sm text-violet-500 font-semibold">Type any word — I'll break it like a phonics teacher</p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && !isReading && handleRead()}
          placeholder="TYPE A WORD..."
          disabled={isReading}
          className="flex-1 border-2 border-violet-300 rounded-2xl px-4 py-3 text-xl font-black
                     text-gray-700 tracking-widest uppercase
                     focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200
                     placeholder:text-gray-300 placeholder:font-normal placeholder:normal-case
                     disabled:opacity-60"
        />
        {!isReading ? (
          <button
            onClick={handleRead}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-2xl font-bold text-white text-lg
                       bg-gradient-to-r from-violet-500 to-purple-600
                       shadow-lg shadow-violet-300 hover:scale-105 active:scale-95
                       transition-all duration-200 disabled:opacity-40 disabled:scale-100 disabled:shadow-none select-none"
          >
            📖 Read!
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-5 py-3 rounded-2xl font-bold text-white text-lg
                       bg-gradient-to-r from-red-400 to-rose-500
                       shadow-lg shadow-red-200 hover:scale-105 active:scale-95
                       transition-all duration-200 select-none"
          >
            ✕ Stop
          </button>
        )}
      </div>

      {/* ── BREAKDOWN ─────────────────────────────────────────────────────── */}
      {word && (
        <div className="space-y-5">

          {/* Full-word banner */}
          <div className={`text-center py-4 rounded-2xl transition-all duration-500 ${
            phase === 'full' || phase === 'done'
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 scale-[1.03] shadow-lg shadow-violet-300'
              : 'bg-white border-2 border-violet-100'
          }`}>
            <span className={`font-fredoka text-4xl font-black tracking-widest ${
              phase === 'full' || phase === 'done' ? 'text-white' : 'text-violet-800'
            }`}>
              {word}
            </span>
            {phase === 'full' && (
              <p className="text-violet-200 text-sm font-bold mt-1 animate-pulse">🔊 Full word…</p>
            )}
            {phase === 'done' && (
              <p className="text-violet-200 text-sm font-bold mt-1">✅ Well done!</p>
            )}
          </div>

          {/* Step 1 — Individual sounds */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Step 1 — Each Sound
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {chunks.map((chunk, i) => {
                const col     = CHUNK_COLORS[i % CHUNK_COLORS.length]
                const active  = activeChunk === i
                const spoken  = activeChunk !== null ? i < activeChunk : phase !== 'chunk'
                return (
                  <div
                    key={i}
                    title={`Says: "${getChunkSay(chunk)}"`}
                    className={`
                      font-fredoka text-2xl font-black px-4 py-2 rounded-2xl border-3
                      transition-all duration-200 select-none
                      ${active
                        ? `${col.bg} text-white scale-125 ring-4 ${col.ring} shadow-xl`
                        : spoken
                          ? `${col.bg} text-white opacity-70`
                          : 'bg-white border-gray-200 text-gray-300'
                      }
                    `}
                  >
                    {chunk}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 2 — Syllables (only shown when > 1 syllable) */}
          {syllables.length > 1 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Step 2 — Syllables&nbsp;
                <span className="text-violet-400">({syllables.length} part{syllables.length !== 1 ? 's' : ''})</span>
              </p>
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {syllables.map((syl, si) => {
                  const col    = SYL_COLORS[si % SYL_COLORS.length]
                  const active = activeSyllable === si
                  const spoken = activeSyllable !== null
                    ? si < activeSyllable
                    : phase === 'full' || phase === 'done'
                  return (
                    <div key={si} className="flex items-center gap-2">
                      <div className={`
                        font-fredoka text-2xl font-black px-5 py-2.5 rounded-2xl border-3
                        transition-all duration-200 select-none
                        ${active
                          ? `${col.bg} text-white scale-[1.18] ring-4 ${col.ring} shadow-xl`
                          : spoken
                            ? `${col.bg} text-white opacity-75`
                            : (phase === 'chunk')
                              ? 'bg-white border-gray-200 text-gray-300'
                              : `${col.bg} text-white opacity-60`
                        }
                      `}>
                        {syl}
                      </div>
                      {si < syllables.length - 1 && (
                        <span className="text-gray-300 font-black text-2xl leading-none">·</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Phase status strip */}
          <div className="text-center min-h-[40px] flex items-center justify-center">
            {phase === 'chunk' && (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 bg-violet-100 px-4 py-2 rounded-full animate-pulse">
                🔊 Saying each sound…
              </span>
            )}
            {phase === 'syllable' && (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full animate-pulse">
                🔊 Now reading syllable by syllable…
              </span>
            )}
            {phase === 'full' && (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full animate-pulse">
                🔊 Full word!
              </span>
            )}
            {phase === 'done' && (
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => runReading(input.trim())}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white
                             bg-gradient-to-r from-emerald-400 to-teal-500
                             px-4 py-2 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all select-none"
                >
                  🔄 Hear again
                </button>
                <button
                  onClick={handleStop}
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-600
                             bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 active:scale-95 transition-all select-none"
                >
                  Try another word
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Example chips (only when idle) */}
      {phase === 'idle' && (
        <div className="flex flex-wrap gap-2 mt-2">
          <p className="text-xs font-bold text-gray-400 w-full">Try these:</p>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border-2
                         border-violet-200 text-violet-600
                         hover:bg-violet-50 hover:border-violet-400
                         active:scale-95 transition-all select-none"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
