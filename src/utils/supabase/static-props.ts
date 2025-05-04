import { createClient as createClientPrimitive } from '@supabase/supabase-js'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '../../config'

export function createClient() {
  const supabase = createClientPrimitive(
    VITE_SUPABASE_URL!,
    VITE_SUPABASE_ANON_KEY!
  )
  return supabase
}