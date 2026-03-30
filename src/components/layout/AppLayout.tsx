import { memo, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Menu,
  X,
  LogOut,
  Wallet,
  TrendingUp,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/formatters'


const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transfer', icon: ArrowLeftRight, label: 'Transferir' },
] as const

interface NavItemProps {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}

const NavItem = memo(({ to, icon: Icon, label, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
        isActive
          ? 'bg-primary/15 text-primary border border-primary/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive && 'text-primary')} />
        <span className="flex-1">{label}</span>
        {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary/60" />}
      </>
    )}
  </NavLink>
))
NavItem.displayName = 'NavItem'

const Sidebar = memo(({ onClose }: { onClose?: () => void }) => {
  const user = useAuthStore((s) => s.user)
  const { handleLogout } = useAuth()

  const onLogout = useCallback(async () => {
    await handleLogout()
  }, [handleLogout])

  return (
    <aside className="flex flex-col h-full w-64 bg-card border-r border-border">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-onda-gradient flex items-center justify-center shadow-glow-primary">
          <span className="text-white font-display font-bold text-sm">O</span>
        </div>
        <div>
          <p className="font-display font-bold text-base text-foreground leading-none">Onda</p>
          <p className="text-2xs text-muted-foreground font-medium tracking-widest uppercase">
            Finance
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navegação principal">
        <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}

        <div className="divider-gradient my-4" />

        <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
          Em breve
        </p>
        <div className="space-y-1 opacity-50 pointer-events-none">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>Carteira DeFi</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Mercados</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </div>
        </div>
      </nav>

      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-primary text-xs font-bold font-display">
              {user ? getInitials(user.name) : '?'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-none truncate">
              {user?.name?.split(' ')[0]}
            </p>
            <p className="text-2xs text-muted-foreground mt-0.5 truncate">{user?.email}</p>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onLogout}
            aria-label="Sair da conta"
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  )
})
Sidebar.displayName = 'Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = memo(({ children }: AppLayoutProps) => {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()
  const location = useLocation()

  const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 flex lg:hidden animate-slide-in-right">
            <Sidebar onClose={closeSidebar} />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 h-14 border-b border-border bg-card/50 backdrop-blur-sm lg:hidden shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-onda-gradient flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">O</span>
            </div>
            <span className="font-display font-semibold text-sm">Onda Finance</span>
          </div>
        </header>

        <main
          key={location.pathname}
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in"
        >
          {children}
        </main>
      </div>
    </div>
  )
})
AppLayout.displayName = 'AppLayout'
