import { useState, useEffect } from 'react'
import { getInitData, isDev } from '../lib/telegram'
import { authenticateWithTelegram } from '../lib/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function auth() {
      console.log('[useAuth] Starting auth flow...')
      console.log('[useAuth] API URL:', import.meta.env.VITE_API_URL)
      console.log('[useAuth] DEV mode:', isDev())

      try {
        const initData = getInitData()

        if (!initData) {
          if (isDev()) {
            console.warn('[useAuth] No initData — dev mode, skipping auth')
            setIsAuthenticated(true)
            return
          }
          throw new Error('No initData — app must be opened from Telegram')
        }

        console.log('[useAuth] Got initData, authenticating...')
        await authenticateWithTelegram(initData)
        console.log('[useAuth] Auth successful!')
        setIsAuthenticated(true)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Auth failed'
        console.error('[useAuth] Auth error:', msg)
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }
    auth()
  }, [])

  return { isAuthenticated, isLoading, error }
}
