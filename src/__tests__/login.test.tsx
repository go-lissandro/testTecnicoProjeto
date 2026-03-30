import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/services/auth.service', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  verifySession: vi.fn(),
  getMe: vi.fn(),
}))

vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    setSession: vi.fn(),
    clearSession: vi.fn(),
    setInitializing: vi.fn(),
  })),
}))

vi.mock('@/store/uiStore', () => ({
  useUIStore: vi.fn(() => ({
    addToast: vi.fn(),
    setGlobalLoading: vi.fn(),
  })),
}))

import LoginPage from '@/pages/Login/LoginPage'
import { login } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'


function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderLoginPage() {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  let mockLogin: ReturnType<typeof vi.fn>
  let mockSetSession: ReturnType<typeof vi.fn>
  let mockAddToast: ReturnType<typeof vi.fn>
  let mockNavigate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockLogin = vi.mocked(login)
    mockNavigate = vi.fn()
    mockSetSession = vi.fn()
    mockAddToast = vi.fn()

    // Configurar mocks padrão
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isInitializing: false,
      setSession: mockSetSession,
      clearSession: vi.fn(),
      setInitializing: vi.fn(),
      updateUser: vi.fn(),
    })

    vi.mocked(useUIStore).mockReturnValue({
      toasts: [],
      addToast: mockAddToast,
      removeToast: vi.fn(),
      isSidebarOpen: true,
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      isTransferModalOpen: false,
      setTransferModalOpen: vi.fn(),
      isGlobalLoading: false,
      setGlobalLoading: vi.fn(),
    })

    vi.mocked(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('react-router-dom').useNavigate,
    ).mockReturnValue(mockNavigate)
  })

  describe('Renderização', () => {
    it('deve renderizar o formulário de login', () => {
      renderLoginPage()

      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /entrar na conta/i })).toBeInTheDocument()
    })

    it('deve exibir o nome da marca Onda Finance', () => {
      renderLoginPage()
      expect(screen.getAllByText(/onda finance/i).length).toBeGreaterThan(0)
    })

    it('deve mostrar botão de acesso demo', () => {
      renderLoginPage()
      expect(screen.getByRole('button', { name: /preencher/i })).toBeInTheDocument()
    })

    it('deve mostrar credenciais de demo visíveis', () => {
      renderLoginPage()
      expect(screen.getByText(/ana@ondafinance\.com/i)).toBeInTheDocument()
    })
  })

  describe('Validação de formulário', () => {
    it('deve exibir erro quando e-mail está vazio', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const submitButton = screen.getByRole('button', { name: /entrar na conta/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument()
      })
    })

    it('deve exibir erro para e-mail inválido', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'email-invalido')
      await user.tab() // Trigger blur

      await waitFor(() => {
        expect(screen.getByText(/informe um e-mail válido/i)).toBeInTheDocument()
      })
    })

    it('deve exibir erro quando senha está vazia', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const emailInput = screen.getByLabelText(/e-mail/i)
      await user.type(emailInput, 'teste@teste.com')

      const submitButton = screen.getByRole('button', { name: /entrar na conta/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
      })
    })

    it('deve exibir erro para senha muito curta', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const passwordInput = screen.getByLabelText(/senha/i)
      await user.type(passwordInput, '123')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/pelo menos 6 caracteres/i)).toBeInTheDocument()
      })
    })
  })

  describe('Interação com campos', () => {
    it('deve alternar visibilidade da senha', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const passwordInput = screen.getByLabelText(/senha/i)
      expect(passwordInput).toHaveAttribute('type', 'password')

      const toggleButton = screen.getByRole('button', { name: /mostrar senha/i })
      await user.click(toggleButton)

      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(screen.getByRole('button', { name: /ocultar senha/i }))
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('deve preencher formulário com credenciais de demo', async () => {
      const user = userEvent.setup()
      renderLoginPage()

      const fillButton = screen.getByRole('button', { name: /preencher/i })
      await user.click(fillButton)

      await waitFor(() => {
        expect(screen.getByLabelText(/e-mail/i)).toHaveValue('ana@ondafinance.com')
      })
    })
  })

  describe('Login bem-sucedido', () => {
    it('deve chamar o serviço de login com as credenciais corretas', async () => {
      const user = userEvent.setup()
      const mockSession = {
        user: {
          id: 'usr_01',
          name: 'Ana Oliveira',
          email: 'ana@ondafinance.com',
          accountNumber: '0001-23456789',
          currency: 'BRL',
          tier: 'premium' as const,
          kycStatus: 'verified' as const,
          createdAt: '2023-06-15T09:00:00Z',
        },
        accessToken: 'mock_jwt_abc',
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      }

      mockLogin.mockResolvedValueOnce(mockSession)
      renderLoginPage()

      await user.type(screen.getByLabelText(/e-mail/i), 'ana@ondafinance.com')
      await user.type(screen.getByLabelText(/senha/i), 'Onda@2024')
      await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'ana@ondafinance.com',
          password: 'Onda@2024',
        })
      })
    })

    it('deve mostrar toast de boas-vindas após login', async () => {
      const user = userEvent.setup()
      const mockSession = {
        user: {
          id: 'usr_01',
          name: 'Ana Oliveira',
          email: 'ana@ondafinance.com',
          accountNumber: '0001-23456789',
          currency: 'BRL',
          tier: 'premium' as const,
          kycStatus: 'verified' as const,
          createdAt: '2023-06-15T09:00:00Z',
        },
        accessToken: 'mock_jwt_abc',
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      }

      mockLogin.mockResolvedValueOnce(mockSession)
      renderLoginPage()

      await user.type(screen.getByLabelText(/e-mail/i), 'ana@ondafinance.com')
      await user.type(screen.getByLabelText(/senha/i), 'Onda@2024')
      await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'success',
            title: expect.stringContaining('Bem-vinda'),
          }),
        )
      })
    })
  })

  describe('Login com erro', () => {
    it('deve mostrar toast de erro para credenciais inválidas', async () => {
      const user = userEvent.setup()

      mockLogin.mockRejectedValueOnce({
        message: 'E-mail ou senha incorretos.',
        code: 'INVALID_CREDENTIALS',
        statusCode: 401,
      })

      renderLoginPage()

      await user.type(screen.getByLabelText(/e-mail/i), 'wrong@test.com')
      await user.type(screen.getByLabelText(/senha/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'destructive',
            title: 'Erro ao entrar',
            description: 'E-mail ou senha incorretos.',
          }),
        )
      })
    })

    it('deve habilitar o botão novamente após erro', async () => {
      const user = userEvent.setup()
      mockLogin.mockRejectedValueOnce({ message: 'Erro', code: 'ERR', statusCode: 401 })
      renderLoginPage()

      await user.type(screen.getByLabelText(/e-mail/i), 'wrong@test.com')
      await user.type(screen.getByLabelText(/senha/i), 'wrongpass')
      await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /entrar na conta/i })
        expect(button).not.toBeDisabled()
      })
    })
  })
})
