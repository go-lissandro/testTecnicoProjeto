export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  accountNumber: string
  currency: string
  tier: 'standard' | 'premium' | 'elite'
  kycStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
}

export interface AuthSession {
  user: User
  accessToken: string
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface BankAccount {
  id: string
  userId: string
  balance: number
  availableBalance: number
  currency: Currency
  iban?: string
  swift?: string
  walletAddress?: string
}

export type TransactionType =
  | 'transfer_sent'
  | 'transfer_received'
  | 'defi_swap'
  | 'defi_stake'
  | 'fee'
  | 'deposit'
  | 'withdrawal'

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: Currency
  convertedAmount?: number
  convertedCurrency?: Currency
  exchangeRate?: number
  description: string
  counterparty?: Counterparty
  createdAt: string
  completedAt?: string
  txHash?: string
  fee?: number
  tags?: string[]
}

export interface Counterparty {
  name: string
  accountNumber?: string
  institution?: string
  country?: string
  avatarUrl?: string
}

export interface TransferPayload {
  amount: number
  currency: Currency
  targetCurrency: Currency
  recipientName: string
  recipientAccount: string
  recipientInstitution?: string
  description: string
  scheduledAt?: string
}

export interface TransferResult {
  transactionId: string
  status: TransactionStatus
  estimatedCompletion: string
  fee: number
  exchangeRate?: number
  totalDeducted: number
}

export interface MarketAsset {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  logoUrl?: string
}

export interface DeFiPosition {
  protocol: string
  type: 'liquidity' | 'stake' | 'lending'
  asset: string
  amount: number
  valueUsd: number
  apy: number
  rewards: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  timestamp: string
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type Currency =
  | 'BRL'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'BTC'
  | 'ETH'
  | 'USDC'

export type Locale = 'pt-BR' | 'en-US' | 'en-GB'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface FilterOptions {
  type?: TransactionType
  status?: TransactionStatus
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

export interface RouteConfig {
  path: string
  element: React.LazyExoticComponent<React.ComponentType>
  protected: boolean
  label?: string
}
