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

const periods: { id: Period; label: string }[] = [
  { id: 'month', label: 'Цей місяць' },
  { id: 'prev', label: 'Минулий' },
  { id: '90d', label: '90 днів' },
]

export function Analytics() {
  const [period, setPeriod] = useState<Period>('month')
  const [selectedAccount, setSelectedAccount] = useState<string>('all')

  const { fromDate, toDate } = useMemo(() => getPeriodDates(period), [period])

  const hookParams = useMemo(() => ({
    accountId: selectedAccount === 'all' ? undefined : selectedAccount,
    fromDate,
    toDate,
  }), [selectedAccount, fromDate, toDate])

  const { data: balanceData, isLoading: balanceLoading } = useBalance()
  const { data: incomeExpenses, isLoading: ieLoading } = useIncomeExpenses(hookParams)
  const { data: categories, isLoading: catLoading } = useCategories(hookParams)
  const { data: history, isLoading: histLoading } = useHistory(hookParams)
  const { data: burnRate, isLoading: burnLoading } = useBurnRate(hookParams)

  const accounts = balanceData?.accounts ?? []

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
      {balanceLoading ? (
        <div className="h-20 rounded-2xl bg-card-bg animate-pulse" />
      ) : (
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
      )}

      {/* Summary stats */}
      {ieLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-card-bg animate-pulse" />
          ))}
        </div>
      ) : incomeExpenses ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Доходи</div>
            <div className="text-lg font-bold text-green">{formatMoney(incomeExpenses.income)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Витрати</div>
            <div className="text-lg font-bold text-red">{formatMoney(incomeExpenses.expenses)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Заощадження</div>
            <div className="text-lg font-bold text-light-purple">{formatMoney(incomeExpenses.savings)}</div>
            <div className="text-xs text-muted">{incomeExpenses.savings_rate.toFixed(1)}% від доходу</div>
          </div>
          <div className="p-4 rounded-2xl bg-card-bg">
            <div className="text-xs mb-1 text-muted">Середня/день</div>
            <div className="text-lg font-bold text-purple">{formatMoney(incomeExpenses.avg_per_day)}</div>
          </div>
        </div>
      ) : (
        <p className="text-muted text-sm text-center py-4">Немає даних за обраний період</p>
      )}

      {/* Charts */}
      {incomeExpenses && (
        <IncomeExpensesChart
          income={incomeExpenses.income}
          expenses={incomeExpenses.expenses}
          savings={incomeExpenses.savings}
        />
      )}

      {catLoading ? (
        <div className="h-60 rounded-2xl bg-card-bg animate-pulse" />
      ) : categories.length > 0 ? (
        <CategoryDonut data={categories.map(c => ({ name: c.category, value: c.amount }))} />
      ) : null}

      {histLoading ? (
        <div className="h-60 rounded-2xl bg-card-bg animate-pulse" />
      ) : history.length > 0 ? (
        <BalanceHistoryChart data={history} />
      ) : null}

      {burnLoading ? (
        <div className="h-60 rounded-2xl bg-card-bg animate-pulse" />
      ) : burnRate.length > 0 ? (
        <BurnRateChart data={burnRate} />
      ) : null}
    </div>
  )
}
