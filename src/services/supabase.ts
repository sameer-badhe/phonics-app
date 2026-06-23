import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type ProgressRecord = {
  id?: string
  student_name: string
  lesson_completed: number
  quiz_score: number
  updated_at?: string
}

// Save progress to Supabase (falls back to localStorage if not configured)
export async function saveProgress(data: ProgressRecord): Promise<void> {
  // Always save locally
  localStorage.setItem('phonics_progress', JSON.stringify({
    ...data,
    updated_at: new Date().toISOString()
  }))

  if (!supabase) return

  const { error } = await supabase
    .from('progress')
    .upsert([{ ...data, updated_at: new Date().toISOString() }], {
      onConflict: 'student_name'
    })

  if (error) console.error('Supabase save error:', error)
}

export async function loadProgress(studentName: string): Promise<ProgressRecord | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('student_name', studentName)
      .single()

    if (!error && data) return data as ProgressRecord
  }

  // Fallback to localStorage
  const local = localStorage.getItem('phonics_progress')
  if (local) {
    const parsed = JSON.parse(local) as ProgressRecord
    if (parsed.student_name === studentName) return parsed
  }

  return null
}

export async function loadLocalProgress(): Promise<ProgressRecord | null> {
  const local = localStorage.getItem('phonics_progress')
  if (local) return JSON.parse(local) as ProgressRecord
  return null
}
