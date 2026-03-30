import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAccount, getTransactions } from '@/services/transactions.service'
import { createTransfer } from '@/services/transfer.service'
import { useUIStore } from '@/store/uiStore'
import type { FilterOptions, TransferPayload, TransferResult } from '@/types'


export const queryKeys = {
  account: ['account'] as const,
  transactions: (page: number, filters?: FilterOptions) =>
    ['transactions', page, filters] as const,
  transaction: (id: string) => ['transaction', id] as const,
  market: ['market'] as const,
}


export function useAccount() {
  return useQuery({
    queryKey: queryKeys.account,
    queryFn: getAccount,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}


export function useTransactions(page = 1, filters?: FilterOptions) {
  return useQuery({
    queryKey: queryKeys.transactions(page, filters),
    queryFn: () => getTransactions(page, 10, filters),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}


export function useCreateTransfer() {
  const queryClient = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)

  return useMutation<TransferResult, { message: string; code: string }, TransferPayload>({
    mutationFn: createTransfer,

    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      addToast({
        title: 'Transferência enviada!',
        description: `ID: ${result.transactionId} — Conclusão estimada em breve.`,
        variant: 'success',
      })
    },

    onError: (error) => {
      addToast({
        title: 'Erro na transferência',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
