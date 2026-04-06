import { useState } from 'react'
import { formatMoneyShort } from '../utils/format'
import { extractEmoji } from '../utils/emoji'
import type { SavingsGoalResponse } from '../types/goals'

interface GoalCardProps {
  goal: SavingsGoalResponse
  onEdit: (goal: SavingsGoalResponse) => void
  onDelete: (goalId: string) => void
  onComplete?: (goalId: string) => void
}

export function GoalCard({ goal, onEdit, onDelete, onComplete }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { emoji, cleanName } = extractEmoji(goal.name)

  const progressColor = goal.status === 'completed'
    ? '#3d9a6e'
    : goal.on_track === false
      ? '#c4934a'
      : '#7c5cfc'

  const formatDeadline = (date: string) => {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
  }

  const daysLabel = (() => {
    if (goal.status === 'completed') return 'Досягнуто!'
    if (goal.days_remaining === null) return 'Без дедлайну'
    if (goal.days_remaining < 0) return `Прострочено на ${Math.abs(goal.days_remaining)} дн.`
    if (goal.days_remaining <= 30) return `${goal.days_remaining} дн. до дедлайну`
    return `~${Math.ceil(goal.days_remaining / 30)} міс. до дедлайну`
  })()

  return (
    <div className="p-4 rounded-2xl bg-card-bg relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div>
            <div className="font-medium text-white text-sm">{cleanName}</div>
            <div className="text-xs text-muted">
              {goal.deadline ? formatDeadline(goal.deadline) : 'Без дедлайну'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium text-white">
              {formatMoneyShort(goal.current_saved).replace(' ₴', '')}
            </div>
            <div className="text-xs text-muted">
              з {formatMoneyShort(goal.target_amount).replace(' ₴', '')} грн
            </div>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-muted-light text-lg px-1"
          >
            ⋯
          </button>
        </div>
      </div>

      {/* Menu */}
      {showMenu && (
        <div className="absolute right-4 top-12 z-10 rounded-xl bg-page-bg border border-muted/20 overflow-hidden animate-fade-in">
          <button
            onClick={() => { setShowMenu(false); onEdit(goal) }}
            className="block w-full px-4 py-2.5 text-left text-sm text-white hover:bg-card-bg"
          >
            Редагувати
          </button>
          {goal.status === 'active' && onComplete && (
            <button
              onClick={() => { setShowMenu(false); onComplete(goal.id) }}
              className="block w-full px-4 py-2.5 text-left text-sm text-green hover:bg-card-bg"
            >
              Завершити
            </button>
          )}
          <button
            onClick={() => { setShowMenu(false); onDelete(goal.id) }}
            className="block w-full px-4 py-2.5 text-left text-sm text-red hover:bg-card-bg"
          >
            Видалити
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-page-bg mb-2">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${Math.min(goal.progress_percent, 100)}%`,
            backgroundColor: progressColor,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-light">{goal.progress_percent.toFixed(0)}%</span>
        <div className="flex items-center gap-2">
          {goal.on_track === false && goal.status === 'active' && (
            <span className="text-xs text-orange">Відстає</span>
          )}
          <span className="text-xs text-muted-light">{daysLabel}</span>
        </div>
      </div>
    </div>
  )
}
