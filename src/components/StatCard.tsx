interface StatCardProps {
  label: string
  value: string
  color?: string
}

export function StatCard({ label, value, color = 'white' }: StatCardProps) {
  return (
    <div className="p-3 rounded-xl text-center bg-card-bg">
      <div className="text-xs mb-1 text-muted">{label}</div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
    </div>
  )
}
