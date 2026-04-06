export interface SpendingConfig {
  id: string
  daily_limit: number
  created_at: string
  updated_at: string
}

export interface SavingsGoalResponse {
  id: string
  name: string
  target_amount: number
  deadline: string | null
  status: 'active' | 'completed' | 'cancelled'
  allocation_percent: number
  created_at: string
  current_saved: number
  progress_percent: number
  daily_savings_rate: number
  projected_completion: string | null
  on_track: boolean | null
  days_remaining: number | null
  shortfall_per_day: number | null
}

export interface CreateGoalRequest {
  name: string
  target_amount: number
  deadline?: string
  allocation_percent?: number
}

export interface UpdateGoalRequest {
  name?: string
  target_amount?: number
  deadline?: string | null
  allocation_percent?: number
  status?: 'active' | 'completed' | 'cancelled'
}
