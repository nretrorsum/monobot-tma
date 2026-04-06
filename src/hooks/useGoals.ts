import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import type { SavingsGoalResponse, CreateGoalRequest, UpdateGoalRequest } from '../types/goals'

export function useGoals() {
  const [goals, setGoals] = useState<SavingsGoalResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await apiFetch<SavingsGoalResponse[]>('/goals/')
      setGoals(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не вдалося завантажити цілі')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const createGoal = useCallback(async (data: CreateGoalRequest) => {
    const result = await apiFetch<SavingsGoalResponse>('/goals/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    setGoals(prev => [...prev, result])
    return result
  }, [])

  const updateGoal = useCallback(async (goalId: string, data: UpdateGoalRequest) => {
    const result = await apiFetch<SavingsGoalResponse>(`/goals/${goalId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    setGoals(prev => prev.map(g => g.id === goalId ? result : g))
    return result
  }, [])

  const deleteGoal = useCallback(async (goalId: string) => {
    await apiFetch<void>(`/goals/${goalId}`, { method: 'DELETE' })
    setGoals(prev => prev.filter(g => g.id !== goalId))
  }, [])

  return { goals, isLoading, error, refetch, createGoal, updateGoal, deleteGoal }
}
