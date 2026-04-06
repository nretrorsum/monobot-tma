import { useState } from 'react'

interface SpendingConfigFormProps {
  onSave: (dailyLimit: number) => Promise<void>
  initialValue?: number
  isSubmitting: boolean
}

export function SpendingConfigForm({ onSave, initialValue, isSubmitting }: SpendingConfigFormProps) {
  const [amount, setAmount] = useState(initialValue ? String(initialValue / 100) : '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const value = Number(amount)
    if (!value || value <= 0) {
      setError('Введи суму більше 0')
      return
    }
    setError(null)
    await onSave(Math.round(value * 100))
  }

  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">💰</div>
        <h3 className="text-lg font-medium text-white mb-1">Встанови денний ліміт</h3>
        <p className="text-xs text-muted">
          Скільки ти хочеш витрачати на день? Все, що заощадиш — піде на цілі.
        </p>
      </div>
      <div className="flex gap-3 items-center mb-3">
        <input
          type="number"
          inputMode="numeric"
          placeholder="1350"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-page-bg text-white text-lg outline-none border border-transparent focus:border-purple"
        />
        <span className="text-muted text-sm">грн/день</span>
      </div>
      {error && <p className="text-red text-xs mb-3">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-purple text-white font-medium text-sm disabled:opacity-50"
      >
        {isSubmitting ? 'Зберігаю...' : 'Зберегти'}
      </button>
    </div>
  )
}
