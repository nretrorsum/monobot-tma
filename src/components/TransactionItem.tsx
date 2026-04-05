import { formatMoneyShort } from '../utils/format'

interface TransactionItemProps {
  description: string
  amount: number
  time: string
  category: string
}

export function TransactionItem({ description, amount, time, category }: TransactionItemProps) {
  const isExpense = amount < 0

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card-bg">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium bg-page-bg text-muted-light"
        >
          {category.slice(0, 3)}
        </div>
        <div>
          <div className="text-sm text-white">{description}</div>
          <div className="text-xs text-muted">{time} · {category}</div>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color: isExpense ? '#c45252' : '#3d9a6e' }}>
        {isExpense ? '-' : '+'}{formatMoneyShort(Math.abs(amount)).replace(' ₴', '')} ₴
      </span>
    </div>
  )
}
