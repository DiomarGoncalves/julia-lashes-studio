# Arquitetura do Front-End - LashStudio

## 📋 Visão Geral

Este documento descreve a arquitetura completa do front-end para o site do estúdio de extensão de cílios LashStudio, incluindo área pública e sistema administrativo.

## 🎨 Design System

### Paleta de Cores (HSL)
- **Primary (Rose)**: `340 60% 65%` - Cor principal para CTAs e destaques
- **Rose Glow**: `340 80% 75%` - Variação mais clara para efeitos
- **Secondary (Nude)**: `30 25% 90%` - Cor de apoio
- **Accent (Champagne)**: `40 45% 85%` - Detalhes e sutilezas
- **Gold**: `40 70% 60%` - Acentos premium
- **Background**: `20 40% 98%` - Fundo principal
- **Foreground**: `340 20% 20%` - Texto principal

### Tipografia
- **Títulos**: Playfair Display (Serif)
- **Corpo**: Inter (Sans-serif)

### Componentes Customizados
Todos os componentes shadcn/ui foram customizados com variantes específicas:
- Button variants: `hero`, `cta`, `outline`
- Animações suaves e transições elegantes
- Shadows: `elegant`, `soft`, `glow`

## 📁 Estrutura de Pastas

```
src/
├── assets/                    # Imagens geradas
│   ├── hero-image.jpg
│   └── about-image.jpg
├── components/
│   ├── common/               # Componentes reutilizáveis
│   │   ├── ServiceCard.tsx
│   │   └── TestimonialCard.tsx
│   ├── layout/               # Layouts
│   │   ├── Header.tsx        # Header público
│   │   ├── Footer.tsx        # Footer público
│   │   └── AdminLayout.tsx   # Layout área administrativa
│   ├── sistema/              # Componentes admin
│   │   └── ProtectedRoute.tsx
│   └── ui/                   # Componentes shadcn
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticação
├── hooks/
│   ├── use-mobile.tsx        # Hook para mobile
│   └── use-toast.ts          # Hook para toast
├── lib/
│   ├── api.ts                # Configuração Axios + API calls
│   └── utils.ts              # Utilitários
├── pages/
│   ├── Index.tsx             # Home (/)
│   ├── About.tsx             # Sobre (/sobre)
│   ├── Services.tsx          # Serviços (/servicos)
│   ├── Gallery.tsx           # Galeria (/galeria)
│   ├── Contact.tsx           # Contato (/contato)
│   ├── Booking.tsx           # Agendamento (/agendar)
│   ├── NotFound.tsx          # 404
│   └── sistema/              # Área administrativa
│       ├── Login.tsx         # Login (/sistema/login)
│       └── Dashboard.tsx     # Dashboard (/sistema/dashboard)
└── App.tsx                   # Configuração de rotas
```

## 🔄 Fluxo de Rotas

### Rotas Públicas
- `/` - Home
- `/sobre` - Sobre o estúdio
- `/servicos` - Lista de serviços
- `/galeria` - Galeria de trabalhos
- `/contato` - Formulário de contato
- `/agendar` - Fluxo de agendamento (4 etapas)

### Rotas Administrativas (Protegidas)
- `/sistema/login` - Login (única rota pública do sistema)
- `/sistema/dashboard` - Dashboard principal
- `/sistema/agenda` - Gerenciamento de agenda
- `/sistema/clientes` - Gerenciamento de clientes
- `/sistema/servicos` - CRUD de serviços
- `/sistema/configuracoes` - Configurações do site

## 🔐 Autenticação

### Implementação
```typescript
// AuthContext fornece:
- isAuthenticated: boolean
- isLoading: boolean
- login(email, password): Promise<void>
- logout(): void
```

### Fluxo de Login
1. Usuário envia email e senha para `/api/auth/login`
2. Backend retorna JWT token
3. Token é armazenado no localStorage
4. Axios interceptor adiciona token em todas requisições
5. ProtectedRoute verifica autenticação antes de renderizar rotas admin

### Segurança
- Token JWT armazenado no localStorage
- Interceptor Axios adiciona `Authorization: Bearer <token>` automaticamente
- Redirecionamento automático para login se token inválido (401)
- ProtectedRoute wrapper para todas rotas administrativas

## 🌐 Integração com API

### Configuração Base (lib/api.ts)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

### Módulos da API

#### Auth API
- `login(email, password)` - POST /api/auth/login
- `logout()` - Limpa token local

#### Services API
- `getAll()` - GET /api/services
- `getById(id)` - GET /api/services/:id
- `create(data)` - POST /api/services
- `update(id, data)` - PUT /api/services/:id
- `delete(id)` - DELETE /api/services/:id

#### Appointments API
- `getAvailability(serviceId, date)` - GET /api/availability?serviceId=&date=
- `create(data)` - POST /api/appointments
- `getAll(filters)` - GET /api/appointments
- `updateStatus(id, status)` - PATCH /api/appointments/:id/status

