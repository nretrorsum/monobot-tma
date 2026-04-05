import { CircularProgress } from './CircularProgress'
import { GoalCard } from './GoalCard'
import { useIncomeExpenses } from '../hooks/useIncomeExpenses'
import { useBalance } from '../hooks/useBalance'
import { formatMoneyShort } from '../utils/format'

const DAILY_LIMIT = 135000 // 1350 грн in kopecks
const MONTHLY_INCOME = 6300000

const mockGoal = {
  id: 1,
  name: 'MacBook Pro M4',
  target: 7500000,
  saved: 4720000,
  icon: '💻',
  deadline: 'серпень 2026',
}

export function Dashboard() {
  const { data: incomeExpenses, isLoading: ieLoading } = useIncomeExpenses()
  const { data: balanceData, isLoading: balanceLoading } = useBalance()

  const todaySpent = incomeExpenses?.expenses ?? 0
  const dailySavings = DAILY_LIMIT > 0 ? (MONTHLY_INCOME / 30) - DAILY_LIMIT : 0

  return (
    <div className="flex flex-col gap-5">
      {/* Circular Progress */}
      <div className="p-5 rounded-2xl bg-card-bg">
        {ieLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <CircularProgress spent={todaySpent} limit={DAILY_LIMIT} />
        )}
      </div>

      {/* Balance */}
      {balanceLoading ? (
        <div className="h-20 rounded-2xl bg-card-bg animate-pulse" />
      ) : balanceData && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Доходи за місяць</div>
            <div className="text-lg font-bold text-green">
              {formatMoneyShort(incomeExpenses?.income ?? 0)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Витрати за місяць</div>
            <div className="text-lg font-bold text-red">
              {formatMoneyShort(incomeExpenses?.expenses ?? 0)}
            </div>
          </div>
        </div>
      )}

      {/* Nearest Goal */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-light">Найближча ціль</h3>
          <button className="text-xs text-purple">Всі цілі →</button>
        </div>
        <GoalCard goal={mockGoal} dailySavings={dailySavings} />
      </div>
    </div>
  )
}
