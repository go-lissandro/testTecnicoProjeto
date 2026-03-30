import { memo } from 'react'
import { ArrowLeft, Shield, Zap, Globe, Clock } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { TransferForm } from '@/features/transfer/TransferForm'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'

const TRANSFER_TIPS = [
  { icon: Shield, title: 'Protegido por KYC', desc: 'Todas as transferências passam por verificação de identidade conforme regulamentação.' },
  { icon: Zap, title: 'Liquidação rápida', desc: 'Nacionais: até 30 min. Internacionais: até 2 dias úteis.' },
  { icon: Globe, title: '180+ países', desc: 'Envie para qualquer país com taxa de câmbio competitiva e transparente.' },
  { icon: Clock, title: 'Rastreamento em tempo real', desc: 'Acompanhe o status da sua transferência diretamente no app.' },
]

const TransferPage = memo(() => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 animate-in">
          <LinkButton variant="ghost" size="icon-sm" to="/dashboard" aria-label="Voltar para o dashboard">
            <ArrowLeft className="h-4 w-4" />
          </LinkButton>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Nova transferência</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Nacional, internacional ou via DeFi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-in animation-delay-100">
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle>Dados da transferência</CardTitle>
                <CardDescription>
                  Preencha as informações do destinatário e o valor a enviar.
                </CardDescription>
              </CardHeader>
              <div className="mt-6">
                <TransferForm />
              </div>
            </Card>
          </div>

          <div className="space-y-4 animate-in animation-delay-200">
            <Card variant="elevated" padding="md">
              <CardHeader>
                <CardTitle className="text-sm">Por que usar a Onda?</CardTitle>
              </CardHeader>
              <div className="mt-4 space-y-4">
                {TRANSFER_TIPS.map((tip) => {
                  const Icon = tip.icon
                  return (
                    <div key={tip.title} className="flex gap-3">
                      <div className="shrink-0 h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">{tip.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card variant="glass" padding="md">
              <p className="text-xs font-semibold text-foreground">Tabela de taxas</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Nacional (PIX/TED)', fee: 'Grátis' },
                  { label: 'Internacional', fee: '1,2% (mín. R$8,90)' },
                  { label: 'DeFi (gas)', fee: 'Rede + 0,1%' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-foreground">{row.fee}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="outline" padding="sm">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dúvidas?{' '}
                <button className="text-primary hover:underline font-medium">
                  Fale com o suporte
                </button>{' '}
                disponível 24/7 para clientes Premium.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
})

TransferPage.displayName = 'TransferPage'

export default TransferPage
