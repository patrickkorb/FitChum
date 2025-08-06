'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Magic Link wurde an deine E-Mail gesendet!')
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
      // Note: Loading state will be maintained during redirect
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
      setLoading(false)
    }
  }

  return (
    <Card className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
          Willkommen bei FitChum!
        </h1>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70">
          Melde dich an oder erstelle einen Account um loszulegen
        </p>
      </div>

      {/* Google Auth Button */}
      <Button
        onClick={handleGoogleAuth}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? 'Wird geladen...' : 'Mit Google fortfahren'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-dark/20 dark:border-neutral-light/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-light dark:bg-neutral-dark px-2 text-neutral-dark/70 dark:text-neutral-light/70">
            Oder
          </span>
        </div>
      </div>

      {/* Magic Link Form */}
      <form onSubmit={handleMagicLink} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
            E-Mail-Adresse
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine.email@beispiel.de"
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-transparent text-neutral-dark dark:text-neutral-light focus:border-primary focus:outline-none transition-colors"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !email}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Wird gesendet...' : 'Magic Link senden'}
        </Button>
      </form>

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-primary/10 text-primary text-sm text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {/* Info text */}
      <div className="text-center text-sm text-neutral-dark/70 dark:text-neutral-light/70">
        Mit der Anmeldung stimmst du unseren{' '}
        <a href="/terms" className="text-primary hover:underline">
          AGB
        </a>{' '}
        und{' '}
        <a href="/privacy" className="text-primary hover:underline">
          Datenschutzbestimmungen
        </a>{' '}
        zu.
      </div>
    </Card>
  )
}