# DoeCerto - Frontend

> Aplicação web e mobile para conectar doadores a organizações sociais

## 📋 Índice

- [O Que Foi Feito](#o-que-foi-feito)
- [Arquitetura](#arquitetura)
- [Como Começar](#como-começar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Principais Páginas](#principais-páginas)
- [Services e API](#services-e-api)
- [Mobile (Capacitor)](#mobile-capacitor)
- [Workflow GitHub - Branch distributed-systems](#workflow-github---branch-distributed-systems)
- [Comandos Úteis](#comandos-úteis)

---

## O Que Foi Feito

Frontend completo em **Next.js 16** com suporte para web e mobile (Android via Capacitor).

### Stack Tecnológico

- **Next.js 16** - Framework React com SSG
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Framer Motion** - Animações
- **Capacitor 7** - Bridge para Android
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

### Funcionalidades Implementadas

#### Para Doadores
- ✅ Autenticação (login/registro com CPF)
- ✅ Perfil com avatar, bio e histórico
- ✅ Listagem de ONGs com filtros por categoria
- ✅ Doação de dinheiro (PIX) com comprovante
- ✅ Doação de materiais (itens da wishlist)
- ✅ Histórico de doações com status
- ✅ Avaliação e comentários em ONGs
- ✅ Dashboard pessoal com estatísticas

#### Para ONGs
- ✅ Registro e autenticação (CNPJ)
- ✅ Perfil completo (banner, logo, descrição, categorias)
- ✅ Configuração de dados bancários e PIX
- ✅ Wishlist de itens que aceitam doação
- ✅ Dashboard para gerenciar doações recebidas
- ✅ Aceitar/rejeitar doações com motivo
- ✅ Visualizar comprovantes de doação
- ✅ Estatísticas e avaliações dos doadores

#### Para Administradores
- ✅ Painel administrativo completo
- ✅ Gerenciar ONGs (aprovar/rejeitar com motivo)
- ✅ Visualizar estatísticas gerais
- ✅ Métricas de doações e engajamento
- ✅ Gerenciar categorias de ONGs
- ✅ Dashboard com rankings e análises

---

## Arquitetura

### Estrutura de Pastas

```
src/
├── app/                          # Páginas Next.js (App Router)
│   ├── page.tsx                 # Splash screen
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── home/
│   ├── donate/
│   ├── donation/
│   ├── pix/
│   ├── ong-dashboard/
│   ├── ong-profilesetup/
│   ├── ong-register/
│   ├── ong-public-profile/
│   ├── adm-dashboard/
│   └── layout.tsx
│
├── components/
│   ├── layouts/
│   │   └── AdminLayout.tsx
│   ├── specific/                # Componentes de features
│   └── ui/                      # Componentes reutilizáveis
│
├── services/                     # Chamadas à API
│   ├── api.ts                   # Cliente HTTP
│   ├── login.service.ts
│   ├── donor.service.ts
│   ├── ongs-profile.service.ts
│   ├── donations.service.ts
│   └── ...
│
├── utils/
│   └── documentValidation.ts    # Validação CPF/CNPJ
│
└── globals.css

android/                          # Capacitor/Android
capacitor.config.ts
```

### Fluxo de Autenticação

1. Usuário faz login em `/login`
2. Backend retorna `accessToken` + `userRole`
3. Token armazenado em:
   - **Nativo**: `Preferences.set('access_token')`
   - **Web**: `localStorage` + `document.cookie`
4. Helper `api.ts` injeta token no header
5. Redirecionamento por role:
   - `admin` → `/adm-dashboard`
   - `ong` → `/ong-dashboard`
   - `donor` → `/home`

### Fluxo de Doação

**Dinheiro (PIX):**
Home → Modal "Como doar?" → "Dinheiro" → `/pix?id={ongId}` → Upload comprovante → ONG recebe em pendente → Aceita/Rejeita

**Materiais:**
Home → Modal "Como doar?" → "Itens" → `/donation?ongId={ongId}` → Seleciona item de wishlist → Descreve quantidade → ONG recebe em pendente → Aceita/Rejeita

---

## Como Começar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- (Opcional) Android Studio para APK

### Instalação

```bash
# Clonar repositório
git clone <seu-repo>
cd frontend

# Instalar dependências
npm install

# Configurar variáveis
cp .env.example .env.local
# Editar: NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Desenvolvimento Web

```bash
npm run dev
# Acesso: http://localhost:3000
```

### Build e Preview

```bash
npm run build
npm start
```

### Mobile (Android)

```bash
# 1. Build Next.js
npm run build

# 2. Copiar para Capacitor
npx cap copy

# 3. Abrir Android Studio
npx cap open android

# 4. Build e Run (no Android Studio)
```

---

## Estrutura do Projeto

### Páginas Principais

**Splash & Login:**
- `/page.tsx` - Splash (3s → `/login`)
- `/login` - Login (email/senha)
- `/forgot-password` - Recuperação
- `/reset-password` - Reset via token

**Registro:**
- `/register-choice` - Escolher tipo (doador/ONG)
- `/register` - Registro doador (CPF)
- `/ong-register` - Registro ONG (CNPJ)

**Doador:**
- `/home` - Listagem ONGs com filtros
- `/dashboard` - Perfil do doador
- `/ong-public-profile?id={id}` - Ver ONG
- `/donation?ongId={id}` - Doar materiais
- `/pix?id={id}` - Doar dinheiro

**ONG:**
- `/ong-dashboard` - Gerenciar doações
- `/ong-profilesetup` - Configurar perfil

**Admin:**
- `/adm-dashboard` - Painel completo (aprovar ONGs, métricas, categorias)

---

## Autenticação

### Validações

- **CPF**: Máscara (000.000.000-00) + validação de dígitos
- **CNPJ**: Máscara (00.000.000/0000-00) + validação de dígitos
- **Senha**: Mínimo 6 caracteres, confirmação em tempo real
- **Feedback visual**: shake animation ao erro, verde ao sucesso

### Token Storage

| Ambiente | Storage | Local |
|---|---|---|
| Android (Nativo) | Capacitor Preferences | `/data/data/.../preferences.xml` |
| Web | localStorage | Browser storage |
| Ambos | Cookies | HTTP headers (automático) |

---

## Services e API

### Cliente HTTP (`api.ts`)

```typescript
async api<T>(endpoint: string, options?: RequestInit)
```

Injeta token, suporta JSON/FormData, redireciona se 401.

### Principais Serviços

**DonorService** - Perfil doador, histórico, avatar
**OngsProfileService** - Perfil ONG, avaliações, dados públicos
**DonationService** - Criar doações, aceitar/rejeitar
**AdminService** - Gerenciar ONGs, aprovar/rejeitar
**OngSetupService** - Configuração de perfil ONG
**WishlistService** - Itens que ONG aceita
**MetricsService** - Estatísticas e categorias

---

## Mobile (Capacitor)

### Configuração

```typescript
// capacitor.config.ts
{
  appId: 'com.paulo.doecerto',
  appName: 'DoeCerto',
  webDir: 'out',  // SSG output
  server: {
    hostname: 'localhost',
    androidScheme: 'http'
  }
}
```

### Android

- Min SDK: 23 (Android 6.0)
- Target SDK: 35 (Android 15)
- Java: 21

### Build para Produção

```bash
# Android Studio → Build → Generate Signed Bundle/APK
# Resultado: android/app/release/app-release.apk
```

---

## Workflow GitHub - Branch distributed-systems

### Visão Geral

`distributed-systems` é o branch principal de desenvolvimento. Usa CI/CD automático com proteções.

### Fluxo de Desenvolvimento

#### 1. Criar Feature Branch

```bash
git checkout distributed-systems
git pull origin distributed-systems
git checkout -b feature/sua-feature

# Exemplos:
# feature/wishlist-items
# feature/admin-metrics
# feature/donor-ratings
```

#### 2. Desenvolvimento Local

```bash
npm run dev
# Testar em http://localhost:3000
```

#### 3. Commit com Padrão

```bash
# Commits descritivos (Conventional Commits)
git add .
git commit -m "feat: adicionar filtro de categorias"
git commit -m "fix: validação de CPF"
git commit -m "refactor: reorganizar componentes Home"
git commit -m "docs: atualizar README"
```

#### 4. Push e Pull Request

```bash
git push origin feature/sua-feature
```

No GitHub:
- Clica "Compare & pull request"
- Base: `distributed-systems`
- Compare: `feature/sua-feature`
- Preenche descrição e checklist

**Template de PR:**

```markdown
## Descrição
[O que foi feito?]

## Tipo de mudança
- [x] Nova feature
- [ ] Bug fix
- [ ] Breaking change

## Como testar
1. [Passo 1]
2. [Passo 2]

## Issues relacionadas
Fixes #123

## Screenshots
[Se UI mudou]
```

#### 5. CI/CD Automático

Quando você faz push, rodam automaticamente:

**Lint & Tipos:**
```bash
npm run lint        # ESLint + Prettier
tsc --noEmit        # TypeScript check
```

**Build:**
```bash
npm run build       # Next.js build
```

Se falhar:
- PR mostra ❌ (CI failed)
- Você corrige e faz `git push` novamente
- CI roda automaticamente

#### 6. Revisão Manual

Mantenedores reviram código, lógica e performance.

Se pedirm mudanças, você faz e faz push novamente.

#### 7. Merge (Automático)

Depois de aprovado:

```bash
# Mantenedor clica "Squash and merge" ou "Rebase and merge"
```

Sua feature agora está em `distributed-systems`!

#### 8. Deploy Automático

Depois do merge:
- Build automático para staging
- Pode testar em `staging.doecerto.com`

#### 9. Release para Produção

Quando pronto:

```bash
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0
```

Dispara:
- Build de produção
- Deploy para `doecerto.eastus2.cloudapp.azure.com`
- Build de APK de produção

### Proteções da Branch

`distributed-systems` está protegida:
- ✅ Requer PR para merge (não pode push direto)
- ✅ Requer review aprovada
- ✅ Requer CI/CD passar
- ✅ Dismisser stale reviews (novos commits "resetam" reviews)

### Conflito de Merge

Se `distributed-systems` avançou:

```bash
git fetch origin
git rebase origin/distributed-systems

# Se conflitos:
# Editor marca os conflitos
# Você resolve (⬅️ ou ➡️ )
# git add .
# git rebase --continue

# Se errar muito:
# git rebase --abort

# Push (need --force-with-lease depois rebase)
git push origin feature/sua-feature --force-with-lease
```

### Sincronizar Fork

Se está em fork:

```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git rebase upstream/distributed-systems
git push origin distributed-systems
```

### Resumo Visual

```
1. git checkout -b feature/xyz
2. [Editar código, commitar]
3. git push origin feature/xyz
4. GitHub → Abrir PR
5. [CI passa ✅, review aprova ✅]
6. GitHub → Merge
7. Feature está em distributed-systems!
```

### Comandos Úteis

```bash
# Ver branches
git branch -a

# Deletar local
git branch -d feature/xyz

# Deletar remoto
git push origin --delete feature/xyz

# Ver commits pendentes
git log distributed-systems..HEAD

# Ver diferenças
git diff distributed-systems
```

---

## Comandos Úteis

### Desenvolvimento

```bash
npm run dev         # Servidor dev (port 3000)
npm run build       # Build produção
npm start           # Preview build
npm run lint        # ESLint + Prettier check
```

### Mobile

```bash
npx cap copy        # Copiar para Capacitor
npx cap sync        # Sincronizar tudo
npx cap open android # Abrir Android Studio
```

### Git

```bash
git stash           # Guardar mudanças temporariamente
git stash pop       # Recuperar
git diff            # Ver mudanças
git restore .       # Descartar mudanças
git commit --amend  # Editar último commit
```

---

## Variáveis de Ambiente

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Produção

```env
NEXT_PUBLIC_API_URL=https://api.doecerto.eastus2.cloudapp.azure.com
```

---

**Última atualização**: 13 de Fevereiro de 2026

**Frontend pronto para produção! 🚀**
