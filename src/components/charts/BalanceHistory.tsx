import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { formatDate } from '../../utils/format'
import type { BalanceHistoryPoint } from '../../hooks/useHistory'

interface BalanceHistoryProps {
  data: BalanceHistoryPoint[]
}

export function BalanceHistoryChart({ data }: BalanceHistoryProps) {
  const chartData = data.map(d => ({
    ...d,
    dateLabel: formatDate(d.date),
    balance: d.closing_balance,
  }))

  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <h3 className="text-sm font-medium text-white mb-4">Історія балансу</h3>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
            <XAxis
              dataKey="dateLabel" axisLine={false} tickLine={false}
              tick={{ fill: '#6a6a7c', fontSize: 10 }}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: '#6a6a7c', fontSize: 10 }}
              tickFormatter={v => `${(v / 100).toLocaleString('uk-UA')} ₴`}
              width={90}
              domain={['dataMin - 50000', 'dataMax + 50000']}
            />
            <Tooltip content={<ChartTooltip />} />
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone" dataKey="balance" stroke="#7c5cfc" strokeWidth={2}
              fill="url(#balanceGrad)" name="Баланс"
              dot={{ fill: '#7c5cfc', r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
