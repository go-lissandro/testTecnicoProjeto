import { useState, memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react'
import { loginSchema, type LoginFormValues, DEMO_CREDENTIALS } from '@/schemas/loginSchema'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'


const LoginPage = memo(() => {
  const [showPassword, setShowPassword] = useState(false)
  const { handleLogin } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data)
  }

  const fillDemo = () => {
    setValue('email', DEMO_CREDENTIALS.email, { shouldValidate: true })
    setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true })
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-onda-gradient flex items-center justify-center shadow-glow-primary">
            <span className="text-white font-display font-bold text-lg">O</span>
          </div>
          <div>
            <p className="font-display font-bold text-xl text-foreground">Onda Finance</p>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              International Banking
            </p>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Plataforma Financeira Global
            </p>
            <h1 className="font-display font-bold text-4xl xl:text-5xl text-foreground leading-[1.1]">
              Seu dinheiro,{' '}
              <span className="text-gradient">sem fronteiras.</span>
            </h1>
          </div>

          <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
            Transferências internacionais em segundos, integração com DeFi e
            mercados globais — tudo em um só lugar.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🌍', label: '180+ países' },
              { icon: '⚡', label: 'Liquidação rápida' },
              { icon: '🔐', label: 'Criptografia end-to-end' },
              { icon: '📊', label: 'DeFi integrado' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/50"
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="text-xs font-medium text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © 2026 Onda Finance — Regulamentado pelo Banco Central do Brasil
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex h-12 w-12 rounded-xl bg-onda-gradient items-center justify-center shadow-glow-primary">
              <span className="text-white font-display font-bold text-xl">O</span>
            </div>
            <p className="font-display font-bold text-2xl">Onda Finance</p>
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-foreground">Bem-vinda de volta</h2>
            <p className="text-sm text-muted-foreground">
              Entre na sua conta para continuar
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
            aria-label="Formulário de login"
          >
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="pointer-events-auto text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar na conta'}
            </Button>
          </form>

          <div className="divider-gradient" />

          <Card variant="glass" padding="sm">
            <div className="flex items-start gap-3">
              <div className="shrink-0 h-8 w-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">Acesso Demo</p>
                <p className="text-2xs text-muted-foreground mt-0.5">
                  ana@ondafinance.com · Onda@2024
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={fillDemo}
                className="shrink-0"
              >
                Preencher
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
})

LoginPage.displayName = 'LoginPage'

export default LoginPage
