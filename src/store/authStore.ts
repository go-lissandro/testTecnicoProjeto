import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, AuthSession } from '@/types'


interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean

  setSession: (session: AuthSession) => void
  clearSession: () => void
  setInitializing: (value: boolean) => void
  updateUser: (partial: Partial<User>) => void
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,

      setSession: (session: AuthSession) => {
        set({
          user: session.user,
          isAuthenticated: true,
          isInitializing: false,
        })
      },

      clearSession: () => {
        set({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
        })
      },

      setInitializing: (value: boolean) => set({ isInitializing: value }),

      updateUser: (partial: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'onda-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              name: state.user.name,
              email: state.user.email,
              avatarUrl: state.user.avatarUrl,
              accountNumber: state.user.accountNumber,
              currency: state.user.currency,
              tier: state.user.tier,
              kycStatus: state.user.kycStatus,
              createdAt: state.user.createdAt,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
