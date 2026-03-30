import { memo, useMemo, useCallback } from 'react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat2,
  Layers,
  Wallet,
  CreditCard,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { useTransactions } from '@/hooks/useFinance'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SkeletonTransactionList } from '@/components/ui/Skeleton'
import {
  formatCurrency,
  formatRelativeDate,
  getTransactionTypeLabel,
  getTransactionStatusConfig,
  truncateHash,
} from '@/utils/formatters'
import { cn } from '@/lib/utils'
import type { Transaction, TransactionType, Currency } from '@/types'


const TRANSACTION_ICONS: Record<TransactionType, React.ComponentType<{ className?: string }>> = {
  transfer_sent: ArrowUpRight,
  transfer_received: ArrowDownLeft,
  defi_swap: Repeat2,
  defi_stake: Layers,
  fee: CreditCard,
  deposit: Wallet,
  withdrawal: ArrowUpRight,
}

const ICON_COLORS: Record<TransactionType, string> = {
  transfer_sent: 'text-orange-400 bg-orange-400/10',
  transfer_received: 'text-emerald-400 bg-emerald-400/10',
  defi_swap: 'text-violet-400 bg-violet-400/10',
  defi_stake: 'text-cyan-400 bg-cyan-400/10',
  fee: 'text-muted-foreground bg-muted',
  deposit: 'text-primary bg-primary/10',
  withdrawal: 'text-orange-400 bg-orange-400/10',
}

interface TransactionRowProps {
  transaction: Transaction
}

const TransactionRow = memo(({ transaction }: TransactionRowProps) => {
  const Icon = TRANSACTION_ICONS[transaction.type]
  const iconColor = ICON_COLORS[transaction.type]
  const statusConfig = getTransactionStatusConfig(transaction.status)

  const isCredit = transaction.type === 'transfer_received' || transaction.type === 'deposit'
  const amountColor = isCredit ? 'text-emerald-400' : 'text-foreground'
  const amountPrefix = isCredit ? '+' : '-'

  const formattedAmount = useMemo(
    () => formatCurrency(transaction.amount, transaction.currency as Currency),
    [transaction.amount, transaction.currency],
  )
  const formattedDate = useMemo(
    () => formatRelativeDate(transaction.createdAt),
    [transaction.createdAt],
  )

  return (
    <div className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-secondary/50 transition-colors group">
      <div
        className={cn(
          'shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
          iconColor,
        )}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">
              {getTransactionTypeLabel(transaction.type)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {transaction.counterparty?.name ?? transaction.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className={cn('text-sm font-bold financial-value', amountColor)}>
              {amountPrefix}
              {formattedAmount}
            </p>
            {transaction.convertedAmount && transaction.convertedCurrency && (
              <p className="text-2xs text-muted-foreground mt-0.5">
                ≈{' '}
                {formatCurrency(
                  transaction.convertedAmount,
                  transaction.convertedCurrency as Currency,
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-2xs text-muted-foreground">{formattedDate}</span>

          <Badge
            variant={statusConfig.color}
            size="sm"
            dot
          >
            {statusConfig.label}
          </Badge>

          {transaction.txHash && (
            <button
              className="inline-flex items-center gap-0.5 text-2xs text-primary/70 hover:text-primary transition-colors font-mono"
              onClick={() =>
                window.open(
                  `https://etherscan.io/tx/${transaction.txHash}`,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
              title="Ver na blockchain"
            >
              {truncateHash(transaction.txHash)}
              <ExternalLink className="h-2.5 w-2.5" />
            </button>
          )}

          {transaction.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
})
TransactionRow.displayName = 'TransactionRow'

interface TransactionListProps {
  limit?: number
}

export const TransactionList = memo(({ limit }: TransactionListProps) => {
  const { data, isLoading, error, refetch } = useTransactions(1)

  const transactions = useMemo(
    () => (limit ? data?.data.slice(0, limit) : data?.data) ?? [],
    [data, limit],
  )

  const handleRetry = useCallback(() => refetch(), [refetch])

  if (isLoading) {
    return <SkeletonTransactionList count={limit ?? 5} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive/60" />
        <div>
          <p className="text-sm font-semibold text-foreground">Erro ao carregar transações</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verifique sua conexão e tente novamente.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetry}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Nenhuma transação</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Suas movimentações aparecerão aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0.5" role="list" aria-label="Lista de transações">
      {transactions.map((transaction) => (
        <div key={transaction.id} role="listitem">
          <TransactionRow transaction={transaction} />
        </div>
      ))}
    </div>
  )
})
TransactionList.displayName = 'TransactionList'
