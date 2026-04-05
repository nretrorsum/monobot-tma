import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { formatDate } from '../../utils/format'
import type { BurnRateDailyPoint } from '../../hooks/useBurnRate'

interface BurnRateChartProps {
  data: BurnRateDailyPoint[]
}

export function BurnRateChart({ data }: BurnRateChartProps) {
  const chartData = data.map(d => ({
    ...d,
    dateLabel: formatDate(d.date),
  }))

  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Burn Rate (витрати/день)</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded" style={{ backgroundColor: '#7c5cfc' }} />
            <span className="text-xs text-muted">Середня 7д</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#c45252', opacity: 0.7 }} />
            <span className="text-xs text-muted">Витрати</span>
          </div>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
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
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="expenses" fill="#c45252" fillOpacity={0.7}
              radius={[4, 4, 0, 0]} name="Витрати"
            />
            <Line
              type="monotone" dataKey="moving_avg_7d" stroke="#7c5cfc" strokeWidth={2}
              strokeDasharray="6 3" dot={false} name="Середня 7д"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
