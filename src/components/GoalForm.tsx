import { useState } from 'react'
import type { SavingsGoalResponse, CreateGoalRequest, UpdateGoalRequest } from '../types/goals'
import { extractEmoji } from '../utils/emoji'

const EMOJI_OPTIONS = ['🎯', '💻', '📱', '🏠', '🚗', '✈️', '🎓', '💍', '🏖️', '🎮', '📷', '🏋️', '💰', '🎁', '🐶']

interface GoalFormProps {
  mode: 'create' | 'edit'
  onSubmit: (data: CreateGoalRequest | UpdateGoalRequest) => Promise<void>
  onCancel: () => void
  availablePercent: number
  initialData?: SavingsGoalResponse
  isSubmitting: boolean
}

export function GoalForm({ mode, onSubmit, onCancel, availablePercent, initialData, isSubmitting }: GoalFormProps) {
  const initial = initialData ? extractEmoji(initialData.name) : { emoji: '🎯', cleanName: '' }

  const [emoji, setEmoji] = useState(initial.emoji)
  const [name, setName] = useState(initial.cleanName)
  const [amount, setAmount] = useState(initialData ? String(initialData.target_amount / 100) : '')
  const [deadline, setDeadline] = useState(initialData?.deadline ?? '')
  const [allocation, setAllocation] = useState(
    initialData ? String(initialData.allocation_percent) : String(Math.min(availablePercent, 100))
  )
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxPercent = mode === 'edit' && initialData
    ? availablePercent + initialData.allocation_percent
    : availablePercent

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Введи назву цілі')
      return
    }
    const targetAmount = Math.round(Number(amount) * 100)
    if (!targetAmount || targetAmount <= 0) {
      setError('Введи суму більше 0')
      return
    }
    const allocationPercent = Number(allocation)
    if (!allocationPercent || allocationPercent < 1 || allocationPercent > maxPercent) {
      setError(`Відсоток має бути від 1 до ${maxPercent}`)
      return
    }
    setError(null)

    const fullName = `${emoji} ${name.trim()}`

    if (mode === 'create') {
      const data: CreateGoalRequest = {
        name: fullName,
        target_amount: targetAmount,
        allocation_percent: allocationPercent,
      }
      if (deadline) data.deadline = deadline
      await onSubmit(data)
    } else {
      const data: UpdateGoalRequest = {
        name: fullName,
        target_amount: targetAmount,
        allocation_percent: allocationPercent,
        deadline: deadline || null,
      }
      await onSubmit(data)
    }
  }

  return (
    <div className="p-5 rounded-2xl bg-card-bg animate-fade-in">
      <h3 className="text-sm font-medium text-white mb-4">
        {mode === 'create' ? 'Нова ціль' : 'Редагувати ціль'}
      </h3>

      {/* Emoji picker */}
      <div className="mb-3">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-3xl p-2 rounded-xl bg-page-bg"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <div className="flex flex-wrap gap-2 mt-2 p-3 rounded-xl bg-page-bg">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => { setEmoji(e); setShowEmojiPicker(false) }}
                className={`text-2xl p-1 rounded-lg ${e === emoji ? 'bg-purple/20' : ''}`}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Назва цілі"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={255}
        className="w-full px-4 py-3 mb-3 rounded-xl bg-page-bg text-white text-sm outline-none border border-transparent focus:border-purple"
      />

      {/* Amount */}
      <div className="flex gap-3 items-center mb-3">
        <input
          type="number"
          inputMode="numeric"
          placeholder="Сума"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-page-bg text-white text-sm outline-none border border-transparent focus:border-purple"
        />
        <span className="text-muted text-sm">грн</span>
      </div>

      {/* Deadline */}
      <input
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        className="w-full px-4 py-3 mb-3 rounded-xl bg-page-bg text-white text-sm outline-none border border-transparent focus:border-purple"
      />

      {/* Allocation percent */}
      <div className="flex gap-3 items-center mb-3">
        <input
          type="number"
          inputMode="numeric"
          placeholder="Відсоток"
          value={allocation}
          onChange={e => setAllocation(e.target.value)}
          min={1}
          max={maxPercent}
          className="w-20 px-4 py-3 rounded-xl bg-page-bg text-white text-sm outline-none border border-transparent focus:border-purple"
        />
        <span className="text-muted text-xs">% заощаджень (вільно: {maxPercent}%)</span>
      </div>

      {error && <p className="text-red text-xs mb-3">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-page-bg text-muted-light font-medium text-sm"
        >
          Скасувати
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-purple text-white font-medium text-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Зберігаю...' : 'Зберегти'}
        </button>
      </div>
    </div>
  )
}
