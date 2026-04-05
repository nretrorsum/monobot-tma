import { formatMoneyShort } from '../utils/format'

interface Goal {
  id: number
  name: string
  target: number
  saved: number
  icon: string
  deadline: string
}

interface GoalCardProps {
  goal: Goal
  dailySavings: number
}

export function GoalCard({ goal, dailySavings }: GoalCardProps) {
  const percentage = (goal.saved / goal.target) * 100
  const remaining = goal.target - goal.saved
  const daysLeft = dailySavings > 0 ? Math.ceil(remaining / dailySavings) : Infinity
  const monthsLeft = Math.ceil(daysLeft / 30)

  return (
    <div className="p-4 rounded-2xl bg-card-bg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{goal.icon}</span>
          <div>
            <div className="font-medium text-white text-sm">{goal.name}</div>
            <div className="text-xs text-muted">{goal.deadline}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-white">
            {formatMoneyShort(goal.saved).replace(' ₴', '')}
          </div>
          <div className="text-xs text-muted">
            з {formatMoneyShort(goal.target).replace(' ₴', '')} грн
          </div>
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-page-bg mb-2">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: percentage >= 100 ? '#3d9a6e' : '#7c5cfc',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-muted-light">{percentage.toFixed(0)}%</span>
        <span className="text-xs text-muted-light">
          {daysLeft === Infinity
            ? '—'
            : monthsLeft <= 1
              ? `${daysLeft} днів`
              : `~${monthsLeft} міс`
          } до цілі
        </span>
      </div>
    </div>
  )
}
