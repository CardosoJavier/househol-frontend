import { createClient as createClientPrimitive } from '@supabase/supabase-js'
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '../../config'

export function createClient() {
  const supabase = createClientPrimitive(
    NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return supabase
}