#### Clients API
- `getAll()` - GET /api/clients
- `getById(id)` - GET /api/clients/:id
- `getHistory(id)` - GET /api/clients/:id/history
- `create(data)` - POST /api/clients
- `update(id, data)` - PUT /api/clients/:id

#### Settings API
- `get()` - GET /api/settings
- `update(data)` - PUT /api/settings

#### Contact API
- `send(data)` - POST /api/contact

## 📱 Fluxo de Agendamento

### Etapas (Booking.tsx)
1. **Escolha do Serviço**: Lista de serviços disponíveis
2. **Escolha da Data**: Date picker com validação
3. **Escolha do Horário**: Grid de horários disponíveis (consulta API)
4. **Dados do Cliente**: Nome, telefone, confirmação
5. **Confirmação**: Mensagem de sucesso

### Estado do Formulário
```typescript
{
  serviceId: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  name: string
  phone: string
}
```

### Validações
- Serviço obrigatório
- Data mínima: hoje
- Horário deve estar disponível
- Nome e telefone obrigatórios
- Formato de telefone brasileiro

## 🎯 Componentes Principais

### Header (Público)
- Logo e navegação
- Menu responsivo (hamburger mobile)
- Links para redes sociais
- CTA "Agendar Horário"

### Footer (Público)
- Informações de contato
- Links rápidos
- Horário de funcionamento
- Redes sociais

### AdminLayout
- Sidebar com navegação
- Menu responsivo mobile
- Botão de logout
- Link para visualizar site

### ServiceCard
- Exibe serviço individual
- Mostra preço e duração
- CTA para agendamento
- Animação de entrada

### TestimonialCard
- Exibe depoimento
- Rating com estrelas
- Design elegante

## 🔒 Proteção de Rotas

### ProtectedRoute Component
```typescript
<ProtectedRoute>
  <ComponenteProtegido />
</ProtectedRoute>
```

Verifica:
1. Se está carregando estado auth
2. Se usuário está autenticado
3. Redireciona para login se não autenticado

## 📊 Estado Global

### AuthContext
Gerencia estado de autenticação em toda aplicação
- Provider no topo da árvore (App.tsx)
- Hook `useAuth()` para acessar em qualquer componente

### React Query
- Gerenciamento de cache de dados da API
- Refetch automático
- Estados de loading/error

## 🎨 Animações (Framer Motion)

### Padrões Utilizados
- **Fade in**: Entrada suave de elementos
- **Slide up**: Animação de baixo para cima
- **Scale**: Crescimento suave
- **Stagger**: Animação em sequência de listas

### Exemplos
```typescript
// Fade in ao entrar na viewport
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
/>

// Animação com delay em lista
items.map((item, index) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  />
))
```

## 📱 Responsividade

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

### Padrões Mobile-First
- Menu hamburger em telas pequenas
- Grid adaptativo (1 col mobile → 3 cols desktop)
- Sidebar retrátil no admin

## 🚀 Próximos Passos de Desenvolvimento

### Páginas Admin Pendentes
1. **Agenda** (/sistema/agenda)
   - Calendário visual
   - Filtros por data
   - Ações: confirmar, cancelar, remarcar
   - Adicionar agendamento manual

2. **Clientes** (/sistema/clientes)
   - Lista com busca e filtros
   - Visualização de histórico
   - CRUD completo

3. **Serviços** (/sistema/servicos)
   - CRUD de serviços
   - Gerenciar preços e durações
   - Ativar/desativar serviços

4. **Configurações** (/sistema/configuracoes)
   - Editar textos do site
   - Gerenciar links de redes sociais
   - Horário de funcionamento
   - Informações de contato

## 🔧 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Convenções de Código

### Nomenclatura
- Componentes: PascalCase
- Arquivos: PascalCase para componentes
- Funções: camelCase
- Constantes: UPPER_SNAKE_CASE

### Organização de Imports
1. React/bibliotecas externas
2. Componentes locais
3. Hooks
4. Utils/tipos
5. Estilos

### Componentes
- Props sempre tipadas (TypeScript)
- Desestruturação de props
- Default props quando apropriado

## 🎯 Performance

### Otimizações Implementadas
- Lazy loading de imagens
- Code splitting por rota (automático React Router)
- Memoização com React Query
- Animações com GPU (transform/opacity)

### Boas Práticas
- Minimizar re-renders
- Uso de useMemo/useCallback quando necessário
- Imagens otimizadas (geradas em tamanhos apropriados)

## 🔍 SEO

### Meta Tags Implementadas
- Title e description personalizados
- Open Graph tags
- Twitter Card
- Keywords relevantes
- Lang="pt-BR"

### Estrutura Semântica
- Tags HTML5 semânticas
- Headings hierárquicos
- Alt text em imagens
- Links descritivos

---

**Desenvolvido com Lovable** 🚀
