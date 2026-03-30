import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatPercent,
  truncateHash,
  maskAccountNumber,
  getTransactionTypeLabel,
  getTransactionStatusConfig,
  getInitials,
  formatCompactNumber,
} from '@/utils/formatters'

describe('formatCurrency', () => {
  it('deve formatar valores em BRL corretamente', () => {
    const result = formatCurrency(1000, 'BRL')
    expect(result).toContain('1.000')
    expect(result).toContain('R$')
  })

  it('deve formatar valores em USD', () => {
    const result = formatCurrency(1000, 'USD', 'en-US')
    expect(result).toContain('1,000')
    expect(result).toContain('$')
  })

  it('deve formatar cripto com 8 casas decimais', () => {
    const result = formatCurrency(0.15, 'ETH')
    expect(result).toContain('0.15000000')
    expect(result).toContain('ETH')
  })

  it('deve formatar USDC corretamente', () => {
    const result = formatCurrency(1000, 'USDC')
    expect(result).toContain('USDC')
  })

  it('deve lidar com valor zero', () => {
    const result = formatCurrency(0, 'BRL')
    expect(result).toContain('0')
  })
})

describe('formatPercent', () => {
  it('deve adicionar sinal de + para valores positivos', () => {
    expect(formatPercent(2.5)).toBe('+2.50%')
  })

  it('deve manter sinal de - para valores negativos', () => {
    expect(formatPercent(-1.5)).toBe('-1.50%')
  })

  it('deve usar o número de decimais configurado', () => {
    expect(formatPercent(2.5, 0)).toBe('+3%')
  })

  it('deve formatar zero corretamente', () => {
    expect(formatPercent(0)).toBe('+0.00%')
  })
})

describe('truncateHash', () => {
  it('deve truncar hash longa corretamente', () => {
    const hash = '0xa1b2c3d4e5f6789012345678901234567890abcdef'
    const result = truncateHash(hash)
    expect(result).toBe('0xa1b2...cdef')
  })

  it('deve retornar a hash original se for curta', () => {
    const hash = '0x1234'
    expect(truncateHash(hash)).toBe('0x1234')
  })

  it('deve respeitar os parâmetros customizados', () => {
    const hash = '0xabcdef1234567890'
    const result = truncateHash(hash, 4, 4)
    expect(result).toBe('0xab...7890')
  })
})

describe('maskAccountNumber', () => {
  it('deve mascarar número de conta mostrando apenas os 4 últimos dígitos', () => {
    expect(maskAccountNumber('0001-23456789')).toBe('****6789')
  })

  it('deve retornar o número original se tiver 4 ou menos dígitos', () => {
    expect(maskAccountNumber('1234')).toBe('1234')
  })
})

describe('getTransactionTypeLabel', () => {
  it('deve retornar label correto para transfer_sent', () => {
    expect(getTransactionTypeLabel('transfer_sent')).toBe('Transferência Enviada')
  })

  it('deve retornar label correto para defi_swap', () => {
    expect(getTransactionTypeLabel('defi_swap')).toBe('Swap DeFi')
  })

  it('deve retornar label correto para deposit', () => {
    expect(getTransactionTypeLabel('deposit')).toBe('Depósito')
  })
})

describe('getTransactionStatusConfig', () => {
  it('deve retornar config de sucesso para completed', () => {
    const config = getTransactionStatusConfig('completed')
    expect(config.label).toBe('Concluída')
    expect(config.color).toBe('success')
  })

  it('deve retornar config de warning para pending', () => {
    const config = getTransactionStatusConfig('pending')
    expect(config.label).toBe('Pendente')
    expect(config.color).toBe('warning')
  })

  it('deve retornar config de destructive para failed', () => {
    const config = getTransactionStatusConfig('failed')
    expect(config.label).toBe('Falhou')
    expect(config.color).toBe('destructive')
  })
})

describe('getInitials', () => {
  it('deve gerar iniciais de nome completo', () => {
    expect(getInitials('Ana Oliveira')).toBe('AO')
  })

  it('deve gerar apenas 2 letras para nomes com 3+ palavras', () => {
    expect(getInitials('Ana Carolina Oliveira Silva')).toBe('AC')
  })

  it('deve funcionar com nome único', () => {
    expect(getInitials('Ana')).toBe('A')
  })

  it('deve retornar maiúsculas', () => {
    expect(getInitials('ana oliveira')).toBe('AO')
  })
})

describe('formatCompactNumber', () => {
  it('deve formatar milhões corretamente', () => {
    const result = formatCompactNumber(1_200_000)
    expect(result).toMatch(/1[,.]?2\s?M/i)
  })

  it('deve formatar bilhões', () => {
    const result = formatCompactNumber(3_400_000_000)
    expect(result).toMatch(/3[,.]?4\s?B/i)
  })

  it('deve manter números menores sem sufixo', () => {
    const result = formatCompactNumber(500)
    expect(result).toContain('500')
  })
})
