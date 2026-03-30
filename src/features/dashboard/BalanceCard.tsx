import { memo, useMemo } from 'react'
import { ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Copy, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useAccount } from '@/hooks/useFinance'
import { useUIStore } from '@/store/uiStore'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SkeletonBalanceCard } from '@/components/ui/Skeleton'
import { formatCurrency, maskAccountNumber } from '@/utils/formatters'
import type { Currency } from '@/types'

// ============================================================
// 💰 BalanceCard — Exibe saldo e ações rápidas
// ⚡ PERFORMANCE: memo() + useMemo para formatação de valores
// ============================================================

export const BalanceCard = memo(() => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const { data: account, isLoading, error } = useAccount()
  const setTransferModalOpen = useUIStore((s) => s.setTransferModalOpen)
  const navigate = useNavigate()
  const addToast = useUIStore((s) => s.addToast)

  const formattedBalance = useMemo(
    () => (account ? formatCurrency(account.balance, account.currency as Currency) : '—'),
    [account],
  )
  const formattedAvailable = useMemo(
    () => (account ? formatCurrency(account.availableBalance, account.currency as Currency) : '—'),
    [account],
  )

  const handleCopyAccount = () => {
    if (!account) return
    navigator.clipboard.writeText(account.id)
    addToast({
      title: 'Número copiado!',
      description: 'Número da conta copiado para a área de transferência.',
      variant: 'success',
      duration: 2500,
    })
  }

  if (isLoading) return <SkeletonBalanceCard />

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">Erro ao carregar saldo. Tente recarregar.</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-onda-gradient" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydi00aC00di00aC00djRoLTR2NGgtNHY0aDR2NGg0djRoNHYtNGg0di00aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
        <svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,30 C80,60 160,0 240,30 C320,60 380,20 400,30 L400,60 L0,60 Z" fill="white" />
        </svg>
      </div>

      <div className="relative p-6 text-white space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/70 font-medium">Saldo disponível</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" size="sm" className="bg-white/20 text-white border-white/10">
                {account?.currency ?? 'BRL'}
              </Badge>
              <Badge
                variant="default"
                size="sm"
                dot
                className="bg-white/20 text-white border-white/10"
              >
                <span className="text-white/60">conta</span>&nbsp;
                <button
                  onClick={handleCopyAccount}
                  className="hover:underline font-mono"
                  title="Copiar número da conta"
                >
                  {account ? maskAccountNumber(account.id) : '****'}
                </button>
                <Copy className="h-2.5 w-2.5 ml-0.5 text-white/40" />
              </Badge>
            </div>
          </div>

          <button
            onClick={() => setIsBalanceHidden((h) => !h)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label={isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
          >
            {isBalanceHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>

        {/* Saldo */}
        <div className="space-y-1">
          <div className="financial-value font-display font-bold text-3xl md:text-4xl tracking-tight">
            {isBalanceHidden ? (
              <span className="tracking-[0.3em] text-2xl">•••••••</span>
            ) : (
              formattedBalance
            )}
          </div>
          <p className="text-sm text-white/70">
            Disponível:{' '}
            <span className="font-semibold text-white">
              {isBalanceHidden ? '•••••' : formattedAvailable}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/80">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+2.4% este mês</span>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/20 border backdrop-blur-sm"
            leftIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
            onClick={() => navigate('/transfer')}
          >
            Enviar
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/20 border backdrop-blur-sm"
            leftIcon={<ArrowDownLeft className="h-3.5 w-3.5" />}
            onClick={() =>
              addToast({
                title: 'Em breve',
                description: 'Função de depósito chegando em breve.',
                variant: 'default',
              })
            }
          >
            Depositar
          </Button>
        </div>
      </div>
    </div>
  )
})
BalanceCard.displayName = 'BalanceCard'
