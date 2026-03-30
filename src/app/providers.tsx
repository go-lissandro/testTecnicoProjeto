import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s — dados financeiros mudam frequentemente
      gcTime: 5 * 60_000,     // 5 min — garbage collection do cache
      retry: 1,               // 1 retry para não sobrecarregar o servidor
      refetchOnWindowFocus: true, // Refetch ao voltar para a aba
      refetchOnReconnect: true,   // Refetch ao reconectar internet
    },
    mutations: {
      retry: 0, // Mutations NÃO fazem retry automático (idempotência)
    },
  },
})

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>

      {/* DevTools apenas em desenvolvimento — tree-shaken em produção */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
