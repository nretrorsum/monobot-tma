import { formatMoneyShort } from '../utils/format'

interface CircularProgressProps {
  spent: number
  limit: number
  size?: number
}

export function CircularProgress({ spent, limit, size = 220 }: CircularProgressProps) {
  const percentage = Math.min((spent / limit) * 100, 100)
  const overLimit = spent > limit
  const overAmount = spent - limit
  const remaining = limit - spent
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const color = overLimit ? '#c45252' : percentage > 80 ? '#c4934a' : '#3d9a6e'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#1c1c22" strokeWidth="10" fill="none"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth="10" fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-muted-light">сьогодні</span>
          <span className="text-3xl font-bold" style={{ color }}>
            {formatMoneyShort(spent).replace(' ₴', '')}
          </span>
          <span className="text-sm text-muted-light">
            з {formatMoneyShort(limit).replace(' ₴', '')} грн
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        {overLimit ? (
          <div className="px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(196,82,82,0.12)' }}>
            <span className="text-sm font-medium text-red">
              Ліміт перевищено на {formatMoneyShort(overAmount).replace(' ₴', '')} грн
            </span>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(61,154,110,0.12)' }}>
            <span className="text-sm font-medium text-green">
              Залишилось {formatMoneyShort(remaining).replace(' ₴', '')} грн на сьогодні
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
