# nuxt-bff — Frontend SSR + Backend for Frontend

## 1. Objetivo

Servir como a camada de apresentação (frontend) e como BFF (Backend for Frontend) do sistema imobiliário. O Nuxt 3 com Nitro permite ter server routes que atuam como proxy inteligente entre o browser e o API Gateway, mantendo o JWT seguro em cookies httpOnly sem nunca expô-lo ao client-side JavaScript.

---

## 2. Responsabilidades

- Renderização SSR (Server-Side Rendering) das páginas
- BFF via Nitro server routes (`server/api/`) — proxy de todas as chamadas ao API Gateway
- Gestão segura do cookie de autenticação (httpOnly, Secure, SameSite)
- Composição de dados de múltiplos endpoints (agregação no BFF)
- Cache de dados no servidor (para SSR)
- Tratamento de erros amigável para o usuário
- Responsividade (mobile-first)

---

## 3. Stack Tecnológica

| Componente             | Tecnologia                                      |
|-----------------------|--------------------------------------------------|
| Framework             | Nuxt 3 (Vue 3 + Composition API)                 |
| Runtime               | Nitro (server engine do Nuxt)                     |
| BFF (Server Routes)   | Nitro `server/api/` — proxy para API Gateway      |
| UI Components         | Nuxt UI 3 (baseado em Tailwind CSS v4)            |
| State Management      | Pinia                                             |
| Auth (client-side)    | Cookie httpOnly (gerenciado pelo BFF)              |
| HTTP Client (BFF)     | `$fetch` / `ofetch` (built-in do Nitro)           |
| HTTP Client (browser) | `useFetch` / `useAsyncData` (built-in do Nuxt)    |
| Package Manager       | pnpm                                              |
| Validação de forms    | Zod + @vee-validate/zod                           |
| Ícones                | Nuxt Icon (Iconify)                               |
| Gráficos              | Vue-chartjs (Chart.js 4)                          |
| Formatação            | ESLint + Prettier                                 |
| Testes                | Vitest + @vue/test-utils + Playwright (e2e)       |

---

## 4. Arquitetura

```
Browser (SPA hydrated)
  │  useFetch('/api/buildings')     ← chamadas vão para o próprio Nuxt server
  ▼
┌─────────────────────────────────┐
│  Nuxt 3 (Nitro Server)         │
│  server/api/buildings.get.ts    │ ← server route (BFF)
│    → extrai JWT do cookie       │
│    → $fetch('http://gateway/    │
│         api/v1/buildings')      │
│    → retorna dados              │
└────────────────┬────────────────┘
                 │  $fetch com Authorization header
                 ▼
          ┌──────────────┐
          │ API Gateway  │ (Quarkus)
          └──────────────┘
```

---

## 5. Estrutura de Diretórios

```
nuxt-bff/
├── app.vue
├── nuxt.config.ts
├── package.json
├── .env / .env.production
├── components/
│   ├── layout/          (AppHeader, AppSidebar, AppFooter, AppBreadcrumb)
│   ├── building/        (BuildingCard, BuildingForm, BuildingTable, BuildingFilters, BuildingPhotoGallery, BuildingStatusBadge)
│   ├── client/          (ClientForm, ClientTable, ClientFilters, ClientTypeBadge)
│   ├── contract/        (ContractForm, ContractTable, ContractFilters, ContractStatusTimeline, ContractStatusBadge)
│   ├── rent/            (RentTable, RentFilters, RentStatusBadge)
│   ├── financial/       (AccountTree, AccountForm, EntryForm, EntryTable, DashboardCashFlow, DashboardOccupancy, DashboardDelinquency, DashboardRevenueChart)
│   ├── user/            (UserForm, UserTable, UserProfileSelect)
│   ├── profile/         (ProfileForm, ProfileTable, PermissionMatrix)
│   ├── company/         (CompanyForm, CompanyTable, CompanySwitcher)
│   ├── visit/           (VisitForm, VisitTable, VisitCalendar)
│   ├── maintenance/     (MaintenanceForm, MaintenanceTable, MaintenanceStatusBadge)
│   ├── document/        (DocumentUpload, DocumentList, SignatureStatus)
│   └── common/          (DataTable, ConfirmDialog, Pagination, SearchFilter, EmptyState, SkeletonTable, SkeletonCard, CurrencyDisplay, DateDisplay, StatusBadge, AddressForm, FileUploader)
├── composables/         (useApi, useAuth, useBuildings, useClients, useContracts, useRents, useAccounts, useEntries, useUsers, useProfiles, useCompanies, useParameters, useVisits, useMaintenance, useDocuments, useDashboard, useNotifications, useToast)
├── layouts/             (default, auth, portal)
├── middleware/          (auth.global, permission)
├── pages/
│   ├── index.vue, login.vue, forgot-password.vue, reset-password.vue
│   ├── buildings/       (index, [id], [id]/edit, [id]/photos, [id]/visits, [id]/documents, new)
│   ├── clients/         (index, [id], [id]/edit, [id]/documents, new)
│   ├── contracts/       (index, [id], [id]/edit, [id]/rents, [id]/maintenance, [id]/insurance, new)
│   ├── rents/           (index, overdue)
│   ├── financial/       (accounts, entries, dashboard, owner-transfers)
│   ├── users/           (index, [id], new)
│   ├── profiles/        (index, [id], new)
│   ├── companies/       (index, [id])
│   ├── parameters/      (index)
│   ├── tenant-portal/   (index, contracts, payments, maintenance)
│   └── owner-portal/    (index, buildings, financial, contracts)
├── plugins/             (error-handler)
├── server/
│   ├── api/
│   │   ├── auth/        (login.post, logout.get, me.get, refresh.post, forgot-password.post, reset-password.post)
│   │   ├── buildings/   (index.get/post, [id].get/put/delete, [id]/photos, [id]/visits, [id]/documents)
│   │   ├── clients/     (index.get/post, [id].get/put/delete, [id]/documents)
│   │   ├── contracts/   (index.get/post, [id].get/put/delete, [id]/rents, [id]/renew, [id]/terminate, [id]/send-signature)
│   │   ├── rents/       (index.get, overdue.get, generate.post)
│   │   ├── financial/   (accounts.get/post, accounts/tree.get, entries.get/post, dashboard/*, owner-transfers.get)
│   │   ├── users/       (index.get/post, [id].get/put/delete)
│   │   ├── user-profiles/ (index.get/post, [id].get/put/delete)
│   │   ├── companies/   (index.get/post, [id].get/put/delete)
│   │   ├── parameters/  (index.get/post)
│   │   ├── visits/      (index.get/post, [id]/status.patch)
│   │   ├── maintenance-requests/ (index.get/post, [id]/status.patch)
│   │   ├── documents/   (index.get/post)
│   │   ├── files/       (upload.post, [id]/download.get)
│   │   ├── payment-orders/ (index.get, [id]/boleto-pdf.get, [id]/pix-qrcode.get)
│   │   ├── notifications/ (index.get)
│   │   └── [...].ts     (catch-all proxy)
│   ├── middleware/       (log)
│   └── utils/           (gateway, cookies, error)
├── stores/              (auth, company, ui, notifications)
├── types/               (api, auth, building, client, contract, rent, account, entry, user, profile, company, parameter, visit, maintenance, document, payment, dashboard, address)
└── utils/               (formatters, validators, constants)
```

