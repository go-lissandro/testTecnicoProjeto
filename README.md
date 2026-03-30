# 🌊 Onda Finance

> **Plataforma bancária digital para transferências internacionais e DeFi**  
> Construída com React, TypeScript e arquitetura escalável de produção.

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-1-729B1B?logo=vitest)

</div>

---

## 📋 Sumário

1. [Como Rodar](#-como-rodar)
2. [Stack Tecnológica](#-stack-tecnológica)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Decisões Técnicas](#-decisões-técnicas)
5. [Estratégias de Performance](#-estratégias-de-performance)
6. [Segurança](#-segurança)
7. [Funcionalidades](#-funcionalidades)
8. [Testes](#-testes)
9. [Melhorias Futuras](#-melhorias-futuras)

---

## 🚀 Como Rodar

### Pré-requisitos

- **Node.js** >= 18.0
- **npm** >= 9.0 (ou pnpm/yarn)

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/sua-org/onda-finance.git
cd onda-finance

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

### Credenciais de Demo

```
E-mail:  ana@ondafinance.com
Senha:   Onda@2024
```

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (HMR) |
| `npm run build` | Build de produção otimizado |
| `npm run preview` | Preview do build de produção |
| `npm test` | Rodar testes em modo watch |
| `npm run test:coverage` | Relatório de cobertura de código |
| `npm run type-check` | Verificação de tipos TypeScript |
| `npm run lint` | Análise estática com ESLint |

---

## 🛠 Stack Tecnológica

| Categoria | Tecnologia | Versão | Motivo |
|-----------|-----------|--------|--------|
| UI | React | 18 | Concurrent Mode, Suspense nativo |
| Linguagem | TypeScript | 5 | Tipagem forte, zero `any` |
| Build | Vite | 5 | HMR ultrarrápido, ESM nativo |
| Estilos | TailwindCSS + CVA | 3 + 0.7 | Utility-first + variantes type-safe |
| Componentes | shadcn/ui + Radix UI | — | Primitivos acessíveis e sem estilo imposto |
| Roteamento | React Router DOM | 6 | Code splitting nativo com lazy() |
| Server state | TanStack Query | 5 | Cache, retry, staleTime configuráveis |
| Client state | Zustand | 4 | Leve, sem boilerplate, seletores otimizados |
| Formulários | React Hook Form + Zod | 7 + 3 | Uncontrolled inputs + validação type-safe |
| HTTP | Axios | 1.6 | Interceptors, cancelamento, timeout |
| Testes | Vitest + Testing Library | 1 + 14 | Integração nativa com Vite |

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   └── providers.tsx          # QueryClient, Router providers
│
├── pages/                     # Páginas (rotas lazy-loaded)
│   ├── Login/
│   │   └── LoginPage.tsx
│   ├── Dashboard/
│   │   └── DashboardPage.tsx
│   └── Transfer/
│       └── TransferPage.tsx
│
├── features/                  # Funcionalidades de negócio encapsuladas
│   ├── dashboard/
│   │   ├── BalanceCard.tsx    # Saldo com ações rápidas
│   │   ├── TransactionList.tsx # Lista de transações
│   │   └── StatsCards.tsx     # Métricas resumidas
│   └── transfer/
│       └── TransferForm.tsx   # Formulário de transferência
│
├── components/
│   ├── ui/                    # Componentes base reutilizáveis (design system)
│   │   ├── Button.tsx         # CVA: default, outline, gradient, ghost...
│   │   ├── Card.tsx           # CVA: default, glass, elevated, gradient...
│   │   ├── Input.tsx          # Com label, error, ícones, validação ARIA
│   │   ├── Badge.tsx          # CVA: status colors, tamanhos
│   │   └── Skeleton.tsx       # Loading states para cada componente
│   ├── layout/
│   │   └── AppLayout.tsx      # Sidebar + header mobile + main
│   └── shared/
│       ├── ToastContainer.tsx # Notificações globais
│       └── PageLoader.tsx     # Fallback do Suspense
│
├── services/                  # Camada de API (nunca acessar na UI)
│   ├── api.ts                 # Axios client com interceptors
│   ├── auth.service.ts        # Login, logout, verifySession
│   ├── transactions.service.ts # Conta e transações
│   └── transfer.service.ts    # Criação e status de transferências
│
├── hooks/                     # Custom hooks
│   ├── useAuth.ts             # Login/logout com navegação e toast
│   └── useFinance.ts          # React Query hooks (account, transactions, transfer)
│
├── store/                     # Estado global (Zustand)
│   ├── authStore.ts           # Sessão do usuário (persiste em sessionStorage)
│   └── uiStore.ts             # Toasts, sidebar, modais
│
├── schemas/                   # Validação Zod (single source of truth)
│   ├── loginSchema.ts
│   └── transferSchema.ts
│
├── routes/
│   └── AppRouter.tsx          # Rotas lazy + guards de proteção
│
├── types/
│   └── index.ts               # Todas as interfaces TypeScript
│
├── utils/
│   └── formatters.ts          # Formatação de moeda, datas, hashes
│
├── lib/
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
│
└── styles/
    └── globals.css            # CSS variables, dark mode, animações
```

---

## 🧠 Decisões Técnicas

### 1. Feature-based Architecture

Optamos por separar `pages/` de `features/`. As **pages** são responsáveis apenas por layout e composição. Toda lógica de negócio e estado fica nas **features** e **hooks**. Isso facilita:
- Teste unitário de features isoladas
- Reutilização de features em múltiplas páginas
- Times diferentes trabalhando em paralelo

### 2. CVA (Class Variance Authority)

Todas as variantes de componentes são tipadas com CVA. Isso evita:
- Strings de classe mágicas e inconsistentes
- Erros de tipo em variantes inválidas
- Duplicação de lógica de estilo condicional

### 3. React Query como única fonte de truth para server state

Nenhum estado do servidor (saldo, transações) é copiado para o Zustand. O Zustand é reservado **exclusivamente** para:
- Estado de autenticação (`authStore`)
- Estado efêmero de UI (`uiStore`: toasts, sidebar)

Isso previne inconsistências entre cache da query e estado global.

### 4. Tipagem sem `any`

Todos os tipos são derivados dos schemas Zod ou definidos em `types/index.ts`. A regra `noImplicitAny: true` está ativa no `tsconfig.json`. Nenhuma função usa `unknown` sem guard adequado.

### 5. Separação de camadas

```
UI Component → Custom Hook → Service → API Client
```

Componentes **nunca** fazem chamadas HTTP diretamente. Toda lógica de requisição fica nos `services/`, toda lógica de estado nos `hooks/`, e a UI apenas renderiza e captura interações.

---

## ⚡ Estratégias de Performance

### Code Splitting com React.lazy

```tsx
// Cada rota é um chunk separado no bundle
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'))
const TransferPage   = lazy(() => import('@/pages/Transfer/TransferPage'))
```

O bundle inicial carrega apenas o necessário para a rota atual.

### Manual Chunks no Vite

```ts
// vite.config.ts — separação de vendors para cache HTTP ideal
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-query': ['@tanstack/react-query'],
  'vendor-ui':    ['@radix-ui/react-dialog', ...],
  'vendor-form':  ['react-hook-form', 'zod'],
}
```

Cache do browser reutiliza chunks de vendor entre deploys.

### React Query com staleTime configurado

```ts
staleTime: 30_000,   // Saldo: dados frescos por 30s
staleTime: 60_000,   // Transações: dados frescos por 60s
gcTime:    5 * 60_000 // Cache retido por 5 minutos
```

Elimina refetches desnecessários ao navegar entre páginas.

### React.memo em componentes críticos

```tsx
// ⚡ Evita re-render do layout ao navegar entre rotas
export const AppLayout = memo(({ children }) => { ... })

// ⚡ Evita re-render de cada linha da transação
const TransactionRow = memo(({ transaction }) => { ... })
```

### useMemo para cálculos financeiros

```tsx
// Preview de câmbio — recalcula apenas quando amount ou currency muda
const preview = useMemo(() => {
  const rate = getExchangeRate(currency, targetCurrency)
  const fee = calculateFee(amount, isInternational)
  return { rate, fee, converted: amount * rate }
}, [amount, currency, targetCurrency])
```

### Watch seletivo no React Hook Form

```tsx
// Observa apenas os campos que afetam o preview
// Evita re-render do formulário inteiro a cada keystroke
const watchedAmount = watch('amount')
const watchedCurrency = watch('currency')
```

### Skeleton Loading

Todos os componentes assíncronos têm um skeleton correspondente que mantém o layout estável durante o carregamento, evitando layout shift (CLS).

---

## 🔐 Segurança

### Armazenamento de Token

| Local | Uso | Risco |
|-------|-----|-------|
| `localStorage` | ❌ Nunca usado para tokens | XSS pode ler indefinidamente |
| `sessionStorage` | ✅ Token de acesso | Limpo ao fechar aba, ainda vulnerável a XSS |
| `httpOnly Cookie` | ✅ **Produção** | Inacessível via JS, proteção real contra XSS |
| Memória (Zustand) | ✅ Dados não-sensíveis | Limpo ao recarregar, sem persistência |

**Em produção**, o token JWT deve ser retornado via `Set-Cookie: HttpOnly; Secure; SameSite=Strict` pelo backend. O frontend nunca toca no token diretamente.

### Proteção de Rotas Privadas

```tsx
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
```

### Engenharia Reversa e Vazamento de Dados

**O que foi implementado:**
- `sourcemap: false` no build de produção (impede reconstrução do código original)
- Variáveis sensíveis via `import.meta.env` (nunca hardcoded)
- Logs de debug removidos em produção com tree-shaking do Vite
- Headers de segurança devem ser configurados no servidor:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000
  ```

**Dados sensíveis:**
- Nunca logamos no console em produção (usar variável de ambiente)
- O `partialize` do Zustand garante que apenas campos não-sensíveis do usuário são serializados
- Números de conta são mascarados na UI: `maskAccountNumber('0001-23456789')` → `****6789`

### Boas Práticas com JWT

- **Algoritmo**: usar RS256 (assimétrico) em produção, não HS256
- **Expiração curta**: access token de 8h (já implementado), refresh token de 30d
- **Revogação**: implementar blacklist de tokens no servidor
- **Validação**: sempre validar no servidor — nunca confiar no payload do cliente

### Prevenção de XSS

- React escapa automaticamente valores em JSX
- Evitar `dangerouslySetInnerHTML` (não utilizado neste projeto)
- CSP no servidor bloqueia scripts externos não autorizados

---

## ✅ Funcionalidades

| Funcionalidade | Status | Descrição |
|---------------|--------|-----------|
| Login com validação | ✅ | Zod + React Hook Form |
| Persistência de sessão | ✅ | Zustand + sessionStorage |
| Proteção de rotas | ✅ | Guards em AppRouter |
| Dashboard | ✅ | Saldo, transações, stats, mercados |
| Skeleton loading | ✅ | Todos os componentes assíncronos |
| Lista de transações | ✅ | Tipos, status, DeFi hash |
| Transferência | ✅ | Form completo + preview de câmbio |
| Feedback visual | ✅ | Loading, sucesso, erro |
| Toast notifications | ✅ | Sucesso, erro, aviso, info |
| Dark mode | ✅ | Design padrão dark (fintech) |
| Responsividade | ✅ | Mobile-first, sidebar drawer |
| Code splitting | ✅ | React.lazy por rota |

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Relatório de cobertura
npm run test:coverage

# Interface visual (Vitest UI)
npm run test:ui
```

### Cobertura

| Arquivo | Tipo | O que testa |
|---------|------|-------------|
| `login.test.tsx` | Integração | Renderização, validação, login, erros, UX |
| `formatters.test.ts` | Unitário | Todas as funções de formatação |
| `schemas.test.ts` | Unitário | Regras de validação Zod |

---

## 🔮 Melhorias Futuras

### Curto prazo

- [ ] **Refresh token** automático com interceptor Axios
- [ ] **Paginação infinita** de transações com `useInfiniteQuery`
- [ ] **Filtros de transação** por tipo, status e período
- [ ] **Detalhes da transação** em modal/drawer

### Médio prazo

- [ ] **Carteira DeFi**: integração com wagmi + viem (EVM)
- [ ] **Gráficos de saldo** com Recharts ou D3.js
- [ ] **Agendamento** de transferências recorrentes
- [ ] **Notificações push** via Web Push API

### Longo prazo

- [ ] **Microfrontends**: separar dashboard, transfer, defi em apps independentes
- [ ] **PWA**: instalação nativa, offline support com Service Worker
- [ ] **i18n**: internacionalização com react-i18next (pt-BR, en-US, es)
- [ ] **Autenticação biométrica**: WebAuthn/FIDO2
- [ ] **WebSockets**: atualizações de saldo em tempo real
- [ ] **Testes E2E**: Playwright com cenários completos de usuário
- [ ] **Storybook**: documentação visual do design system

---

## 📄 Licença

MIT © 2024 Onda Finance
