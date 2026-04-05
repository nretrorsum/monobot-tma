import { useState, useEffect } from 'react'
import { getInitData, isDev } from '../lib/telegram'
import { authenticateWithTelegram } from '../lib/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function auth() {
      try {
        const initData = getInitData()

        if (!initData) {
          if (isDev()) {
            console.warn('[Auth] No initData — dev mode, skipping auth')
            setIsAuthenticated(true)
            return
          }
          throw new Error('No initData — app must be opened from Telegram')
        }

        await authenticateWithTelegram(initData)
        setIsAuthenticated(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Auth failed')
      } finally {
        setIsLoading(false)
      }
    }
    auth()
  }, [])

  return { isAuthenticated, isLoading, error }
}
