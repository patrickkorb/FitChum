import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth callback called with:', { code: !!code, origin, next })

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Code exchange result:', { error: error?.message, user: !!data.user })
    
    if (!error && data.user) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      console.log('Redirect info:', { forwardedHost, isLocalEnv, origin })
      
      let redirectUrl;
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }
      
      console.log('Redirecting to:', redirectUrl)
      
      const response = NextResponse.redirect(redirectUrl)
      
      // Ensure cookies are set properly
      response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
      
      return response
    } else {
      console.log('Auth exchange failed:', error?.message)
    }
  } else {
    console.log('No code parameter found')
  }

  // return the user to an error page with instructions
  const errorUrl = `${origin}/auth/auth-code-error`
  console.log('Redirecting to error page:', errorUrl)
  return NextResponse.redirect(errorUrl)
}