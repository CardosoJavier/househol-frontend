import { createClient as createClientPrimitive } from '@supabase/supabase-js'
import { VITE_NEXT_PUBLIC_SUPABASE_URL, VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY } from '../../config'

export function createClient() {
  const supabase = createClientPrimitive(
    VITE_NEXT_PUBLIC_SUPABASE_URL!,
    VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return supabase
}