---

## 6. Types (TypeScript)

### 6.1 `types/api.ts` — Tipos Genéricos

```typescript
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

export interface ApiError {
  error: { code: string; message: string; details?: { field: string; message: string }[]; timestamp: string }
}

export interface BaseEntity {
  id: string
  createdBy?: string
  updatedBy?: string
  createdAt: string
  lastUpdatedAt?: string
  version: number
}

export type SelectOption = { label: string; value: string }
```

### 6.2 `types/auth.ts`

```typescript
export interface LoginRequest { username: string; password: string }
export interface LoginResponse { message: string; user: AuthUser }

export interface AuthUser {
  id: string; name: string; email: string; maxLevel: number
  permissions: string[]; menus: string[]; companies: CompanySummary[]
}

export interface CompanySummary { id: string; name: string; cnpj: string }
export interface ForgotPasswordRequest { email: string }
export interface ResetPasswordRequest { token: string; newPassword: string; confirmPassword: string }
```

### 6.3 `types/user.ts`

```typescript
export interface User extends BaseEntity {
  name: string; email: string; situation: UserSituation
  userProfiles: { id: string; name: string; level: number }[]
  companies: CompanySummary[]
}

export interface CreateUserDTO {
  name: string; email: string; password: string; situation: UserSituation; userProfileIds: string[]
}

export interface UpdateUserDTO { name: string; email: string; situation: UserSituation; userProfileIds: string[] }
export type UserSituation = 'ACTIVE' | 'INACTIVE'

export const userSituationOptions: SelectOption[] = [
  { label: 'Ativo', value: 'ACTIVE' }, { label: 'Inativo', value: 'INACTIVE' },
]
```

### 6.4 `types/profile.ts`

```typescript
export interface UserProfile extends BaseEntity { name: string; level: number; permissions: Permission[] }
export interface CreateProfileDTO { name: string; level: number; permissions: Permission[] }
export interface UpdateProfileDTO extends CreateProfileDTO {}

export type Permission =
  | 'ALL'
  | 'CREATE_ACCOUNTS' | 'UPDATE_ACCOUNTS' | 'READ_ACCOUNTS' | 'READ_ALL_ACCOUNTS' | 'DELETE_ACCOUNTS'
  | 'CREATE_BUILDINGS' | 'UPDATE_BUILDINGS' | 'READ_BUILDINGS' | 'READ_ALL_BUILDINGS' | 'DELETE_BUILDINGS'
  | 'CREATE_COMPANIES' | 'UPDATE_COMPANIES' | 'READ_COMPANIES' | 'READ_ALL_COMPANIES' | 'DELETE_COMPANIES'
  | 'CREATE_CONTRACTS' | 'UPDATE_CONTRACTS' | 'READ_CONTRACTS' | 'READ_ALL_CONTRACTS' | 'DELETE_CONTRACTS'
  | 'CREATE_DOCUMENTS' | 'UPDATE_DOCUMENTS' | 'READ_DOCUMENTS' | 'READ_ALL_DOCUMENTS' | 'DELETE_DOCUMENTS'
  | 'CREATE_ENTRIES' | 'UPDATE_ENTRIES' | 'READ_ENTRIES' | 'READ_ALL_ENTRIES' | 'DELETE_ENTRIES'
  | 'CREATE_CLIENTS' | 'UPDATE_CLIENTS' | 'READ_CLIENTS' | 'READ_ALL_CLIENTS' | 'DELETE_CLIENTS'
  | 'CREATE_RENTS' | 'UPDATE_RENTS' | 'READ_RENTS' | 'READ_ALL_RENTS' | 'DELETE_RENTS'
  | 'CREATE_USERS' | 'UPDATE_USERS' | 'READ_USERS' | 'READ_ALL_USERS' | 'DELETE_USERS'
  | 'CREATE_USER_PROFILES' | 'UPDATE_USER_PROFILES' | 'READ_USER_PROFILES' | 'READ_ALL_USER_PROFILES' | 'DELETE_USER_PROFILES'
  | 'HOME_MENU' | 'USERS_MENU' | 'PROFILES_MENU' | 'PARAMETERS_MENU' | 'COMPANIES_MENU'
  | 'ACCOUNTS_MENU' | 'ENTRIES_MENU' | 'CLIENTS_MENU'

export type PermissionType = 'REQUISICAO' | 'MENU' | 'GERAL'
export interface PermissionGroup { entity: string; label: string; permissions: { key: Permission; label: string }[] }
```

