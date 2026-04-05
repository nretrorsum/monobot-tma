import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'

export interface AccountBalance {
  account_id: string
  currency_code: number
  balance: number
  display_name: string
  last_transaction_time: string | null
}

export interface UserBalanceSummary {
  accounts: AccountBalance[]
  totals_by_currency: Record<string, number>
}

export function useBalance() {
  const [data, setData] = useState<UserBalanceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await apiFetch<UserBalanceSummary>('/balance/')
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load balance')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  return { data, isLoading, error, refetch }
}
