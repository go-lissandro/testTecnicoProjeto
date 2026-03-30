import { memo } from 'react'
import { ArrowRight } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { BalanceCard } from '@/features/dashboard/BalanceCard'
import { TransactionList } from '@/features/dashboard/TransactionList'
import { StatsCards } from '@/features/dashboard/StatsCards'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'

const DashboardPage = memo(() => {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name?.split(' ')[0] ?? 'Usuário'

  const greetingHour = new Date().getHours()
  const greeting =
    greetingHour < 12 ? 'Bom dia' : greetingHour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 animate-in">
          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-0.5">
              {firstName}{' '}
              <span className="inline-block animate-wave" aria-hidden="true">👋</span>
            </h1>
          </div>
          <LinkButton variant="gradient" size="sm" to="/transfer">
            Nova transferência
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in animation-delay-100">
          <div className="lg:col-span-1">
            <BalanceCard />
          </div>
          <div className="lg:col-span-2">
            <Card variant="elevated" padding="sm" className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Mercados</CardTitle>
                  <span className="text-2xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Ao vivo
                  </span>
                </div>
              </CardHeader>
              <div className="mt-3 space-y-2">
                {MARKET_DATA.map((asset) => (
                  <MarketRow key={asset.symbol} {...asset} />
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="animate-in animation-delay-200">
          <StatsCards />
        </div>

        <Card variant="elevated" padding="none" className="animate-in animation-delay-300">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-border">
            <div>
              <h2 className="font-display font-semibold text-base">Últimas transações</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Movimentações recentes da sua conta
              </p>
            </div>
            <LinkButton variant="ghost" size="xs" to="/dashboard">
              Ver todas
              <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </div>
          <div className="p-2">
            <TransactionList limit={6} />
          </div>
        </Card>
      </div>
    </AppLayout>
  )
})

DashboardPage.displayName = 'DashboardPage'

interface MarketRowData {
  symbol: string
  name: string
  price: string
  change: number
}

const MARKET_DATA: MarketRowData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 'R$ 318.540', change: 2.41 },
  { symbol: 'ETH', name: 'Ethereum', price: 'R$ 18.720', change: -1.12 },
  { symbol: 'USDC', name: 'USD Coin', price: 'R$ 5,21', change: 0.02 },
  { symbol: 'EUR', name: 'Euro', price: 'R$ 5,72', change: 0.18 },
]

const MarketRow = memo(({ symbol, name, price, change }: MarketRowData) => {
  const isPositive = change >= 0
  return (
    <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <span className="text-2xs font-bold text-primary font-mono">{symbol.slice(0, 2)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">{symbol}</p>
        <p className="text-2xs text-muted-foreground">{name}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold financial-value text-foreground">{price}</p>
        <p className={`text-2xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </p>
      </div>
    </div>
  )
})
MarketRow.displayName = 'MarketRow'

export default DashboardPage