### 6.5 `types/address.ts`

```typescript
export interface Address {
  id?: string; street: string; neighbourhood: string; city: string; state: string
  cep: string; number: string; complement?: string; latitude?: number; longitude?: number
}

export const brStates = [
  { label: 'Acre', value: 'AC' }, { label: 'Alagoas', value: 'AL' }, { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' }, { label: 'Bahia', value: 'BA' }, { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' }, { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' }, { label: 'Maranhão', value: 'MA' }, { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' }, { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' }, { label: 'Paraíba', value: 'PB' }, { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' }, { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' }, { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' }, { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' }, { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' }, { label: 'Sergipe', value: 'SE' }, { label: 'Tocantins', value: 'TO' },
]
```

### 6.6 `types/building.ts`

```typescript
export interface Building extends BaseEntity {
  companyId: string; ownerId: string; ownerName?: string; capitationDate: string
  address: Address; status: BuildingStatus; propertyType: PropertyType
  area?: number; bedrooms?: number; bathrooms?: number; parkingSpaces?: number
  description?: string; rentValue?: number; saleValue?: number
  condominiumFee?: number; iptuValue?: number; photos: BuildingPhoto[]
}

export interface CreateBuildingDTO {
  ownerId: string; capitationDate: string; address: Address; propertyType: PropertyType
  area?: number; bedrooms?: number; bathrooms?: number; parkingSpaces?: number
  description?: string; rentValue?: number; saleValue?: number; condominiumFee?: number; iptuValue?: number
}

export interface UpdateBuildingDTO extends CreateBuildingDTO { status: BuildingStatus }
export interface BuildingPhoto { id: string; publicPath: string; filename: string; isMain: boolean; orderIndex: number }

export interface BuildingFilters {
  city?: string; neighbourhood?: string; propertyType?: PropertyType; status?: BuildingStatus
  minRentValue?: number; maxRentValue?: number; minArea?: number; maxArea?: number; bedrooms?: number
}

export type BuildingStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE'
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'COMMERCIAL' | 'LAND' | 'FARM'

export const buildingStatusOptions: SelectOption[] = [
  { label: 'Disponível', value: 'AVAILABLE' }, { label: 'Alugado', value: 'RENTED' },
  { label: 'Manutenção', value: 'MAINTENANCE' }, { label: 'Inativo', value: 'INACTIVE' },
]

export const propertyTypeOptions: SelectOption[] = [
  { label: 'Casa', value: 'HOUSE' }, { label: 'Apartamento', value: 'APARTMENT' },
  { label: 'Comercial', value: 'COMMERCIAL' }, { label: 'Terreno', value: 'LAND' }, { label: 'Fazenda/Sítio', value: 'FARM' },
]

export const buildingStatusColor: Record<BuildingStatus, string> = {
  AVAILABLE: 'success', RENTED: 'info', MAINTENANCE: 'warning', INACTIVE: 'neutral',
}
```

### 6.7 `types/client.ts`

```typescript
export interface Client extends BaseEntity {
  companyId: string; name: string; email: string; phone: string; cpf?: string; cnpj?: string; rg?: string
  personType: PersonType; clientTypes: ClientType[]; address?: Address
  birthDate?: string; profession?: string; monthlyIncome?: number; notes?: string
}

export interface CreateClientDTO {
  name: string; email: string; phone: string; cpf?: string; cnpj?: string; rg?: string
  personType: PersonType; clientTypes: ClientType[]; address?: Address
  birthDate?: string; profession?: string; monthlyIncome?: number; notes?: string
}

export type PersonType = 'PF' | 'PJ'
export type ClientType = 'LESSEE' | 'LESSOR'

export const personTypeOptions: SelectOption[] = [{ label: 'Pessoa Física', value: 'PF' }, { label: 'Pessoa Jurídica', value: 'PJ' }]
export const clientTypeOptions: SelectOption[] = [{ label: 'Locatário', value: 'LESSEE' }, { label: 'Locador', value: 'LESSOR' }]
```

### 6.8 `types/contract.ts`

```typescript
export interface Contract extends BaseEntity {
  companyId: string; buildingId: string; buildingAddress?: string
  lessorId: string; lessorName?: string; lesseeId: string; lesseeName?: string
  brokerId?: string; contractNumber: string; status: ContractStatus
  startDate: string; endDate: string; duration: number; rentValue: number
  administrationFee: number; adjustmentIndex: AdjustmentIndex; adjustmentMonth: number
  guaranteeType: GuaranteeType; guaranteeValue?: number; paymentDay: number
  paymentType: PaymentType; lateFeePercentage: number; dailyInterestRate: number
  clauses?: string; autoRenew: boolean; signedAt?: string
}

export type ContractStatus = 'DRAFT' | 'PENDING_SIGNATURE' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'EXPIRED' | 'RENEWED'
export type AdjustmentIndex = 'IGPM' | 'IPCA' | 'FIXED'
export type GuaranteeType = 'DEPOSIT' | 'SURETY' | 'INSURANCE' | 'CAPITALIZATION' | 'NONE'
export type PaymentType = 'ADVANCE_PAYMENT' | 'OVERDUE_PAYMENT'

export const contractStatusColor: Record<ContractStatus, string> = {
  DRAFT: 'neutral', PENDING_SIGNATURE: 'warning', ACTIVE: 'success', SUSPENDED: 'warning',
  TERMINATED: 'error', EXPIRED: 'neutral', RENEWED: 'info',
}
```

