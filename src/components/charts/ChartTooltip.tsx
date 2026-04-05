import { formatMoney } from '../../utils/format'

interface TooltipPayload {
  name: string
  value: number
  color?: string
  fill?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="px-3 py-2 rounded-lg text-xs bg-card-bg" style={{ border: '1px solid #334155' }}>
      <div className="text-muted-light">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {formatMoney(p.value)}
        </div>
      ))}
    </div>
  )
}
