import type { Currency, Locale, TransactionType, TransactionStatus } from '@/types'

// ============================================================
// 💰 Formatadores Financeiros — Onda Finance
// Centralizar toda lógica de formatação aqui.
// ============================================================

/**
 * Formata um valor monetário conforme a moeda e locale.
 * @performance Memoizar resultado quando possível com useMemo.
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'BRL',
  locale: Locale = 'pt-BR',
): string {
  // Crypto: formato especial sem símbolo de moeda fiat
  if (['BTC', 'ETH', 'USDC'].includes(currency)) {
    return `${amount.toFixed(8)} ${currency}`
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formata percentual de variação com sinal + ou -
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Formata data/hora em formato legível
 */
export function formatDate(
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  locale: Locale = 'pt-BR',
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(isoString))
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatRelativeDate(isoString: string, locale: Locale = 'pt-BR'): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (minutes < 1) return 'agora'
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  if (hours < 24) return rtf.format(-hours, 'hour')
  return rtf.format(-days, 'day')
}

/**
 * Trunca hash blockchain para exibição (ex: 0x1234...abcd)
 */
export function truncateHash(hash: string, startChars = 6, endChars = 4): string {
  if (hash.length <= startChars + endChars) return hash
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`
}

/**
 * Trunca número de conta para exibição (ex: ****1234)
 */
export function maskAccountNumber(account: string): string {
  if (account.length <= 4) return account
  return `****${account.slice(-4)}`
}

/**
 * Retorna label legível para tipo de transação
 */
export function getTransactionTypeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    transfer_sent: 'Transferência Enviada',
    transfer_received: 'Transferência Recebida',
    defi_swap: 'Swap DeFi',
    defi_stake: 'Staking',
    fee: 'Taxa',
    deposit: 'Depósito',
    withdrawal: 'Saque',
  }
  return labels[type]
}

/**
 * Retorna label e cor de status de transação
 */
export function getTransactionStatusConfig(status: TransactionStatus): {
  label: string
  color: 'success' | 'warning' | 'destructive' | 'secondary'
} {
  const config: Record<
    TransactionStatus,
    { label: string; color: 'success' | 'warning' | 'destructive' | 'secondary' }
  > = {
    completed: { label: 'Concluída', color: 'success' },
    pending: { label: 'Pendente', color: 'warning' },
    failed: { label: 'Falhou', color: 'destructive' },
    cancelled: { label: 'Cancelada', color: 'secondary' },
  }
  return config[status]
}

/**
 * Formata número grande com sufixo (ex: 1.2M, 3.4B)
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

/**
 * Gera iniciais para avatar
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
