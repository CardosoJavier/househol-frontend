import { createServerClient, serializeCookieHeader } from '@supabase/ssr'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { VITE_NEXT_PUBLIC_SUPABASE_URL, VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY } from '../../config'
export default function createClient(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(
    VITE_NEXT_PUBLIC_SUPABASE_URL,
    VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY,
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