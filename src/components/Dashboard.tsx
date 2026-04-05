import { CircularProgress } from './CircularProgress'
import { StatCard } from './StatCard'
import { TransactionItem } from './TransactionItem'
import { GoalCard } from './GoalCard'
import { useIncomeExpenses } from '../hooks/useIncomeExpenses'
import { formatMoneyShort } from '../utils/format'
import { getAccessToken } from '../lib/api'

const DAILY_LIMIT = 135000 // 1350 грн in kopecks
const MONTHLY_INCOME = 6300000

// Mock data for dev mode (no API)
const mockTransactions = [
  { id: 1, description: 'АТБ-Маркет', amount: -23400, time: '09:15', mcc: 'Продукти' },
  { id: 2, description: 'Bolt', amount: -8900, time: '10:32', mcc: 'Таксі' },
  { id: 3, description: 'Пузата Хата', amount: -18500, time: '13:10', mcc: 'Їжа поза домом' },
  { id: 4, description: 'Сільпо', amount: -12600, time: '17:45', mcc: 'Продукти' },
]

const mockGoal = {
  id: 1,
  name: 'MacBook Pro M4',
  target: 7500000,
  saved: 4720000,
  icon: '💻',
  deadline: 'серпень 2026',
}

export function Dashboard() {
  const hasToken = !!getAccessToken()
  const { data: incomeExpenses } = useIncomeExpenses()

  const transactions = mockTransactions
  const todaySpent = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const streak = 5
  const bestStreak = 12
  const dailySavings = DAILY_LIMIT > 0 ? (MONTHLY_INCOME / 30) - DAILY_LIMIT : 0

  return (
    <div className="flex flex-col gap-5">
      {/* Circular Progress */}
      <div className="p-5 rounded-2xl bg-card-bg">
        <CircularProgress spent={todaySpent} limit={DAILY_LIMIT} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Покупки" value={String(transactions.length)} />
        <StatCard label="Streak" value={`🔥 ${streak}`} color="#c4934a" />
        <StatCard label="Рекорд" value={`${bestStreak} дн`} />
      </div>

      {/* Today's Transactions */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-light">Сьогоднішні витрати</h3>
        <div className="flex flex-col gap-2">
          {transactions.map(tx => (
            <TransactionItem
              key={tx.id}
              description={tx.description}
              amount={tx.amount}
              time={tx.time}
              category={tx.mcc}
            />
          ))}
        </div>
      </div>

      {/* Income/Expenses Summary (from API) */}
      {hasToken && incomeExpenses && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Доходи за місяць</div>
            <div className="text-lg font-bold text-green">
              {formatMoneyShort(incomeExpenses.income)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Витрати за місяць</div>
            <div className="text-lg font-bold text-red">
              {formatMoneyShort(incomeExpenses.expenses)}
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
