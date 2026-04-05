import { GoalCard } from './GoalCard'
import { formatMoneyShort } from '../utils/format'

const DAILY_LIMIT = 135000 // 1350 грн in kopecks
const MONTHLY_INCOME = 6300000 // 63000 грн

const goals = [
  { id: 1, name: 'MacBook Pro M4', target: 7500000, saved: 4720000, icon: '💻', deadline: 'серпень 2026' },
  { id: 2, name: 'iPhone 17 Pro', target: 5500000, saved: 0, icon: '📱', deadline: 'вересень 2026' },
  { id: 3, name: 'Квартира', target: 6200000, saved: 0, icon: '🏠', deadline: 'листопад 2026' },
]

export function Goals() {
  const dailySavings = DAILY_LIMIT > 0 ? (MONTHLY_INCOME / 30) - DAILY_LIMIT : 0
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const totalPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <div className="flex flex-col gap-5">
      {/* Savings summary */}
      <div className="p-5 rounded-2xl bg-card-bg">
        <div className="text-center mb-4">
          <div className="text-xs mb-1 text-muted">
            При лімітах {formatMoneyShort(DAILY_LIMIT).replace(' ₴', '')} грн/день ти відкладаєш
          </div>
          <div className="text-3xl font-bold text-green">
            {formatMoneyShort(dailySavings * 30)}
          </div>
          <div className="text-xs text-muted">щомісяця</div>
        </div>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-white">{formatMoneyShort(dailySavings)}</div>
            <div className="text-xs text-muted">на день</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-white">{formatMoneyShort(dailySavings * 7)}</div>
            <div className="text-xs text-muted">на тиждень</div>
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-light">Мої цілі</h3>
        <div className="flex flex-col gap-3">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} dailySavings={dailySavings} />
          ))}
        </div>
      </div>

      {/* Overall progress */}
      <div className="p-5 rounded-2xl bg-card-bg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Загальний прогрес</h3>
          <span className="text-sm font-medium text-purple">{totalPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-page-bg">
          <div
            className="h-3 rounded-full"
            style={{
              width: `${totalPercent}%`,
              backgroundColor: '#7c5cfc',
              transition: 'width 0.8s ease',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-light">
            {formatMoneyShort(totalSaved).replace(' ₴', '')} грн зібрано
          </span>
          <span className="text-xs text-muted-light">
            {formatMoneyShort(totalTarget).replace(' ₴', '')} грн потрібно
          </span>
        </div>
      </div>

      {/* Motivational block */}
      <div
        className="p-4 rounded-2xl text-center"
        style={{ backgroundColor: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.15)' }}
      >
        <p className="text-sm" style={{ color: '#b8a5fc' }}>
          Тримай ліміт {formatMoneyShort(DAILY_LIMIT).replace(' ₴', '')} грн/день — і до кінця року закриєш
          всі 3 цілі + подорожі + подушка безпеки 52 500 грн
        </p>
      </div>
    </div>
  )
}
