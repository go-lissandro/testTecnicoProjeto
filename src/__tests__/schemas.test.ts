import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/schemas/loginSchema'
import { transferSchema } from '@/schemas/transferSchema'

describe('loginSchema', () => {
  describe('email', () => {
    it('deve aceitar email válido', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'senha123',
      })
      expect(result.success).toBe(true)
    })

    it('deve rejeitar email vazio', () => {
      const result = loginSchema.safeParse({ email: '', password: 'senha123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('obrigatório')
      }
    })

    it('deve rejeitar email inválido', () => {
      const result = loginSchema.safeParse({
        email: 'nao-e-email',
        password: 'senha123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('válido')
      }
    })

    it('deve converter email para minúsculas', () => {
      const result = loginSchema.safeParse({
        email: 'USER@EXAMPLE.COM',
        password: 'senha123',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('user@example.com')
      }
    })
  })

  describe('password', () => {
    it('deve rejeitar senha com menos de 6 caracteres', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('6 caracteres')
      }
    })

    it('deve aceitar senha com exatamente 6 caracteres', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '123456',
      })
      expect(result.success).toBe(true)
    })

    it('deve rejeitar senha vazia', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('transferSchema', () => {
  const validTransfer = {
    amount: '1000',
    currency: 'BRL' as const,
    targetCurrency: 'USD' as const,
    recipientName: 'João Silva',
    recipientAccount: 'US12 3456 7890',
    recipientInstitution: 'Bank of America',
    description: 'Pagamento de serviços',
  }

  it('deve aceitar dados válidos de transferência', () => {
    const result = transferSchema.safeParse(validTransfer)
    expect(result.success).toBe(true)
  })

  describe('amount', () => {
    it('deve rejeitar valor zero', () => {
      const result = transferSchema.safeParse({ ...validTransfer, amount: '0' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maior que zero')
      }
    })

    it('deve rejeitar valor negativo', () => {
      const result = transferSchema.safeParse({ ...validTransfer, amount: '-100' })
      expect(result.success).toBe(false)
    })

    it('deve rejeitar valor acima do máximo', () => {
      const result = transferSchema.safeParse({ ...validTransfer, amount: '50001' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('50.000')
      }
    })

    it('deve aceitar valor com vírgula como separador decimal', () => {
      const result = transferSchema.safeParse({ ...validTransfer, amount: '1.500,50' })

      const result2 = transferSchema.safeParse({ ...validTransfer, amount: '1500,50' })
      expect(result2.success).toBe(true)
    })

    it('deve rejeitar texto não-numérico', () => {
      const result = transferSchema.safeParse({ ...validTransfer, amount: 'abc' })
      expect(result.success).toBe(false)
    })
  })

  describe('recipientName', () => {
    it('deve rejeitar nome muito curto', () => {
      const result = transferSchema.safeParse({ ...validTransfer, recipientName: 'A' })
      expect(result.success).toBe(false)
    })

    it('deve aceitar nome válido', () => {
      const result = transferSchema.safeParse({ ...validTransfer, recipientName: 'João' })
      expect(result.success).toBe(true)
    })
  })

  describe('description', () => {
    it('deve rejeitar descrição muito curta', () => {
      const result = transferSchema.safeParse({ ...validTransfer, description: 'Ok' })
      expect(result.success).toBe(false)
    })

    it('deve rejeitar descrição acima de 140 caracteres', () => {
      const result = transferSchema.safeParse({
        ...validTransfer,
        description: 'a'.repeat(141),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('140')
      }
    })

    it('deve aceitar descrição com exatamente 140 caracteres', () => {
      const result = transferSchema.safeParse({
        ...validTransfer,
        description: 'a'.repeat(140),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('recipientAccount', () => {
    it('deve rejeitar conta muito curta', () => {
      const result = transferSchema.safeParse({ ...validTransfer, recipientAccount: '123' })
      expect(result.success).toBe(false)
    })

    it('deve rejeitar IBAN muito longo', () => {
      const result = transferSchema.safeParse({
        ...validTransfer,
        recipientAccount: 'A'.repeat(35),
      })
      expect(result.success).toBe(false)
    })
  })
})
