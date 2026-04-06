import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import type { SpendingConfig } from '../types/goals'

export function useSpendingConfig() {
  const [config, setConfig] = useState<SpendingConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await apiFetch<SpendingConfig | null>('/goals/config')
      setConfig(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не вдалося завантажити конфігурацію')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const saveConfig = useCallback(async (dailyLimit: number) => {
    const result = await apiFetch<SpendingConfig>('/goals/config', {
      method: 'PUT',
      body: JSON.stringify({ daily_limit: dailyLimit }),
    })
    setConfig(result)
    return result
  }, [])

  return { config, isLoading, error, refetch, saveConfig }
}
