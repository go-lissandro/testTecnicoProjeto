import type { LoginCredentials, AuthSession, User } from '@/types'

const networkDelay = (ms = 800) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const MOCK_USER: User = {
  id: 'usr_01HQ8VRNR5KP9M2XDQT7Z',
  name: 'Ana Oliveira',
  email: 'ana@ondafinance.com',
  avatarUrl: undefined,
  accountNumber: '0001-23456789',
  currency: 'BRL',
  tier: 'premium',
  kycStatus: 'verified',
  createdAt: '2023-06-15T09:00:00Z',
}

const VALID_CREDENTIALS = {
  email: 'ana@ondafinance.com',
  password: 'Onda@2024',
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  await networkDelay(900)

  if (
    credentials.email !== VALID_CREDENTIALS.email ||
    credentials.password !== VALID_CREDENTIALS.password
  ) {
    throw {
      message: 'E-mail ou senha incorretos.',
      code: 'INVALID_CREDENTIALS',
      statusCode: 401,
    }
  }

  const session: AuthSession = {
    user: MOCK_USER,
    accessToken: `mock_jwt_${crypto.randomUUID().replace(/-/g, '')}`,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  }

  sessionStorage.setItem('__onda_access_token__', session.accessToken)

  return session
}

export async function logout(): Promise<void> {
  await networkDelay(300)
  sessionStorage.clear()
}

export async function verifySession(token: string): Promise<User | null> {
  await networkDelay(400)

  if (!token || !token.startsWith('mock_jwt_')) {
    return null
  }

  return MOCK_USER
}

export async function getMe(): Promise<User> {
  await networkDelay(500)
  return MOCK_USER
}
