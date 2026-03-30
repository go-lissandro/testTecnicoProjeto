import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { login, logout } from '@/services/auth.service'
import type { LoginCredentials } from '@/types'


export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setSession, clearSession } = useAuthStore()
  const { addToast, setGlobalLoading } = useUIStore()


  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const session = await login(credentials)
        setSession(session)
        navigate('/dashboard', { replace: true })
        addToast({
          title: `Bem-vinda, ${session.user.name.split(' ')[0]}! 👋`,
          description: 'Sua sessão está ativa e segura.',
          variant: 'success',
        })
      } catch (error: unknown) {
        const apiError = error as { message: string }
        addToast({
          title: 'Erro ao entrar',
          description: apiError?.message ?? 'Credenciais inválidas.',
          variant: 'destructive',
        })
        throw error
      }
    },
    [navigate, setSession, addToast],
  )

  const handleLogout = useCallback(async () => {
    setGlobalLoading(true)
    try {
      await logout()
      clearSession()
      navigate('/login', { replace: true })
      addToast({
        title: 'Até logo!',
        description: 'Sua sessão foi encerrada com segurança.',
        variant: 'default',
      })
    } finally {
      setGlobalLoading(false)
    }
  }, [clearSession, navigate, addToast, setGlobalLoading])

  return {
    user,
    isAuthenticated,
    handleLogin,
    handleLogout,
  }
}