### 6.9 `types/rent.ts`

```typescript
export interface Rent extends BaseEntity {
  contractId: string; companyId: string; buildingId: string; buildingAddress?: string; lesseeName?: string
  referenceMonth: string; dueDate: string; baseValue: number; adjustedValue: number
  condominiumFee: number; iptuValue: number; totalValue: number; lateFee: number; interest: number
  finalValue: number; status: RentStatus; paymentDate?: string; paymentOrderId?: string
}

export type RentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIALLY_PAID'

export const rentStatusColor: Record<RentStatus, string> = {
  PENDING: 'warning', PAID: 'success', OVERDUE: 'error', CANCELLED: 'neutral', PARTIALLY_PAID: 'info',
}
```

### 6.10 `types/account.ts` e `types/entry.ts`

```typescript
// account.ts
export interface Account extends BaseEntity {
  companyId: string; name: string; code: string; type: AccountType
  balance: number; parentId?: string; isActive: boolean; children?: Account[]
}

export interface CreateAccountDTO { name: string; code: string; type: AccountType; parentId?: string }
export type AccountType = 'INCOME_ACCOUNT' | 'EXPENSE_ACCOUNT' | 'FINANCIAL_ACCOUNT'

// entry.ts
export interface Entry extends BaseEntity {
  companyId: string; value: number; type: EntryType; date: string; history: string
  financialAccountId: string; financialAccountName?: string
  classificationAccountId: string; classificationAccountName?: string; reconciled: boolean
}

export interface CreateEntryDTO {
  value: number; type: EntryType; date: string; history: string
  financialAccountId: string; classificationAccountId: string
}

export type EntryType = 'IN' | 'OUT' | 'TRANSFER'
```

### 6.11 `types/dashboard.ts`

```typescript
export interface DashboardSummary {
  totalBuildings: number; activeContracts: number; pendingRents: number; overdueRents: number
  monthlyIncome: number; monthlyExpense: number; occupancyRate: number; delinquencyRate: number
}

export interface CashFlowData { period: string; income: number; expense: number; balance: number }
export interface OccupancyRate { totalBuildings: number; rentedBuildings: number; availableBuildings: number; rate: number }
export interface DelinquencyRate { totalRents: number; overdueRents: number; rate: number; totalOverdueAmount: number }
export interface RevenueByBuilding { buildingId: string; buildingAddress: string; totalRevenue: number; pendingAmount: number }
```

### 6.12 `types/visit.ts` e `types/maintenance.ts`

```typescript
// visit.ts
export interface Visit extends BaseEntity {
  buildingId: string; buildingAddress?: string; clientId: string; clientName?: string
  brokerId?: string; brokerName?: string; scheduledAt: string; status: VisitStatus
  notes?: string; feedback?: string; rating?: number
}
export type VisitStatus = 'SCHEDULED' | 'CONFIRMED' | 'DONE' | 'CANCELLED' | 'NO_SHOW'

// maintenance.ts
export interface MaintenanceRequest extends BaseEntity {
  contractId: string; buildingId: string; buildingAddress?: string
  requesterId: string; requesterName?: string; category: MaintenanceCategory
  title: string; description: string; priority: MaintenancePriority; status: MaintenanceStatus
  estimatedCost?: number; actualCost?: number; assignedTo?: string; scheduledDate?: string; completedDate?: string
}
export type MaintenanceCategory = 'ELECTRICAL' | 'PLUMBING' | 'STRUCTURAL' | 'PAINTING' | 'APPLIANCE' | 'OTHER'
export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'CANCELLED'
```

### 6.13 `types/payment.ts` e `types/document.ts`

```typescript
// payment.ts
export interface PaymentOrder {
  id: string; externalId: string; status: PaymentStatus; method: PaymentMethod
  amount: number; paidAmount?: number; dueDate: string; paidAt?: string
  boleto?: { url: string; barcode: string; digitableLine: string }
  pix?: { qrCode: string; copyPaste: string; expiresAt: string }
  createdAt: string
}
export type PaymentStatus = 'CREATED' | 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'EXPIRED'
export type PaymentMethod = 'BOLETO' | 'PIX'

// document.ts
export interface Document extends BaseEntity {
  companyId: string; name: string; description?: string; type: DocumentType
  referenceId?: string; currentVersion: number; files: FileStorage[]
}
export interface FileStorage { id: string; contentType: string; size: number; publicPath: string; filename: string; extension: string }
export type DocumentType = 'BUILDING' | 'RENT' | 'PERSON' | 'CONTRACT' | 'MAINTENANCE' | 'KEY_HANDOVER' | 'INSURANCE'
```

---

## 7. Stores (Pinia)

### 7.1 `stores/auth.ts`

