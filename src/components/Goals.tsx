import { useState } from 'react'
import { GoalCard } from './GoalCard'
import { GoalForm } from './GoalForm'
import { SpendingConfigForm } from './SpendingConfigForm'
import { ConfirmDialog } from './ConfirmDialog'
import { useSpendingConfig } from '../hooks/useSpendingConfig'
import { useGoals } from '../hooks/useGoals'
import { formatMoneyShort } from '../utils/format'
import type { SavingsGoalResponse, CreateGoalRequest, UpdateGoalRequest } from '../types/goals'

export function Goals() {
  const { config, isLoading: configLoading, error: configError, refetch: refetchConfig, saveConfig } = useSpendingConfig()
  const { goals, isLoading: goalsLoading, error: goalsError, refetch: refetchGoals, createGoal, updateGoal, deleteGoal } = useGoals()

  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoalResponse | null>(null)
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null)
  const [showConfigEdit, setShowConfigEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isLoading = configLoading || goalsLoading
  const error = configError || goalsError

  const activeGoals = goals.filter(g => g.status === 'active')
  const usedPercent = activeGoals.reduce((sum, g) => sum + g.allocation_percent, 0)
  const availablePercent = 100 - usedPercent

  const totalSaved = goals.reduce((s, g) => s + g.current_saved, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)
  const totalPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  const totalDailySavings = activeGoals.reduce((s, g) => s + g.daily_savings_rate, 0)

  const handleSaveConfig = async (dailyLimit: number) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await saveConfig(dailyLimit)
      setShowConfigEdit(false)
      await refetchGoals()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Помилка збереження')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateGoal = async (data: CreateGoalRequest | UpdateGoalRequest) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await createGoal(data as CreateGoalRequest)
      setShowGoalForm(false)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Помилка створення')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditGoal = async (data: CreateGoalRequest | UpdateGoalRequest) => {
    if (!editingGoal) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await updateGoal(editingGoal.id, data as UpdateGoalRequest)
      setEditingGoal(null)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Помилка оновлення')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteGoal = async () => {
    if (!deletingGoalId) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await deleteGoal(deletingGoalId)
      setDeletingGoalId(null)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Помилка видалення')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteGoal = async (goalId: string) => {
    setIsSubmitting(true)
    try {
      await updateGoal(goalId, { status: 'completed' })
    } catch {
      // silent
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-2xl bg-card-bg animate-pulse" />
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-5 rounded-2xl bg-card-bg text-center">
        <p className="text-red text-sm mb-3">{error}</p>
        <button
          onClick={() => { refetchConfig(); refetchGoals() }}
          className="px-4 py-2 rounded-xl bg-purple text-white text-sm"
        >
          Повторити
        </button>
      </div>
    )
  }

  // Onboarding — no config set
  if (!config) {
    return (
      <div className="flex flex-col gap-5">
        <SpendingConfigForm onSave={handleSaveConfig} isSubmitting={isSubmitting} />
        {submitError && <p className="text-red text-xs text-center">{submitError}</p>}
      </div>
    )
  }

  const deletingGoal = deletingGoalId ? goals.find(g => g.id === deletingGoalId) : null

  return (
    <div className="flex flex-col gap-5">
      {/* Savings summary */}
      <div className="p-5 rounded-2xl bg-card-bg">
        <div className="text-center mb-4">
          <div className="text-xs mb-1 text-muted">
            При лімітах {formatMoneyShort(config.daily_limit).replace(' ₴', '')} грн/день ти відкладаєш
          </div>
          <div className="text-3xl font-bold text-green">
            {formatMoneyShort(totalDailySavings * 30)}
          </div>
          <div className="text-xs text-muted">щомісяця</div>
        </div>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-white">{formatMoneyShort(totalDailySavings)}</div>
            <div className="text-xs text-muted">на день</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-white">{formatMoneyShort(totalDailySavings * 7)}</div>
            <div className="text-xs text-muted">на тиждень</div>
          </div>
        </div>
        <button
          onClick={() => setShowConfigEdit(!showConfigEdit)}
          className="block mx-auto mt-3 text-xs text-purple"
        >
          Змінити ліміт
        </button>
      </div>

      {/* Config edit inline */}
      {showConfigEdit && (
        <SpendingConfigForm
          onSave={handleSaveConfig}
          initialValue={config.daily_limit}
          isSubmitting={isSubmitting}
        />
      )}

      {submitError && <p className="text-red text-xs text-center">{submitError}</p>}

      {/* Goal cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-light">Мої цілі</h3>
          {availablePercent > 0 && !showGoalForm && !editingGoal && (
            <button
              onClick={() => setShowGoalForm(true)}
              className="text-xs text-purple font-medium"
            >
              + Додати ціль
            </button>
          )}
        </div>

        {/* Create form */}
        {showGoalForm && (
          <div className="mb-3">
            <GoalForm
              mode="create"
              onSubmit={handleCreateGoal}
              onCancel={() => setShowGoalForm(false)}
              availablePercent={availablePercent}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Edit form */}
        {editingGoal && (
          <div className="mb-3">
            <GoalForm
              mode="edit"
              onSubmit={handleEditGoal}
              onCancel={() => setEditingGoal(null)}
              availablePercent={availablePercent}
              initialData={editingGoal}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {goals.length === 0 ? (
            <div className="p-5 rounded-2xl bg-card-bg text-center">
              <p className="text-muted text-sm">Поки що немає цілей. Створи першу!</p>
            </div>
          ) : (
            goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={setEditingGoal}
                onDelete={setDeletingGoalId}
                onComplete={handleCompleteGoal}
              />
            ))
          )}
        </div>
      </div>

      {/* Overall progress */}
      {goals.length > 0 && (
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
      )}

      {/* Motivational block */}
      {activeGoals.length > 0 && (
        <div
          className="p-4 rounded-2xl text-center"
          style={{ backgroundColor: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.15)' }}
        >
          <p className="text-sm" style={{ color: '#b8a5fc' }}>
            {activeGoals.every(g => g.on_track !== false)
              ? `Ти в графіку! Тримай ліміт ${formatMoneyShort(config.daily_limit).replace(' ₴', '')} грн/день`
              : `${activeGoals.filter(g => g.on_track === false).length} з ${activeGoals.length} цілей відстають — спробуй зменшити витрати`
            }
          </p>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingGoal && (
        <ConfirmDialog
          message={`Видалити ціль "${deletingGoal.name}"?`}
          onConfirm={handleDeleteGoal}
          onCancel={() => setDeletingGoalId(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}
