import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ICON_MAP = {
  default: <Info className="h-4 w-4 text-primary" />,
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
  destructive: <XCircle className="h-4 w-4 text-destructive" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
}

const VARIANT_STYLES = {
  default: 'border-border bg-card',
  success: 'border-success/30 bg-success/10',
  destructive: 'border-destructive/30 bg-destructive/10',
  warning: 'border-warning/30 bg-warning/10',
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border shadow-card',
            'animate-slide-in-right',
            VARIANT_STYLES[toast.variant],
          )}
        >
          <div className="shrink-0 mt-0.5">{ICON_MAP[toast.variant]}</div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 -mt-0.5 -mr-0.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
