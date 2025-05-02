import { createBrowserClient } from '@supabase/ssr'
import { VITE_NEXT_PUBLIC_SUPABASE_URL, VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY } from '../../config'

export function createClient() {
  const supabase = createBrowserClient(
    VITE_NEXT_PUBLIC_SUPABASE_URL,
    VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return supabase
}