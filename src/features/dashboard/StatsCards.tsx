import { memo, useMemo } from 'react'
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react'
import { useTransactions } from '@/hooks/useFinance'
import { Card } from '@/components/ui/Card'
import { SkeletonText, Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency, formatCompactNumber } from '@/utils/formatters'
import { cn } from '@/lib/utils'
import type { Currency } from '@/types'


interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  delay?: number
}

const StatCard = memo(
  ({ title, value, subtitle, icon: Icon, trend, trendValue, delay = 0 }: StatCardProps) => {
    const trendColor = {
      up: 'text-emerald-400',
      down: 'text-destructive',
      neutral: 'text-muted-foreground',
    }[trend ?? 'neutral']

    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

    return (
      <Card
        variant="elevated"
        padding="sm"
        className={cn('space-y-3 animate-in', `animation-delay-${delay}`)}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {title}
          </p>
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>

        <div>
          <p className="financial-value font-bold text-xl text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        {trendValue && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            {trend !== 'neutral' && <TrendIcon className="h-3 w-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </Card>
    )
  },
)
StatCard.displayName = 'StatCard'

function StatCardSkeleton() {
  return (
    <Card variant="elevated" padding="sm" className="space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonText className="w-20" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <div className="space-y-1">
        <SkeletonText className="w-24 h-6" />
        <SkeletonText className="w-16 h-3" />
      </div>
      <SkeletonText className="w-14 h-3" />
    </Card>
  )
}

export const StatsCards = memo(() => {
  const { data, isLoading } = useTransactions(1)

  const stats = useMemo(() => {
    if (!data?.data) return null

    const transactions = data.data
    const sent = transactions
      .filter((t) => t.type === 'transfer_sent' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    const received = transactions
      .filter((t) => t.type === 'transfer_received' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    const defiVolume = transactions
      .filter((t) => (t.type === 'defi_swap' || t.type === 'defi_stake') && t.status === 'completed')
      .reduce((sum, t) => sum + (t.convertedAmount ?? t.amount), 0)

    const internationalCount = transactions.filter(
      (t) => t.convertedCurrency && t.convertedCurrency !== t.currency,
    ).length

    return { sent, received, defiVolume, internationalCount }
  }, [data])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        title="Enviado"
        value={formatCurrency(stats?.sent ?? 0, 'BRL')}
        subtitle="este mês"
        icon={TrendingDown}
        trend="neutral"
        trendValue="3 transferências"
        delay={100}
      />
      <StatCard
        title="Recebido"
        value={formatCurrency(stats?.received ?? 0, 'BRL')}
        subtitle="este mês"
        icon={TrendingUp}
        trend="up"
        trendValue="+12% vs. mês anterior"
        delay={200}
      />
      <StatCard
        title="Volume DeFi"
        value={`$${formatCompactNumber(stats?.defiVolume ?? 0)}`}
        subtitle="em USD"
        icon={Activity}
        trend="up"
        trendValue="Uniswap + Aave"
        delay={300}
      />
      <StatCard
        title="Internacional"
        value={String(stats?.internationalCount ?? 0)}
        subtitle="transferências"
        icon={Globe}
        trend="neutral"
        trendValue="3 países distintos"
        delay={400}
      />
    </div>
  )
})
StatsCards.displayName = 'StatsCards'
