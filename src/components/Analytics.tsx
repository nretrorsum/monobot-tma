import { useState, useMemo } from 'react'
import { useBalance } from '../hooks/useBalance'
import { useIncomeExpenses } from '../hooks/useIncomeExpenses'
import { useCategories } from '../hooks/useCategories'
import { useHistory } from '../hooks/useHistory'
import { useBurnRate } from '../hooks/useBurnRate'
import { IncomeExpensesChart } from './charts/IncomeExpensesChart'
import { CategoryDonut } from './charts/CategoryDonut'
import { BalanceHistoryChart } from './charts/BalanceHistory'
import { BurnRateChart } from './charts/BurnRateChart'
import { formatMoney, getCurrencySymbol } from '../utils/format'
import { getAccessToken } from '../lib/api'

type Period = 'month' | 'prev' | '90d'

function getPeriodDates(period: Period): { fromDate: string; toDate: string } {
  const now = new Date()
  const toDate = now.toISOString().split('T')[0]

  switch (period) {
    case 'month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      return { fromDate: from.toISOString().split('T')[0], toDate }
    }
    case 'prev': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const to = new Date(now.getFullYear(), now.getMonth(), 0)
      return { fromDate: from.toISOString().split('T')[0], toDate: to.toISOString().split('T')[0] }
    }
    case '90d': {
      const from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      return { fromDate: from.toISOString().split('T')[0], toDate }
    }
  }
}

// Mock data for dev mode
const mockAccounts = [
  { account_id: '8osPkXNM', display_name: '8osPkXNM', balance: 0, currency_code: 840, last_transaction_time: null },
  { account_id: 'gQAi6jmF', display_name: 'gQAi6jmF', balance: 0, currency_code: 978, last_transaction_time: null },
  { account_id: 'jasBTCYA', display_name: 'jasBTCYA', balance: 2761934, currency_code: 980, last_transaction_time: null },
]

const mockIncomeExpenses = { income: 2541269, expenses: 567782, savings: 1973487, savings_rate: 77.66, avg_per_day: 567782 }

const mockCategories = [
  { category: 'Туристичні агентства', amount: 198500, percentage: 35 },
  { category: 'Ресторани', amount: 132400, percentage: 23 },
  { category: 'Грошові перекази', amount: 105600, percentage: 19 },
  { category: 'Таксі', amount: 67200, percentage: 12 },
  { category: 'Продукти / Супермаркети', amount: 42500, percentage: 7 },
  { category: 'Громадський транспорт', amount: 21582, percentage: 4 },
]

const mockHistory = [
  { date: '2026-04-01', balance: 2750000 },
  { date: '2026-04-02', balance: 2735000 },
  { date: '2026-04-03', balance: 2761934 },
  { date: '2026-04-04', balance: 2761934 },
]

const mockBurnRate = [
  { date: '2026-04-01', expenses: 489200, avg7d: 320000 },
  { date: '2026-04-02', expenses: 78582, avg7d: 295000 },
  { date: '2026-04-03', expenses: 0, avg7d: 280000 },
  { date: '2026-04-04', expenses: 0, avg7d: 265000 },
]

const periods: { id: Period; label: string }[] = [
  { id: 'month', label: 'Цей місяць' },
  { id: 'prev', label: 'Минулий' },
  { id: '90d', label: '90 днів' },
]

export function Analytics() {
  const [period, setPeriod] = useState<Period>('month')
  const [selectedAccount, setSelectedAccount] = useState<string>('all')

  const hasToken = !!getAccessToken()
  const { fromDate, toDate } = useMemo(() => getPeriodDates(period), [period])

  const hookParams = useMemo(() => ({
    accountId: selectedAccount === 'all' ? undefined : selectedAccount,
    fromDate,
    toDate,
  }), [selectedAccount, fromDate, toDate])

  const { data: balanceData } = useBalance()
  const { data: incomeExpenses } = useIncomeExpenses(hookParams)
  const { data: categories } = useCategories(hookParams)
  const { data: history } = useHistory(hookParams)
  const { data: burnRate } = useBurnRate(hookParams)

  const accounts = hasToken && balanceData ? balanceData.accounts : mockAccounts
  const ie = hasToken && incomeExpenses ? incomeExpenses : mockIncomeExpenses
  const cats = hasToken && categories?.length ? categories : mockCategories
  const hist = hasToken && history?.length ? history : mockHistory
  const burn = hasToken && burnRate?.length ? burnRate : mockBurnRate

  return (
    <div className="flex flex-col gap-4">
      {/* Period selector */}
      <div className="flex gap-1 flex-wrap">
        {periods.map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: period === p.id ? '#7c5cfc' : '#1c1c22',
              color: period === p.id ? 'white' : '#6a6a7c',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Account cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedAccount('all')}
          className="min-w-[120px] p-3 rounded-2xl text-left shrink-0 transition-all"
          style={{
            backgroundColor: '#1c1c22',
            border: selectedAccount === 'all' ? '1px solid #6366f1' : '1px solid transparent',
          }}
        >
          <div className="text-xs mb-1 text-muted">Всі рахунки</div>
          <div className="text-sm font-bold text-green">
            {formatMoney(accounts.reduce((s, a) => a.currency_code === 980 ? s + a.balance : s, 0))}
          </div>
        </button>
        {accounts.map(acc => (
          <button
            key={acc.account_id}
            onClick={() => setSelectedAccount(acc.account_id)}
            className="min-w-[120px] p-3 rounded-2xl text-left shrink-0 transition-all"
            style={{
              backgroundColor: '#1c1c22',
              border: selectedAccount === acc.account_id ? '1px solid #6366f1' : '1px solid transparent',
            }}
          >
            <div className="text-xs mb-1 text-muted">{acc.display_name}</div>
            <div className="text-sm font-bold" style={{ color: acc.balance >= 0 ? '#3d9a6e' : '#c45252' }}>
              {formatMoney(acc.balance, acc.currency_code)}
            </div>
            <div className="text-xs text-muted">{getCurrencySymbol(acc.currency_code)}</div>
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-card-bg">
          <div className="text-xs mb-1 text-muted">Доходи</div>
          <div className="text-lg font-bold text-green">{formatMoney(ie.income)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-card-bg">
          <div className="text-xs mb-1 text-muted">Витрати</div>
          <div className="text-lg font-bold text-red">{formatMoney(ie.expenses)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-card-bg">
          <div className="text-xs mb-1 text-muted">Заощадження</div>
          <div className="text-lg font-bold text-light-purple">{formatMoney(ie.savings)}</div>
          <div className="text-xs text-muted">{ie.savings_rate.toFixed(1)}% від доходу</div>
        </div>
        <div className="p-4 rounded-2xl bg-card-bg">
          <div className="text-xs mb-1 text-muted">Середня/день</div>
          <div className="text-lg font-bold text-purple">{formatMoney(ie.avg_per_day)}</div>
        </div>
      </div>

      {/* Charts */}
      <IncomeExpensesChart income={ie.income} expenses={ie.expenses} savings={ie.savings} />

      <CategoryDonut
        data={cats.map(c => ({ name: c.category, value: c.amount }))}
      />

      <BalanceHistoryChart data={hist} />

      <BurnRateChart data={burn} />
    </div>
  )
}
