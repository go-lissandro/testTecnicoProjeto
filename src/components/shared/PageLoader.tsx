export function PageLoader() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-background"
      aria-label="Carregando página..."
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-display font-bold text-sm">O</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground font-display">Onda Finance</p>
          <p className="text-xs text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </div>
  )
}
