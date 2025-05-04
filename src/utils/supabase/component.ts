import { createBrowserClient } from '@supabase/ssr'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '../../config'

export function createClient() {
  const supabase = createBrowserClient(
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY
  )
  return supabase
}