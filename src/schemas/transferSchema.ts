import { z } from 'zod'

export const transferSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => !isNaN(Number(val.replace(',', '.'))), 'Valor inválido')
    .refine((val) => Number(val.replace(',', '.')) > 0, 'Valor deve ser maior que zero')
    .refine(
      (val) => Number(val.replace(',', '.')) <= 50_000,
      'Valor máximo por transferência: R$ 50.000',
    ),

  currency: z.enum(['BRL', 'USD', 'EUR', 'GBP', 'ETH', 'USDC'], {
    required_error: 'Selecione a moeda de origem',
  }),

  targetCurrency: z.enum(['BRL', 'USD', 'EUR', 'GBP', 'ETH', 'USDC'], {
    required_error: 'Selecione a moeda de destino',
  }),

  recipientName: z
    .string()
    .min(1, 'Nome do destinatário é obrigatório')
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .trim(),

  recipientAccount: z
    .string()
    .min(1, 'Conta/IBAN é obrigatório')
    .min(4, 'Número de conta muito curto')
    .max(34, 'IBAN inválido (máximo 34 caracteres)')
    .trim(),

  recipientInstitution: z.string().max(100, 'Nome da instituição muito longo').optional(),

  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(3, 'Descrição muito curta')
    .max(140, 'Descrição muito longa (máximo 140 caracteres)')
    .trim(),
})

export type TransferFormValues = z.infer<typeof transferSchema>
