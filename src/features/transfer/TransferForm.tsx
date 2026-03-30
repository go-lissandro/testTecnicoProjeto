import { memo, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeftRight,
  User,
  Building2,
  FileText,
  DollarSign,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { transferSchema, type TransferFormValues } from '@/schemas/transferSchema'
import { useCreateTransfer } from '@/hooks/useFinance'
import { getExchangeRate, calculateFee } from '@/services/transfer.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatters'
import type { Currency } from '@/types'


const CURRENCIES: { value: Currency; label: string; flag: string }[] = [
  { value: 'BRL', label: 'Real Brasileiro', flag: '🇧🇷' },
  { value: 'USD', label: 'Dólar Americano', flag: '🇺🇸' },
  { value: 'EUR', label: 'Euro', flag: '🇪🇺' },
  { value: 'GBP', label: 'Libra Esterlina', flag: '🇬🇧' },
  { value: 'ETH', label: 'Ethereum', flag: '⟠' },
  { value: 'USDC', label: 'USD Coin', flag: '💵' },
]

interface CurrencySelectProps {
  value: string
  onChange: (value: string) => void
  label: string
  error?: string
}

const CurrencySelect = memo(({ value, onChange, label, error }: CurrencySelectProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 cursor-pointer"
      aria-invalid={Boolean(error)}
    >
      {CURRENCIES.map((c) => (
        <option key={c.value} value={c.value}>
          {c.flag} {c.value} — {c.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
))
CurrencySelect.displayName = 'CurrencySelect'

interface SuccessStateProps {
  transactionId: string
  onReset: () => void
}

const SuccessState = memo(({ transactionId, onReset }: SuccessStateProps) => (
  <div className="flex flex-col items-center gap-5 py-8 text-center animate-in">
    <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
    </div>
    <div className="space-y-1.5">
      <h3 className="font-display font-bold text-xl text-foreground">
        Transferência enviada!
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Sua transferência foi registrada e está sendo processada com segurança.
      </p>
      <p className="text-xs font-mono text-muted-foreground mt-2">
        ID: <span className="text-primary">{transactionId}</span>
      </p>
    </div>
    <Button variant="outline" onClick={onReset}>
      Nova transferência
    </Button>
  </div>
))
SuccessState.displayName = 'SuccessState'

export const TransferForm = memo(() => {
  const { mutateAsync, isPending, data: transferResult, reset: resetMutation } = useCreateTransfer()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: '',
      currency: 'BRL',
      targetCurrency: 'USD',
      recipientName: '',
      recipientAccount: '',
      recipientInstitution: '',
      description: '',
    },
  })

  const watchedAmount = watch('amount')
  const watchedCurrency = watch('currency')
  const watchedTargetCurrency = watch('targetCurrency')

  const preview = useMemo(() => {
    const numericAmount = parseFloat(watchedAmount?.replace(',', '.') || '0')
    if (!numericAmount || numericAmount <= 0) return null

    const isInternational = watchedCurrency !== watchedTargetCurrency
    const exchangeRate = getExchangeRate(watchedCurrency, watchedTargetCurrency)
    const fee = calculateFee(numericAmount, isInternational)
    const convertedAmount = numericAmount * exchangeRate
    const totalDeducted = numericAmount + fee

    return {
      numericAmount,
      exchangeRate,
      fee,
      convertedAmount,
      totalDeducted,
      isInternational,
    }
  }, [watchedAmount, watchedCurrency, watchedTargetCurrency])

  const onSubmit = useCallback(
    async (data: TransferFormValues) => {
      await mutateAsync({
        amount: parseFloat(data.amount.replace(',', '.')),
        currency: data.currency as Currency,
        targetCurrency: data.targetCurrency as Currency,
        recipientName: data.recipientName,
        recipientAccount: data.recipientAccount,
        recipientInstitution: data.recipientInstitution,
        description: data.description,
      })
    },
    [mutateAsync],
  )

  const handleReset = useCallback(() => {
    resetForm()
    resetMutation()
  }, [resetForm, resetMutation])

  if (transferResult) {
    return <SuccessState transactionId={transferResult.transactionId} onReset={handleReset} />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de transferência"
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
            Valor
          </h3>
        </div>

        <Input
          label="Valor a enviar"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          error={errors.amount?.message}
          required
          hint="Máximo: R$ 50.000 por transferência"
          {...register('amount')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <CurrencySelect
                label="Moeda de origem"
                value={field.value}
                onChange={field.onChange}
                error={errors.currency?.message}
              />
            )}
          />
          <Controller
            name="targetCurrency"
            control={control}
            render={({ field }) => (
              <CurrencySelect
                label="Moeda de destino"
                value={field.value}
                onChange={field.onChange}
                error={errors.targetCurrency?.message}
              />
            )}
          />
        </div>

        {preview && (
          <Card variant="glass" padding="sm" className="animate-in">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-xs font-semibold text-foreground">Resumo da transferência</p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {preview.isInternational && (
                    <div className="flex justify-between">
                      <span>Taxa de câmbio</span>
                      <span className="font-mono text-foreground">
                        1 {watchedCurrency} ={' '}
                        {preview.exchangeRate.toFixed(4)} {watchedTargetCurrency}
                      </span>
                    </div>
                  )}
                  {preview.isInternational && (
                    <div className="flex justify-between">
                      <span>Valor convertido</span>
                      <span className="font-mono text-foreground">
                        ≈ {formatCurrency(preview.convertedAmount, watchedTargetCurrency as Currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxa de serviço</span>
                    <span className="font-mono text-foreground">
                      {preview.fee === 0
                        ? 'Gratuito'
                        : formatCurrency(preview.fee, watchedCurrency as Currency)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border font-semibold text-foreground">
                    <span>Total debitado</span>
                    <span className="font-mono text-primary">
                      {formatCurrency(preview.totalDeducted, watchedCurrency as Currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <div className="divider-gradient" />
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
            Destinatário
          </h3>
        </div>

        <Input
          label="Nome completo"
          type="text"
          autoComplete="off"
          placeholder="Nome do destinatário"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.recipientName?.message}
          required
          {...register('recipientName')}
        />

        <Input
          label="Conta / IBAN / Endereço"
          type="text"
          autoComplete="off"
          placeholder="Ex: BR18 0036... ou 0x742d..."
          error={errors.recipientAccount?.message}
          required
          hint="Para transferências internacionais, use o IBAN. Para DeFi, use o endereço da carteira."
          {...register('recipientAccount')}
        />

        <Input
          label="Banco ou Instituição (opcional)"
          type="text"
          autoComplete="off"
          placeholder="Ex: JPMorgan Chase, Deutsche Bank"
          leftIcon={<Building2 className="h-4 w-4" />}
          error={errors.recipientInstitution?.message}
          {...register('recipientInstitution')}
        />
      </div>

      <div className="space-y-4">
        <div className="divider-gradient" />
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
            Detalhes
          </h3>
        </div>

        <Input
          label="Descrição"
          type="text"
          placeholder="Ex: Pagamento consultoria Q1"
          leftIcon={<FileText className="h-4 w-4" />}
          error={errors.description?.message}
          required
          hint="Máximo 140 caracteres"
          {...register('description')}
        />
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
        <ArrowLeftRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p className="font-semibold text-foreground">Transferência segura</p>
          <p>
            Todas as transações são criptografadas com TLS 1.3 e auditadas em tempo real.
            Verifique os dados antes de confirmar.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        isLoading={isPending}
        className="w-full"
        leftIcon={!isPending ? <ArrowLeftRight className="h-4 w-4" /> : undefined}
      >
        {isPending ? 'Processando transferência...' : 'Confirmar transferência'}
      </Button>
    </form>
  )
})

TransferForm.displayName = 'TransferForm'
