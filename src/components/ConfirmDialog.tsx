interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export function ConfirmDialog({ message, onConfirm, onCancel, isLoading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative p-5 rounded-2xl bg-card-bg w-full max-w-sm animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-white text-sm text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-page-bg text-muted-light font-medium text-sm"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-red text-white font-medium text-sm disabled:opacity-50"
          >
            {isLoading ? 'Видаляю...' : 'Видалити'}
          </button>
        </div>
      </div>
    </div>
  )
}
