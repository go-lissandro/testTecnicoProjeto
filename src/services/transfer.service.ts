import type { TransferPayload, TransferResult, Transaction } from '@/types'

const networkDelay = (ms = 1200) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Taxa de câmbio simulada BRL → outras moedas */
const EXCHANGE_RATES: Record<string, number> = {
  'BRL-USD': 0.1923,
  'BRL-EUR': 0.1748,
  'BRL-GBP': 0.1515,
  'BRL-BTC': 0.0000033,
  'BRL-ETH': 0.000052,
  'USD-BRL': 5.2,
  'EUR-BRL': 5.72,
  'USD-EUR': 0.909,
}


export function getExchangeRate(from: string, to: string): number {
  if (from === to) return 1
  const key = `${from}-${to}`
  return EXCHANGE_RATES[key] ?? 1
}

export function calculateFee(amount: number, isInternational: boolean): number {
  if (!isInternational) return 0
  const percentFee = amount * 0.012 
  const minFee = 8.9
  const maxFee = 49.9
  return Math.min(Math.max(percentFee, minFee), maxFee)
}

export async function createTransfer(payload: TransferPayload): Promise<TransferResult> {
  await networkDelay(1500)

  if (Math.random() < 0.05) {
    throw {
      message: 'Serviço temporariamente indisponível. Tente novamente.',
      code: 'SERVICE_UNAVAILABLE',
      statusCode: 503,
    }
  }

  if (payload.amount > 50_000) {
    throw {
      message: 'Saldo insuficiente para esta transferência.',
      code: 'INSUFFICIENT_BALANCE',
      statusCode: 422,
    }
  }

  const isInternational = payload.currency !== payload.targetCurrency
  const fee = calculateFee(payload.amount, isInternational)
  const exchangeRate = getExchangeRate(payload.currency, payload.targetCurrency)

  const result: TransferResult = {
    transactionId: `txn_${Date.now()}`,
    status: 'pending',
    estimatedCompletion: new Date(
      Date.now() + (isInternational ? 2 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000),
    ).toISOString(),
    fee,
    exchangeRate: isInternational ? exchangeRate : undefined,
    totalDeducted: payload.amount + fee,
  }

  return result
}

export async function getTransferStatus(transactionId: string): Promise<Transaction['status']> {
  await networkDelay(400)

  const statuses: Transaction['status'][] = ['pending', 'completed', 'completed']
  return statuses[Math.floor(Math.random() * statuses.length)]
}
