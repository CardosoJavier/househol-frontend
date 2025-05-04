import { type GetServerSidePropsContext } from 'next'
import { createServerClient, serializeCookieHeader } from '@supabase/ssr'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '../../config'

export function createClient({ req, res }: GetServerSidePropsContext) {
  const supabase = createServerClient(
    VITE_SUPABASE_URL!,
    VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' }))
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, {
                ...options,
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
              })
            )
          )
        },
      },
    }
  )
  return supabase
}