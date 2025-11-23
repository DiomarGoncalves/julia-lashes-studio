# Especificação da API - Backend LashStudio

Este documento descreve todos os endpoints que o backend deve implementar para suportar o front-end do LashStudio.

## 🔧 Configuração Base

**Base URL**: `/api`

**Autenticação**: JWT Token via header  
```
Authorization: Bearer <token>
```

**Content-Type**: `application/json`

---

## 🔐 Autenticação

### POST /auth/login
Realiza login e retorna token JWT.

**Request Body:**
```json
{
  "email": "admin@lashstudio.com",
  "password": "senha123"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@lashstudio.com",
    "name": "Administrador"
  }
}
```

**Response Error (401):**
```json
{
  "message": "Credenciais inválidas"
}
```

---

## 📦 Serviços (Services)

### GET /services
Lista todos os serviços ativos.

**Query Params:** 
- `active` (optional): `true` | `false` - Filtrar por status

**Response (200):**
```json
[
  {
    "id": "1",
    "name": "Fio a Fio",
    "description": "Técnica natural para um olhar discreto e elegante",
    "duration": "2h",
    "price": 150,
    "active": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /services/:id
Retorna detalhes de um serviço específico.

**Response (200):**
```json
{
  "id": "1",
  "name": "Fio a Fio",
  "description": "Técnica natural para um olhar discreto e elegante",
  "duration": "2h",
  "price": 150,
  "active": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Response Error (404):**
```json
{
  "message": "Serviço não encontrado"
}
```

### POST /services
Cria novo serviço. **[PROTEGIDO]**

**Request Body:**
```json
{
  "name": "Volume Híbrido",
  "description": "Combinação de fio a fio e volume russo",
  "duration": "2h30",
  "price": 180,
  "active": true
}
```

**Response (201):**
```json
{
  "id": "5",
  "name": "Volume Híbrido",
  "description": "Combinação de fio a fio e volume russo",
  "duration": "2h30",
  "price": 180,
  "active": true,
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

### PUT /services/:id
Atualiza serviço existente. **[PROTEGIDO]**

**Request Body:** (todos os campos opcionais)
```json
{
  "name": "Volume Híbrido Premium",
  "price": 200,
  "active": false
}
```

**Response (200):**
```json
{
  "id": "5",
  "name": "Volume Híbrido Premium",
  "description": "Combinação de fio a fio e volume russo",
  "duration": "2h30",
  "price": 200,
  "active": false,
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2024-01-20T00:00:00Z"
}
```

### DELETE /services/:id
Deleta um serviço. **[PROTEGIDO]**

**Response (200):**
```json
{
  "message": "Serviço deletado com sucesso"
}
```

---

## 📅 Agendamentos (Appointments)

### GET /availability
Retorna horários disponíveis para agendamento.

**Query Params:**
- `serviceId` (required): ID do serviço
- `date` (required): Data no formato YYYY-MM-DD

**Response (200):**
```json
{
  "date": "2024-01-20",
  "serviceId": "1",
  "availableTimes": [
    "09:00",
    "10:30",
    "13:00",
    "14:30",
    "16:00",
    "17:30"
  ]
}
```

### POST /appointments
Cria novo agendamento.

**Request Body:**
```json
{
  "serviceId": "1",
  "date": "2024-01-20",
  "time": "14:30",
  "name": "Maria Silva",
  "phone": "62996006289"
}
```

**Response (201):**
```json
{
  "id": "123",
  "serviceId": "1",
  "serviceName": "Fio a Fio",
  "date": "2024-01-20",
  "time": "14:30",
  "clientName": "Maria Silva",
  "clientPhone": "62996006289",
  "status": "agendado",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response Error (409):**
```json
{
  "message": "Horário não disponível"
}
```

### GET /appointments
Lista agendamentos. **[PROTEGIDO]**

**Query Params:**
- `date` (optional): Filtrar por data (YYYY-MM-DD)
- `status` (optional): Filtrar por status
- `clientId` (optional): Filtrar por cliente

**Response (200):**
```json
[
  {
    "id": "123",
    "serviceId": "1",
    "serviceName": "Fio a Fio",
    "date": "2024-01-20",
    "time": "14:30",
    "clientId": "45",
    "clientName": "Maria Silva",
    "clientPhone": "62996006289",
    "status": "agendado",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### PATCH /appointments/:id/status
Atualiza status de um agendamento. **[PROTEGIDO]**

**Request Body:**
```json
{
  "status": "realizado"
}
```

**Status válidos:**
- `agendado`
- `confirmado`
- `realizado`
- `cancelado`
- `nao_compareceu`

**Response (200):**
```json
{
  "id": "123",
  "status": "realizado",
  "updatedAt": "2024-01-20T15:00:00Z"
}
```

---

## 👥 Clientes (Clients)

### GET /clients
Lista todos os clientes. **[PROTEGIDO]**

**Query Params:**
- `search` (optional): Buscar por nome ou telefone

**Response (200):**
```json
[
  {
    "id": "45",
    "name": "Maria Silva",
    "phone": "62996006289",
    "email": "maria@email.com",
    "lastService": "Fio a Fio",
    "lastServiceDate": "2024-01-15",
    "totalAppointments": 5,
    "createdAt": "2023-06-01T00:00:00Z"
  }
]
```

### GET /clients/:id
Detalhes de um cliente específico. **[PROTEGIDO]**

**Response (200):**
```json
{
  "id": "45",
  "name": "Maria Silva",
  "phone": "62996006289",
  "email": "maria@email.com",
  "notes": "Preferência por volume russo",
  "totalAppointments": 5,
  "createdAt": "2023-06-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

### GET /clients/:id/history
Histórico de atendimentos de um cliente. **[PROTEGIDO]**

**Response (200):**
```json
[
  {
    "id": "123",
    "serviceName": "Fio a Fio",
    "date": "2024-01-15",
    "time": "14:30",
    "status": "realizado",
    "price": 150
  },
  {
    "id": "98",
    "serviceName": "Volume Russo",
    "date": "2023-12-10",
    "time": "16:00",
    "status": "realizado",
    "price": 200
  }
]
```

### POST /clients
Cria novo cliente. **[PROTEGIDO]**

**Request Body:**
```json
{
  "name": "Ana Costa",
  "phone": "11988888888",
  "email": "ana@email.com",
  "notes": "Primeira vez com extensão"
}
```

**Response (201):**
```json
{
  "id": "46",
  "name": "Ana Costa",
  "phone": "11988888888",
  "email": "ana@email.com",
  "notes": "Primeira vez com extensão",
  "createdAt": "2024-01-20T00:00:00Z"
}
```

### PUT /clients/:id
Atualiza dados do cliente. **[PROTEGIDO]**

**Request Body:** (campos opcionais)
```json
{
  "phone": "11977777777",
  "notes": "Cliente preferencial - volume russo"
}
```

**Response (200):**
```json
{
  "id": "46",
  "name": "Ana Costa",
  "phone": "11977777777",
  "email": "ana@email.com",
  "notes": "Cliente preferencial - volume russo",
  "updatedAt": "2024-01-21T00:00:00Z"
}
```

---

## ⚙️ Configurações (Settings)

### GET /settings
Retorna configurações do site. **[PROTEGIDO]**

**Response (200):**
```json
{
  "siteTitle": "LashStudio - Extensão de Cílios Premium",
  "siteDescription": "Especialistas em extensão de cílios com técnicas avançadas",
  "contactEmail": "contato@lashstudio.com",
  "contactPhone": "62996006289",
  "whatsappNumber": "5562996006289",
  "instagramUrl": "https://www.instagram.com/juliaoliveiramartins_/?igsh=ZHdua2V5Mnk3dDY0#/lashstudio",
  "facebookUrl": "https://facebook.com/lashstudio",
  "address": {
    "street": "Rua das Flores, 123",
    "neighborhood": "Jardim Paulista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-000"
  },
  "businessHours": {
    "monday": { "open": "09:00", "close": "19:00", "closed": false },
    "tuesday": { "open": "09:00", "close": "19:00", "closed": false },
    "wednesday": { "open": "09:00", "close": "19:00", "closed": false },
    "thursday": { "open": "09:00", "close": "19:00", "closed": false },
    "friday": { "open": "09:00", "close": "19:00", "closed": false },
    "saturday": { "open": "09:00", "close": "15:00", "closed": false },
    "sunday": { "open": "", "close": "", "closed": true }
  }
}
```

### PUT /settings
Atualiza configurações do site. **[PROTEGIDO]**

**Request Body:** (campos opcionais)
```json
{
  "contactPhone": "11988888888",
  "businessHours": {
    "saturday": { "open": "09:00", "close": "17:00", "closed": false }
  }
}
```

**Response (200):**
```json
{
  "message": "Configurações atualizadas com sucesso",
  "updatedAt": "2024-01-20T00:00:00Z"
}
```

---

## 📧 Contato (Contact)

### POST /contact
Envia mensagem de contato (formulário público).

**Request Body:**
```json
{
  "name": "Julia Santos",
  "phone": "11966666666",
  "message": "Gostaria de saber mais sobre o serviço de volume russo."
}
```

**Response (200):**
```json
{
  "message": "Mensagem enviada com sucesso"
}
```

**Ação esperada:**
- Enviar email para equipe
- Criar notificação no sistema admin
- Opcional: Enviar confirmação para cliente

---

## 📊 Dashboard (Estatísticas)

### GET /dashboard/stats
Retorna estatísticas para o dashboard. **[PROTEGIDO]**

**Query Params:**
- `startDate` (optional): Data inicial (YYYY-MM-DD)
- `endDate` (optional): Data final (YYYY-MM-DD)

**Response (200):**
```json
{
  "appointmentsToday": 8,
  "appointmentsPending": 3,
  "totalClients": 142,
  "newClientsThisMonth": 12,
  "revenueThisMonth": 8450,
  "revenueGrowth": 15,
  "returnRate": 87
}
```

---

## 🔒 Autenticação e Segurança

### Headers Necessários

**Em todas requisições protegidas:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Códigos de Status HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (validação falhou)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `409` - Conflict (ex: horário já ocupado)
- `500` - Internal Server Error

### Formato de Erro Padrão

```json
{
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 📝 Validações Recomendadas

### Agendamentos
- Horário deve estar disponível
- Data não pode ser no passado
- Telefone deve ser válido
- Nome é obrigatório

### Serviços
- Nome único
- Preço > 0
- Duração válida

### Clientes
- Telefone único
- Email único (se fornecido)
- Nome obrigatório

### Horário de Funcionamento
- Deve considerar ao calcular disponibilidade
- Não permitir agendamentos fora do horário

---

## 🚀 Implementação Sugerida

### Stack Recomendada
- **Node.js** + Express ou Fastify
- **PostgreSQL** ou **MySQL** para banco de dados
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **nodemailer** para envio de emails

### Estrutura de Banco de Dados

```sql
-- Principais tabelas necessárias:
users           -- Administradores
services        -- Serviços oferecidos
clients         -- Clientes
appointments    -- Agendamentos
settings        -- Configurações do site
```

---

**Desenvolvido para o front-end LashStudio** 🚀
