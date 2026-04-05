import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'

export interface IncomeExpensesData {
  period_start: string
  period_end: string
  total_income: number
  total_expenses: number
  net_savings: number
  savings_rate: number | null
}

interface UseIncomeExpensesParams {
  accountId?: string
  fromDate?: string
  toDate?: string
}

export function useIncomeExpenses(params?: UseIncomeExpensesParams) {
  const [data, setData] = useState<IncomeExpensesData | null>(null)
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
      const result = await apiFetch<IncomeExpensesData>(`/balance/income-expenses${qs ? `?${qs}` : ''}`)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load income/expenses')
    } finally {
      setIsLoading(false)
    }
  }, [params?.accountId, params?.fromDate, params?.toDate])

  useEffect(() => { refetch() }, [refetch])

  return { data, isLoading, error, refetch }
}
