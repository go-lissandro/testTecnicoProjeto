import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido')
    .max(254, 'E-mail muito longo')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const DEMO_CREDENTIALS: LoginFormValues = {
  email: 'ana@ondafinance.com',
  password: 'Onda@2024',
}
