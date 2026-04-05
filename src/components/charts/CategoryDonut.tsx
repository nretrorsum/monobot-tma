import { PieChart, Pie, Cell, ResponsiveContainer, type PieLabelRenderProps } from 'recharts'

const COLORS = ['#8b6cc4', '#c45252', '#3d9a6e', '#5a8fa8', '#9b5ca8', '#4a9e90', '#c4934a']

interface CategoryData {
  name: string
  value: number
}

interface CategoryDonutProps {
  data: CategoryData[]
}

function renderLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props as {
    cx: number; cy: number; midAngle: number;
    innerRadius: number; outerRadius: number; percent: number
  }
  if (!percent || percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function CategoryDonut({ data }: CategoryDonutProps) {
  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <h3 className="text-sm font-medium text-white mb-4">Витрати по категоріях</h3>
      <div className="flex items-center gap-4">
        <div style={{ width: 180, height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={renderLabel}
                strokeWidth={2}
                stroke="#16161a"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-muted-light">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
