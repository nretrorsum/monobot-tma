interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-card-bg ${className}`}
      style={{ background: 'linear-gradient(90deg, #1c1c22 25%, #252530 50%, #1c1c22 75%)', backgroundSize: '200% 100%' }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-card-bg">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
