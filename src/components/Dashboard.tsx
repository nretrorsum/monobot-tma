import { useMemo } from 'react'
import { CircularProgress } from './CircularProgress'
import { GoalCard } from './GoalCard'
import { useIncomeExpenses } from '../hooks/useIncomeExpenses'
import { useHistory } from '../hooks/useHistory'
import { useBalance } from '../hooks/useBalance'
import { useSpendingConfig } from '../hooks/useSpendingConfig'
import { useGoals } from '../hooks/useGoals'
import { formatMoneyShort } from '../utils/format'

export function Dashboard() {
  const today = useMemo(() => {
    const d = new Date().toISOString().split('T')[0]
    return { fromDate: d, toDate: d }
  }, [])

  const { data: todayHistory, isLoading: todayLoading } = useHistory(today)
  const { data: incomeExpenses, isLoading: ieLoading } = useIncomeExpenses()
  const { data: balanceData, isLoading: balanceLoading } = useBalance()
  const { config } = useSpendingConfig()
  const { goals } = useGoals()

  const todaySpent = todayHistory.reduce((sum, d) => sum + d.expenses, 0)
  const dailyLimit = config?.daily_limit ?? 0

  const nearestGoal = goals
    .filter(g => g.status === 'active')
    .sort((a, b) => b.progress_percent - a.progress_percent)[0] ?? null

  return (
    <div className="flex flex-col gap-5">
      {/* Circular Progress — витрати за сьогодні */}
      <div className="p-5 rounded-2xl bg-card-bg">
        {todayLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <CircularProgress spent={todaySpent} limit={dailyLimit} />
        )}
      </div>

      {/* Доходи/витрати за місяць */}
      {(balanceLoading || ieLoading) ? (
        <div className="h-20 rounded-2xl bg-card-bg animate-pulse" />
      ) : (balanceData && incomeExpenses) && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Доходи за місяць</div>
            <div className="text-lg font-bold text-green">
              {formatMoneyShort(incomeExpenses.total_income)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Витра��и за місяць</div>
            <div className="text-lg font-bold text-red">
              {formatMoneyShort(incomeExpenses.total_expenses)}
            </div>
          </div>
        </div>
      )}

      {/* Nearest Goal */}
      {nearestGoal && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-light">Найближча ці��ь</h3>
            <button className="text-xs text-purple">Всі цілі →</button>
          </div>
          <GoalCard
            goal={nearestGoal}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      )}
    </div>
  )
}