```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const permissions = computed(() => user.value?.permissions ?? [])
  const menus = computed(() => user.value?.menus ?? [])

  function hasPermission(p: string): boolean { return permissions.value.includes('ALL') || permissions.value.includes(p) }
  function hasMenu(m: string): boolean { return permissions.value.includes('ALL') || menus.value.includes(m) }

  async function fetchUser() {
    try { user.value = await $fetch<AuthUser>('/api/auth/me') } catch { user.value = null }
  }
  async function login(username: string, password: string) {
    const res = await $fetch<{ user: AuthUser }>('/api/auth/login', { method: 'POST', body: { username, password } })
    user.value = res.user
  }
  async function logout() { await $fetch('/api/auth/logout'); user.value = null; navigateTo('/login') }

  return { user, isAuthenticated, permissions, menus, hasPermission, hasMenu, fetchUser, login, logout }
})
```

### 7.2 `stores/company.ts`

```typescript
export const useCompanyStore = defineStore('company', () => {
  const selectedCompany = ref<CompanySummary | null>(null)
  const authStore = useAuthStore()
  const companies = computed(() => authStore.user?.companies ?? [])

  function selectCompany(c: CompanySummary) { selectedCompany.value = c; useCookie('companyId').value = c.id }
  function initFromCookie() {
    const id = useCookie('companyId').value
    if (id) { const found = companies.value.find(c => c.id === id); if (found) selectedCompany.value = found }
    if (!selectedCompany.value && companies.value.length) selectCompany(companies.value[0])
  }

  return { selectedCompany, companies, selectCompany, initFromCookie }
})
```

### 7.3 `stores/ui.ts`

```typescript
export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const sidebarCollapsed = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
  function setTheme(t: 'light' | 'dark') {
    theme.value = t
    if (import.meta.client) { document.documentElement.classList.toggle('dark', t === 'dark'); localStorage.setItem('theme', t) }
  }
  function initTheme() { if (import.meta.client) setTheme((localStorage.getItem('theme') as any) ?? 'light') }

  return { sidebarOpen, sidebarCollapsed, theme, toggleSidebar, setTheme, initTheme }
})
```

---

## 8. Composables

### 8.1 `composables/useApi.ts`

```typescript
export function useApi<T>(url: string, options?: any) {
  return useFetch<T>(`/api${url}`, { ...options,
    onResponseError({ response }) {
      const toast = useToast()
      if (response.status === 401) navigateTo('/login')
      else if (response.status === 403) toast.add({ title: 'Sem permissão', color: 'error' })
      else if (response.status >= 500) toast.add({ title: 'Erro interno', color: 'error' })
    },
  })
}

export async function api<T>(url: string, options?: any): Promise<T> {
  return $fetch<T>(`/api${url}`, { ...options })
}
```

### 8.2 Composables de Domínio

Cada composable é independente e dedicado à sua entidade, sem herança ou composable genérico compartilhado. Cada um encapsula seu próprio estado, loading, paginação e métodos específicos.

#### `composables/useBuildings.ts`

```typescript
export function useBuildings() {
  const items = ref<Building[]>([])
  const item = ref<Building | null>(null)
  const loading = ref(false)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const currentPage = ref(0)

  async function fetchAll(params?: PaginationParams & BuildingFilters) {
    loading.value = true
    try {
      const data = await api<PaginatedResponse<Building>>('/buildings', { params })
      items.value = data.content
      totalPages.value = data.totalPages
      totalElements.value = data.totalElements
      currentPage.value = data.number
    } finally { loading.value = false }
  }

  async function fetchById(id: string) {
    loading.value = true
    try { item.value = await api<Building>(`/buildings/${id}`) }
    finally { loading.value = false }
  }

  async function create(dto: CreateBuildingDTO) {
    return api<Building>('/buildings', { method: 'POST', body: dto })
  }

  async function update(id: string, dto: UpdateBuildingDTO) {
    return api<void>(`/buildings/${id}`, { method: 'PUT', body: dto })
  }

  async function remove(id: string) {
    return api<void>(`/buildings/${id}`, { method: 'DELETE' })
  }

  async function uploadPhoto(buildingId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return api(`/buildings/${buildingId}/photos`, { method: 'POST', body: formData })
  }

  return { items, item, loading, totalPages, totalElements, currentPage, fetchAll, fetchById, create, update, remove, uploadPhoto }
}
```

#### `composables/useClients.ts`

```typescript
export function useClients() {
  const items = ref<Client[]>([])
  const item = ref<Client | null>(null)
  const loading = ref(false)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const currentPage = ref(0)

  async function fetchAll(params?: PaginationParams & ClientFilters) {
    loading.value = true
    try {
      const data = await api<PaginatedResponse<Client>>('/clients', { params })
      items.value = data.content; totalPages.value = data.totalPages
      totalElements.value = data.totalElements; currentPage.value = data.number
    } finally { loading.value = false }
  }

  async function fetchById(id: string) {
    loading.value = true
    try { item.value = await api<Client>(`/clients/${id}`) }
    finally { loading.value = false }
  }

  async function create(dto: CreateClientDTO) { return api<Client>('/clients', { method: 'POST', body: dto }) }
  async function update(id: string, dto: UpdateClientDTO) { return api<void>(`/clients/${id}`, { method: 'PUT', body: dto }) }
  async function remove(id: string) { return api<void>(`/clients/${id}`, { method: 'DELETE' }) }

  return { items, item, loading, totalPages, totalElements, currentPage, fetchAll, fetchById, create, update, remove }
}
```

#### `composables/useContracts.ts`

