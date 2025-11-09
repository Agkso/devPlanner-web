# Dev Planner Frontend

Frontend profissional em React/TypeScript para a plataforma **Dev Planner**, uma ferramenta moderna de gestão de projetos com metodologia Kanban.

## 🎯 Visão Geral

O Dev Planner Frontend é uma aplicação web responsiva que oferece:

- **Autenticação JWT** com refresh token automático
- **Gestão de Projetos** (CRUD completo)
- **Quadro Kanban** com 3 colunas (A Fazer, Fazendo, Feito)
- **Logs de Auditoria** (apenas para Admin)
- **Design Profissional** com paleta de cores coesa
- **Interface Responsiva** para desktop, tablet e mobile

## 🛠️ Stack Tecnológico

- **React 19** com TypeScript
- **Vite** para build rápido
- **Tailwind CSS 4** para estilização
- **shadcn/ui** para componentes
- **Axios** para requisições HTTP
- **Wouter** para roteamento
- **Sonner** para notificações

## 📁 Estrutura de Pastas

```
client/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos React (Auth, Theme)
│   ├── hooks/           # Hooks customizados (useAuth, useApi)
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços (API, etc)
│   ├── types/           # Tipos TypeScript
│   ├── App.tsx          # Componente raiz
│   ├── main.tsx         # Entrada da aplicação
│   └── index.css        # Estilos globais
├── index.html           # HTML principal
└── tailwind.config.ts   # Configuração Tailwind
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Backend Node.js/MongoDB rodando (veja `dev-planner-backend`)

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd dev-planner-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com a URL do seu backend:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

5. **Acesse a aplicação:**
   Abra seu navegador em `http://localhost:5173`

## 📖 Páginas da Aplicação

### 🔐 Autenticação

- **Login** (`/login`) - Faça login com suas credenciais
- **Registro** (`/register`) - Crie uma nova conta

### 📊 Dashboard

- **Home** (`/`) - Página inicial com atalhos rápidos
- **Projetos** (`/projects`) - Crie, edite e delete projetos
- **Tarefas/Kanban** (`/tasks`) - Gerencie tarefas com Kanban
- **Logs Admin** (`/admin/logs`) - Visualize logs de auditoria (Admin only)

## 🔑 Funcionalidades Principais

### Autenticação JWT

O frontend implementa autenticação JWT com:

- **Access Token** (curta duração) para requisições
- **Refresh Token** (longa duração) para renovação automática
- **Interceptadores Axios** que renovam o token automaticamente
- **Persistência** de dados no localStorage

### Contexto de Autenticação

Use o hook `useAuth` em qualquer componente:

```typescript
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Bem-vindo, {user?.name}!</p>}
    </div>
  );
}
```

### Rotas Protegidas

Use o componente `PrivateRoute` para proteger rotas:

```typescript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>

// Com restrição de role
<PrivateRoute requiredRole="Admin">
  <AdminPanel />
</PrivateRoute>
```

### Gestão de Projetos

- Criar novo projeto
- Listar todos os projetos
- Editar projeto
- Deletar projeto

### Quadro Kanban

- 3 colunas: "A Fazer", "Fazendo", "Feito"
- Criar tarefa
- Editar tarefa
- Deletar tarefa
- Mudar status da tarefa
- Seletor de projeto

### Logs de Auditoria (Admin)

- Visualizar todas as ações do sistema
- Filtrar por usuário, ação ou recurso
- Ver detalhes de cada ação

## 🎨 Design System

### Paleta de Cores

| Cor | Código | Uso |
| --- | --- | --- |
| Primária (Azul) | `#1e40af` | Botões, links, destaques |
| Secundária (Púrpura) | `#7c3aed` | Elementos secundários |
| Sucesso (Verde) | `#10b981` | Ações bem-sucedidas |
| Aviso (Âmbar) | `#f59e0b` | Avisos |
| Erro (Vermelho) | `#ef4444` | Erros e alertas |

### Tipografia

- **Fonte:** Inter (Google Fonts)
- **Tamanhos:** 12px, 14px, 16px, 18px, 20px, 24px, 32px

### Componentes

Todos os componentes usam **shadcn/ui** para consistência:

- Button
- Card
- Input
- Label
- Dialog
- Select
- Table
- Dropdown Menu
- Tooltip

## 🔄 Fluxo de Dados

```
Componente
    ↓
useAuth / useApi (Hooks)
    ↓
AuthContext / API Service
    ↓
Axios (com interceptadores)
    ↓
Backend (Node.js/MongoDB)
```

## 📱 Responsividade

A aplicação é totalmente responsiva:

- **Mobile:** Layout em coluna única, sidebar colapsável
- **Tablet:** Grid de 2 colunas
- **Desktop:** Grid de 3 colunas, layout completo

## 🧪 Testes de Integração

Para testar a integração com o backend:

1. **Certifique-se de que o backend está rodando:**
   ```bash
   docker-compose up -d
   ```

2. **Acesse a aplicação no navegador**

3. **Teste o fluxo completo:**
   - Registre uma nova conta
   - Faça login
   - Crie um projeto
   - Crie tarefas
   - Mude o status das tarefas
   - Faça logout

## 🚀 Build para Produção

```bash
npm run build
# ou
pnpm build
```

Os arquivos compilados estarão em `dist/`.

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL da API do backend | `http://localhost:3000/api` |
| `VITE_APP_TITLE` | Título da aplicação | `Dev Planner` |
| `VITE_APP_LOGO` | URL do logo | `/logo.svg` |

## 🐛 Troubleshooting

### "Erro ao conectar com o backend"

- Verifique se o backend está rodando
- Verifique se a URL da API está correta no `.env`
- Verifique se o CORS está configurado no backend

### "Sessão expirada"

- O refresh token pode ter expirado
- Faça login novamente

### "Erro 404 em rotas"

- Verifique se a rota está definida em `App.tsx`
- Verifique se o componente da página existe

## 📚 Documentação Adicional

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como parte do projeto **Dev Planner**.

---

**Pronto para começar?** Siga os passos em "Como Começar" acima! 🚀
