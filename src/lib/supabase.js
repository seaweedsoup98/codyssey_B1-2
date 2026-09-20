import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase 환경변수가 설정되지 않았습니다. Vercel Environment Variables를 확인하세요.',
    )
  }

  return supabase
}