```typescript
export function useContracts() {
  const items = ref<Contract[]>([])
  const item = ref<Contract | null>(null)
  const loading = ref(false)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const currentPage = ref(0)

  async function fetchAll(params?: PaginationParams & ContractFilters) {
    loading.value = true
    try {
      const data = await api<PaginatedResponse<Contract>>('/contracts', { params })
      items.value = data.content; totalPages.value = data.totalPages
      totalElements.value = data.totalElements; currentPage.value = data.number
    } finally { loading.value = false }
  }

  async function fetchById(id: string) {
    loading.value = true
    try { item.value = await api<Contract>(`/contracts/${id}`) }
    finally { loading.value = false }
  }

  async function create(dto: CreateContractDTO) { return api<Contract>('/contracts', { method: 'POST', body: dto }) }
  async function update(id: string, dto: CreateContractDTO) { return api<void>(`/contracts/${id}`, { method: 'PUT', body: dto }) }
  async function remove(id: string) { return api<void>(`/contracts/${id}`, { method: 'DELETE' }) }

  async function renewContract(id: string) { return api(`/contracts/${id}/renew`, { method: 'POST' }) }
  async function terminateContract(id: string) { return api(`/contracts/${id}/terminate`, { method: 'POST' }) }
  async function sendForSignature(id: string) { return api(`/contracts/${id}/send-signature`, { method: 'POST' }) }
  async function fetchRents(contractId: string, params?: PaginationParams) {
    return api<PaginatedResponse<Rent>>(`/contracts/${contractId}/rents`, { params })
  }

  return { items, item, loading, totalPages, totalElements, currentPage, fetchAll, fetchById, create, update, remove, renewContract, terminateContract, sendForSignature, fetchRents }
}
```

#### `composables/useRents.ts`

```typescript
export function useRents() {
  const items = ref<Rent[]>([])
  const loading = ref(false)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const currentPage = ref(0)

  async function fetchAll(params?: PaginationParams & RentFilters) {
    loading.value = true
    try {
      const data = await api<PaginatedResponse<Rent>>('/rents', { params })
      items.value = data.content; totalPages.value = data.totalPages
      totalElements.value = data.totalElements; currentPage.value = data.number
    } finally { loading.value = false }
  }

  async function fetchOverdue(params?: PaginationParams) {
    return api<PaginatedResponse<Rent>>('/rents/overdue', { params })
  }

  async function generateForContract(contractId: string) {
    return api('/rents/generate', { method: 'POST', body: { contractId } })
  }

  return { items, loading, totalPages, totalElements, currentPage, fetchAll, fetchOverdue, generateForContract }
}
```

#### Demais composables (mesma estrutura dedicada)

```typescript
// composables/useAccounts.ts — fetchAll, fetchById, create, update, remove + fetchTree(): Account[]
// composables/useEntries.ts — fetchAll, fetchById, create, update, remove (EntryFilters)
// composables/useUsers.ts — fetchAll, fetchById, create, update, remove (UserSituation filter)
// composables/useProfiles.ts — fetchAll, fetchById, create, update, remove
// composables/useCompanies.ts — fetchAll, fetchById, create, update, remove
// composables/useParameters.ts — fetchAll, fetchById, create, update, remove
// composables/useVisits.ts — fetchAll, fetchById, create, remove + updateStatus(id, VisitStatus)
// composables/useMaintenance.ts — fetchAll, fetchById, create, remove + updateStatus(id, MaintenanceStatus)
// composables/useDocuments.ts — fetchAll, fetchById, create, remove + upload(File, DocumentType, referenceId?), downloadUrl(fileId)
// composables/useDashboard.ts — fetchSummary, fetchCashFlow, fetchOccupancyRate, fetchDelinquencyRate, fetchRevenueByBuilding
```

> **Observação:** Cada composable declara seu próprio estado (`items`, `item`, `loading`, `totalPages`, etc.) e métodos. Não existe `useCrud` genérico — a duplicação de estrutura é intencional para manter cada composable independente, explícito e fácil de estender com métodos específicos da entidade.

---

## 9. Server Routes (BFF)

### 9.1 `server/utils/gateway.ts`

```typescript
export async function proxyToGateway<T = any>(event: H3Event, path: string, options?: { method?: string; body?: any; params?: Record<string, string> }): Promise<T> {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'accessToken')
  const companyId = getCookie(event, 'companyId')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cookie) headers['Authorization'] = `Bearer ${cookie}`
  if (companyId) headers['X-Company-Id'] = companyId
  const url = new URL(`${config.apiGatewayUrl}/api/v1${path}`)
  if (options?.params) Object.entries(options.params).forEach(([k, v]) => { if (v != null && v !== '') url.searchParams.set(k, v) })
  return $fetch<T>(url.toString(), { method: (options?.method as any) ?? 'GET', headers, body: options?.body })
}
```

### 9.2 `server/utils/cookies.ts`

```typescript
const OPTS = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
export function setAuthCookie(event: H3Event, token: string) { setCookie(event, 'accessToken', token, { ...OPTS, maxAge: 36000 }) }
export function clearAuthCookie(event: H3Event) { setCookie(event, 'accessToken', '', { ...OPTS, maxAge: 0 }); setCookie(event, 'companyId', '', { ...OPTS, httpOnly: false, maxAge: 0 }) }
export function getAuthToken(event: H3Event) { return getCookie(event, 'accessToken') }
```

### 9.3 `server/utils/error.ts`

```typescript
export function handleGatewayError(error: any): never {
  const status = error?.response?.status ?? error?.statusCode ?? 500
  const data = error?.response?._data ?? error?.data ?? {}
  throw createError({ statusCode: status, statusMessage: data?.error?.message ?? 'Erro interno', data: data?.error?.details })
}
```

