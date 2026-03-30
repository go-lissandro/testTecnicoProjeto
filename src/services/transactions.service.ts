import type { BankAccount, Transaction, PaginatedResponse, FilterOptions } from '@/types'

const networkDelay = (ms = 700) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const MOCK_ACCOUNT: BankAccount = {
  id: 'acc_01HQ8VRNR5KP9M2XDQT7Z',
  userId: 'usr_01HQ8VRNR5KP9M2XDQT7Z',
  balance: 48_750.32,
  availableBalance: 46_200.0,
  currency: 'BRL',
  iban: 'BR18 0036 0305 0000 1000 9795 493P 1',
  swift: 'ONDABRRJXXX',
  walletAddress: '0x742d35Cc6634C0532925a3b8D4C31c5d2A9a4A4f',
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    type: 'transfer_received',
    status: 'completed',
    amount: 5_200.0,
    currency: 'BRL',
    convertedAmount: 1_000.0,
    convertedCurrency: 'USD',
    exchangeRate: 5.2,
    description: 'Pagamento de consultoria — Sprint Q1',
    counterparty: {
      name: 'TechCorp Global',
      accountNumber: '9876543210',
      institution: 'JPMorgan Chase',
      country: 'US',
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(),
    fee: 8.5,
  },
  {
    id: 'txn_002',
    type: 'defi_swap',
    status: 'completed',
    amount: 0.15,
    currency: 'ETH',
    convertedAmount: 2_850.0,
    convertedCurrency: 'USDC',
    exchangeRate: 19_000,
    description: 'Swap ETH → USDC via Uniswap v3',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 4.98 * 60 * 60 * 1000).toISOString(),
    txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    fee: 0.002,
    tags: ['DeFi', 'Uniswap'],
  },
  {
    id: 'txn_003',
    type: 'transfer_sent',
    status: 'completed',
    amount: 1_500.0,
    currency: 'BRL',
    description: 'Aluguel — Apartamento Pinheiros',
    counterparty: {
      name: 'Imobiliária Premium',
      accountNumber: '1234567890',
      institution: 'Itaú BBA',
      country: 'BR',
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 23.8 * 60 * 60 * 1000).toISOString(),
    fee: 0,
  },
  {
    id: 'txn_004',
    type: 'transfer_sent',
    status: 'pending',
    amount: 3_000.0,
    currency: 'BRL',
    convertedAmount: 576.92,
    convertedCurrency: 'EUR',
    exchangeRate: 5.2,
    description: 'Transferência internacional — Viagem Europa',
    counterparty: {
      name: 'Carlos Mendes',
      accountNumber: 'DE89370400440532013000',
      institution: 'Deutsche Bank',
      country: 'DE',
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 12.9,
  },
  {
    id: 'txn_005',
    type: 'defi_stake',
    status: 'completed',
    amount: 1_000.0,
    currency: 'USDC',
    description: 'Staking USDC — Aave v3 (4.2% APY)',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0xdeadbeef12345678901234567890abcdef1234567890abcdef1234567890dead',
    fee: 0.5,
    tags: ['DeFi', 'Aave', 'Stake'],
  },
  {
    id: 'txn_006',
    type: 'deposit',
    status: 'completed',
    amount: 10_000.0,
    currency: 'BRL',
    description: 'Depósito via TED',
    counterparty: {
      name: 'Conta Corrente Pessoal',
      institution: 'Nubank',
      country: 'BR',
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 0,
  },
  {
    id: 'txn_007',
    type: 'transfer_sent',
    status: 'failed',
    amount: 500.0,
    currency: 'USD',
    description: 'Pagamento freelancer — Design UI',
    counterparty: {
      name: 'Maria Santos',
      accountNumber: '4567890123',
      institution: 'Bank of America',
      country: 'US',
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 5.0,
  },
  {
    id: 'txn_008',
    type: 'transfer_received',
    status: 'completed',
    amount: 8_750.0,
    currency: 'BRL',
    description: 'Salário — Outubro 2024',
    counterparty: {
      name: 'Onda Finance Ltda',
      institution: 'Bradesco',
      country: 'BR',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    fee: 0,
  },
]

export async function getAccount(): Promise<BankAccount> {
  await networkDelay(600)
  return { ...MOCK_ACCOUNT }
}

export async function getTransactions(
  page = 1,
  limit = 10,
  filters?: FilterOptions,
): Promise<PaginatedResponse<Transaction>> {
  await networkDelay(700)

  let filtered = [...MOCK_TRANSACTIONS]

  if (filters?.type) {
    filtered = filtered.filter((t) => t.type === filters.type)
  }
  if (filters?.status) {
    filtered = filtered.filter((t) => t.status === filters.status)
  }

  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    hasMore: end < filtered.length,
  }
}

export async function getTransactionById(id: string): Promise<Transaction> {
  await networkDelay(400)

  const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id)
  if (!transaction) {
    throw {
      message: 'Transação não encontrada.',
      code: 'TRANSACTION_NOT_FOUND',
      statusCode: 404,
    }
  }

  return { ...transaction }
}
