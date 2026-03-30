import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('skeleton', className)} {...props} aria-hidden="true" />
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn('h-4 rounded', className)} />
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }
  return <Skeleton className={cn('rounded-full', sizes[size])} />
}

export function SkeletonBalanceCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonText className="w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <SkeletonText className="w-32" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonTransactionRow() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonText className="w-32" />
        <SkeletonText className="w-20 h-3" />
      </div>
      <div className="space-y-1.5 text-right">
        <SkeletonText className="w-20" />
        <Skeleton className="h-4 w-14 rounded-full ml-auto" />
      </div>
    </div>
  )
}

export function SkeletonTransactionList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1" aria-label="Carregando transações..." aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTransactionRow key={i} />
      ))}
    </div>
  )
}

export function SkeletonMarketCard() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1">
        <SkeletonText className="w-16" />
        <SkeletonText className="w-10 h-3" />
      </div>
      <div className="text-right space-y-1">
        <SkeletonText className="w-20" />
        <SkeletonText className="w-12 h-3 ml-auto" />
      </div>
    </div>
  )
}
