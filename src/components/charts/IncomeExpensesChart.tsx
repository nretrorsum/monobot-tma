import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface IncomeExpensesChartProps {
  income: number
  expenses: number
  savings: number
}

export function IncomeExpensesChart({ income, expenses, savings }: IncomeExpensesChartProps) {
  const data = [
    { name: 'Доходи', income, expenses: 0, savings: 0 },
    { name: 'Витрати', income: 0, expenses, savings: 0 },
    { name: 'Заощадже��ня', income: 0, expenses: 0, savings },
  ]

  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <h3 className="text-sm font-medium text-white mb-4">Доходи vs Витрати</h3>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
            <XAxis
              dataKey="name" axisLine={false} tickLine={false}
              tick={{ fill: '#6a6a7c', fontSize: 11 }}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: '#6a6a7c', fontSize: 10 }}
              tickFormatter={v => `${(v / 100).toLocaleString('uk-UA')} ₴`}
              width={90}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="income" fill="#3d9a6e" radius={[4, 4, 0, 0]} name="Доходи" />
            <Bar dataKey="expenses" fill="#c45252" radius={[4, 4, 0, 0]} name="Витрати" />
            <Bar dataKey="savings" fill="#8b6cc4" radius={[4, 4, 0, 0]} name="Заощадження" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