### 9.4 Padrão de Server Routes (login, CRUD, catch-all)

```typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const res = await proxyToGateway<{ token: string; user: any }>(event, '/auth/login', { method: 'POST', body })
    setAuthCookie(event, res.token)
    return { message: 'Login realizado', user: res.user }
  } catch (e) { handleGatewayError(e) }
})

// server/api/auth/me.get.ts — retorna user ou 401
// server/api/auth/logout.get.ts — clearAuthCookie

// CRUD pattern (ex: buildings)
// index.get.ts → proxyToGateway(event, '/buildings', { params: queryToParams(event) })
// index.post.ts → proxyToGateway(event, '/buildings', { method: 'POST', body: await readBody(event) })
// [id].get.ts → proxyToGateway(event, `/buildings/${getRouterParam(event, 'id')}`)
// [id].put.ts → proxyToGateway(event, `/buildings/${id}`, { method: 'PUT', body })
// [id].delete.ts → proxyToGateway(event, `/buildings/${id}`, { method: 'DELETE' })

// Dashboard aggregation (BFF compõe múltiplos endpoints em paralelo via Promise.all)

// server/api/[...].ts — catch-all proxy para rotas não mapeadas explicitamente
export default defineEventHandler(async (event) => {
  const path = event.path.replace('/api', '')
  const method = event.method
  const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await readBody(event) : undefined
  try { return await proxyToGateway(event, path, { method, body, params: method === 'GET' ? queryToParams(event) : undefined }) }
  catch (e) { handleGatewayError(e) }
})
```

---

## 10. Middleware (Client-Side)

```typescript
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (['/login', '/forgot-password', '/reset-password'].some(r => to.path.startsWith(r))) return
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) await authStore.fetchUser()
  if (!authStore.isAuthenticated) return navigateTo('/login')
  const companyStore = useCompanyStore()
  if (!companyStore.selectedCompany) companyStore.initFromCookie()
})

// middleware/permission.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const perm = to.meta.permission as string | undefined
  if (perm && !authStore.hasPermission(perm)) throw createError({ statusCode: 403, statusMessage: 'Sem permissão' })
})
```

---

## 11. Layouts

### `layouts/default.vue` — Sidebar + Header

```vue
<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <LayoutAppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <LayoutAppHeader />
      <main class="flex-1 overflow-y-auto p-6"><LayoutAppBreadcrumb /><slot /></main>
      <LayoutAppFooter />
    </div>
  </div>
</template>
```

### `layouts/auth.vue` — Login (sem sidebar)

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md p-8"><slot /></div>
  </div>
</template>
```

### `layouts/portal.vue` — Portal Inquilino/Proprietário

```vue
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">{{ route.path.includes('tenant') ? 'Portal do Inquilino' : 'Portal do Proprietário' }}</h1>
      <UButton variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" @click="authStore.logout()" />
    </header>
    <nav class="bg-white dark:bg-gray-800 border-b px-6"><slot name="tabs" /></nav>
    <main class="p-6"><slot /></main>
  </div>
</template>
```

---

## 12. Páginas — Exemplos Principais

### `pages/login.vue`

```vue
<script setup lang="ts">
import { z } from 'zod'
definePageMeta({ layout: false })
const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)
const loginSchema = z.object({ username: z.string().email(), password: z.string().min(8) })
const form = reactive({ username: '', password: '' })

async function handleLogin() {
  loading.value = true
  try { await authStore.login(form.username, form.password); navigateTo('/') }
  catch (e: any) { toast.add({ title: 'Erro', description: e?.data?.message ?? 'Credenciais inválidas', color: 'error' }) }
  finally { loading.value = false }
}
</script>

<template>
  <NuxtLayout name="auth">
    <UCard>
      <template #header><h2 class="text-2xl font-bold text-center">Sistema Imobiliário</h2></template>
      <UForm :schema="loginSchema" :state="form" @submit="handleLogin">
        <div class="space-y-4">
          <UFormField label="E-mail" name="username"><UInput v-model="form.username" type="email" /></UFormField>
          <UFormField label="Senha" name="password"><UInput v-model="form.password" type="password" /></UFormField>
          <UButton type="submit" block :loading="loading">Entrar</UButton>
        </div>
      </UForm>
      <template #footer><NuxtLink to="/forgot-password" class="text-sm text-primary">Esqueceu a senha?</NuxtLink></template>
    </UCard>
  </NuxtLayout>
