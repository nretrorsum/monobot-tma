import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'

export interface BurnRatePoint {
  date: string
  expenses: number
  avg7d: number
}

interface UseBurnRateParams {
  accountId?: string
  fromDate?: string
  toDate?: string
}

export function useBurnRate(params?: UseBurnRateParams) {
  const [data, setData] = useState<BurnRatePoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params?.accountId) query.set('account_id', params.accountId)
      if (params?.fromDate) query.set('from_date', params.fromDate)
      if (params?.toDate) query.set('to_date', params.toDate)
      const qs = query.toString()
      const result = await apiFetch<BurnRatePoint[]>(`/balance/burn-rate${qs ? `?${qs}` : ''}`)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load burn rate')
    } finally {
      setIsLoading(false)
    }
  }, [params?.accountId, params?.fromDate, params?.toDate])

  useEffect(() => { refetch() }, [refetch])

  return { data, isLoading, error, refetch }
}