</template>
```

### `pages/index.vue` — Dashboard

KPI cards (imóveis, contratos ativos, aluguéis pendentes, vencidos) + gráficos (fluxo de caixa, ocupação, inadimplência, receita por imóvel). Usa `useDashboard()` e `useApi()`.

### `pages/buildings/index.vue` — Listagem CRUD

Filtros (`BuildingFilters`), tabela paginada (`BuildingTable`), botões condicionais por permissão (`authStore.hasPermission('CREATE_BUILDINGS')`), dialog de confirmação para delete, paginação server-side.

### `pages/buildings/[id].vue` — Detalhes com Tabs

Tabs: Informações, Fotos, Documentos, Visitas. Exibe endereço, valores, status badge. Botão de edição condicional por permissão.

### `pages/financial/dashboard.vue` — Dashboard Financeiro

Seletor de período (mês atual, 3/6/12 meses, personalizado), cards de receita/despesa/ocupação/inadimplência, gráficos de fluxo de caixa e receita por imóvel.

---

## 13. Componentes Reutilizáveis

| Componente                | Descrição                                           |
|--------------------------|------------------------------------------------------|
| `ConfirmDialog`          | Modal de confirmação com cancel/confirm              |
| `CurrencyDisplay`        | Formata valor como R$ (Intl.NumberFormat pt-BR)      |
| `DateDisplay`            | Formata data em dd/MM/yyyy ou extenso                |
| `EmptyState`             | Estado vazio com ícone + mensagem + slot para ação   |
| `Pagination`             | Paginação com total + navegação de páginas           |
| `AddressForm`            | Formulário de endereço com auto-complete via ViaCEP  |
| `CompanySwitcher`        | Select para trocar de empresa (multi-tenant)         |
| `PermissionMatrix`       | Grid de checkboxes para atribuir permissões a perfis |
| `SkeletonTable`          | Skeleton loader para tabelas                         |
| `FileUploader`           | Upload com drag-and-drop, preview e validação        |

---

## 14. Utils

### `utils/formatters.ts`

`formatCurrency`, `formatDate`, `formatDateTime`, `formatCpf`, `formatCnpj`, `formatCep`, `formatPhone`, `formatArea`, `formatPercentage`

### `utils/validators.ts`

Schemas Zod para: `address`, `building`, `client`, `contract`, `entry`, `user`, `profile` — com validação de CPF/CNPJ/CEP/telefone via regex.

### `utils/constants.ts`

`APP_NAME`, `DEFAULT_PAGE_SIZE` (20), `MAX_FILE_SIZE` (50MB), `ACCEPTED_IMAGE_TYPES`, `ACCEPTED_DOCUMENT_TYPES`

---

## 15. Menus e Navegação

| Menu                          | Rota                          | Permissão              | Layout  |
|-------------------------------|-------------------------------|------------------------|---------|
| Dashboard                     | `/`                           | HOME_MENU              | default |
| Imóveis                       | `/buildings`                  | READ_ALL_BUILDINGS     | default |
| Clientes                      | `/clients`                    | READ_ALL_CLIENTS       | default |
| Contratos                     | `/contracts`                  | READ_ALL_CONTRACTS     | default |
| Aluguéis                      | `/rents`                      | READ_ALL_RENTS         | default |
| Aluguéis Vencidos             | `/rents/overdue`              | READ_ALL_RENTS         | default |
| Financeiro > Contas           | `/financial/accounts`         | ACCOUNTS_MENU          | default |
| Financeiro > Lançamentos      | `/financial/entries`          | ENTRIES_MENU           | default |
| Financeiro > Dashboard        | `/financial/dashboard`        | ACCOUNTS_MENU          | default |
| Financeiro > Repasses         | `/financial/owner-transfers`  | ACCOUNTS_MENU          | default |
| Usuários                      | `/users`                      | USERS_MENU             | default |
| Perfis                        | `/profiles`                   | PROFILES_MENU          | default |
| Empresas                      | `/companies`                  | COMPANIES_MENU         | default |
| Parâmetros                    | `/parameters`                 | PARAMETERS_MENU        | default |
| Portal Inquilino              | `/tenant-portal`              | (auth: client)         | portal  |
| Portal Proprietário           | `/owner-portal`               | (auth: client)         | portal  |

---

## 16. Configuração

### `.env`
```env
NUXT_API_GATEWAY_URL=http://localhost:8080
NODE_ENV=development
NUXT_COOKIE_SECURE=false
NUXT_COOKIE_DOMAIN=localhost
```

### `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    apiGatewayUrl: process.env.NUXT_API_GATEWAY_URL || 'http://localhost:8080',
    cookieSecure: process.env.NUXT_COOKIE_SECURE === 'true',
    cookieDomain: process.env.NUXT_COOKIE_DOMAIN || 'localhost',
    public: { appName: 'Sistema Imobiliário' },
  },
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxt/icon', '@vueuse/nuxt', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
})
```

---

## 17. Regras e Boas Práticas

1. **JWT nunca no client-side** — cookie `httpOnly`, impossível acessar via JS do browser
2. **BFF como proxy** — browser chama `/api/*` (mesmo domínio), Nitro faz proxy para o gateway
3. **Composables dedicados** — Cada entidade tem seu próprio composable independente, sem herança genérica
4. **Paginação server-side** — nunca carregar todos os dados, usar `?page=0&size=20`
5. **Validação dupla** — Zod no frontend (UX) + backend (segurança)
6. **Permissions no frontend** — sidebar e botões renderizam condicionalmente via `authStore.hasPermission()`
7. **Toast notifications** — feedback visual em todas as operações
8. **Confirm dialogs** — confirmação antes de operações destrutivas
9. **Tema dark/light** — Nuxt UI + `dark:` classes
10. **CEP autocomplete** — `AddressForm` busca via ViaCEP
11. **Responsividade** — grid Tailwind (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)

---

## 18. Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output .output
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 19. `package.json`

```json
{
  "name": "nuxt-bff",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "typecheck": "nuxt typecheck",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@pinia/nuxt": "^0.9", "@vueuse/nuxt": "^12", "chart.js": "^4",
    "nuxt": "^3.16", "pinia": "^3", "vue": "^3.5", "vue-chartjs": "^5", "zod": "^3"
  },
  "devDependencies": {
    "@nuxt/icon": "^1", "@nuxt/image": "^1", "@nuxt/ui": "^3",
    "@playwright/test": "^1", "@vue/test-utils": "^2", "@vee-validate/zod": "^4",
    "eslint": "^9", "prettier": "^3", "typescript": "^5", "vee-validate": "^4", "vitest": "^3"
  }
}
```

