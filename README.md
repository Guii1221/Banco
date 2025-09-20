# TodoApp - Gerenciador de Tarefas com NoSQL

Uma aplicação completa de gerenciamento de tarefas desenvolvida com Next.js, TypeScript e armazenamento NoSQL simulado via localStorage. Este projeto demonstra operações CRUD completas, autenticação de usuários, exportação de dados e interface moderna.

## 📋 Funcionalidades

### ✅ Operações CRUD Completas
- **Create**: Criar novas tarefas com título, descrição, prioridade e data de vencimento
- **Read**: Visualizar e filtrar tarefas por status, prioridade e busca textual
- **Update**: Editar tarefas existentes e marcar como concluídas
- **Delete**: Remover tarefas permanentemente

### 🔐 Sistema de Autenticação
- Cadastro de novos usuários
- Login com email e senha
- Sessão persistente via localStorage
- Logout seguro

### 📊 Dashboard e Estatísticas
- Cards com estatísticas em tempo real
- Contadores de tarefas totais, concluídas e pendentes
- Distribuição por prioridade
- Taxa de conclusão

### 🔍 Filtros e Busca
- Busca textual por título e descrição
- Filtros por status (todas, pendentes, concluídas)
- Filtros por prioridade (alta, média, baixa)
- Ordenação por data, prioridade ou título

### 📤 Exportação de Dados
- **JSON**: Dados estruturados com metadados
- **CSV**: Formato de planilha para análise
- **Relatório**: Texto formatado com estatísticas detalhadas
- Filtros personalizáveis para exportação

### 🎨 Interface Moderna
- Design responsivo para desktop e mobile
- Tema claro/escuro automático
- Componentes acessíveis com shadcn/ui
- Animações suaves e feedback visual

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **shadcn/ui**: Componentes de interface
- **Lucide React**: Ícones modernos

### Armazenamento
- **localStorage**: Simulação de banco NoSQL
- Estrutura de dados otimizada para operações CRUD
- Persistência local dos dados

### Ferramentas de Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **TypeScript**: Verificação de tipos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn como gerenciador de pacotes

### Instalação

1. **Clone o repositório**
\`\`\`bash
git clone <url-do-repositorio>
cd todo-app-nosql
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. **Execute o projeto em desenvolvimento**
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Build para Produção

\`\`\`bash
# Gerar build otimizado
npm run build

# Executar versão de produção
npm start
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
todo-app-nosql/
├── app/                          # App Router do Next.js
│   ├── globals.css              # Estilos globais e tokens de design
│   ├── layout.tsx               # Layout principal com providers
│   └── page.tsx                 # Página inicial (roteamento condicional)
├── components/                   # Componentes React
│   ├── auth/                    # Componentes de autenticação
│   │   ├── auth-page.tsx        # Página de login/cadastro
│   │   ├── login-form.tsx       # Formulário de login
│   │   └── register-form.tsx    # Formulário de cadastro
│   ├── dashboard/               # Componentes do dashboard
│   │   ├── dashboard.tsx        # Dashboard principal
│   │   ├── export-dialog.tsx    # Dialog de exportação
│   │   └── stats-cards.tsx      # Cards de estatísticas
│   ├── layout/                  # Componentes de layout
│   │   └── header.tsx           # Cabeçalho da aplicação
│   ├── todos/                   # Componentes de tarefas
│   │   ├── todo-filters.tsx     # Filtros e busca
│   │   ├── todo-form.tsx        # Formulário de nova tarefa
│   │   ├── todo-item.tsx        # Item individual de tarefa
│   │   └── todo-list.tsx        # Lista de tarefas
│   └── ui/                      # Componentes base (shadcn/ui)
├── hooks/                       # Custom hooks
│   ├── use-auth.ts             # Hook de autenticação
│   └── use-todos.ts            # Hook de gerenciamento de tarefas
├── lib/                        # Utilitários e serviços
│   ├── auth.ts                 # Serviço de autenticação
│   ├── todo-service.ts         # Serviço de tarefas (CRUD)
│   └── utils.ts                # Utilitários gerais
└── README.md                   # Documentação do projeto
\`\`\`

## 🗄️ Modelagem de Dados NoSQL

### Estrutura do Usuário
\`\`\`typescript
interface User {
  id: string              // Identificador único
  email: string           // Email do usuário
  name: string            // Nome completo
  createdAt: string       // Data de criação (ISO)
}
\`\`\`

### Estrutura da Tarefa
\`\`\`typescript
interface Todo {
  id: string              // Identificador único
  userId: string          // ID do usuário proprietário
  title: string           // Título da tarefa
  description?: string    // Descrição opcional
  completed: boolean      // Status de conclusão
  priority: "low" | "medium" | "high"  // Prioridade
  dueDate?: string        // Data de vencimento (ISO)
  createdAt: string       // Data de criação (ISO)
  updatedAt: string       // Data de atualização (ISO)
}
\`\`\`

### Justificativa da Modelagem NoSQL

**Por que NoSQL (localStorage)?**
1. **Flexibilidade de Schema**: Permite adicionar campos sem migração
2. **Estrutura de Documentos**: Cada tarefa é um documento independente
3. **Relacionamento Simples**: Apenas User → Todos (1:N)
4. **Performance**: Acesso direto por chave (userId)
5. **Escalabilidade**: Fácil migração para MongoDB/Redis

**Organização dos Dados:**
- **Chave de Autenticação**: `todo-auth-user`
- **Chave de Tarefas**: `todo-app-todos`
- **Estrutura**: Array de documentos JSON
- **Indexação**: Por userId para filtragem eficiente

## 🔧 Configuração e Personalização

### Tokens de Design
Os tokens de design estão centralizados em `app/globals.css`:

\`\`\`css
:root {
  --primary: #be123c;        /* Cor primária (rose-600) */
  --secondary: #ec4899;      /* Cor secundária (pink) */
  --background: #ffffff;     /* Fundo principal */
  --foreground: #475569;     /* Texto principal */
  /* ... outros tokens */
}
\`\`\`

### Adicionando Novos Campos
Para adicionar campos às tarefas:

1. **Atualize a interface** em `lib/todo-service.ts`
2. **Modifique o formulário** em `components/todos/todo-form.tsx`
3. **Ajuste a visualização** em `components/todos/todo-item.tsx`
4. **Atualize a exportação** em `components/dashboard/export-dialog.tsx`

### Migração para MongoDB
Para migrar para MongoDB real:

1. **Instale o driver**: `npm install mongodb`
2. **Configure a conexão** em `lib/mongo.ts`
3. **Substitua os métodos** em `lib/todo-service.ts`
4. **Adicione variáveis de ambiente** para connection string

## 📊 Funcionalidades de Exportação

### Formatos Disponíveis

1. **JSON Estruturado**
   - Dados completos com metadados
   - Estatísticas incluídas
   - Formato ideal para backup

2. **CSV para Planilhas**
   - Compatível com Excel/Google Sheets
   - Headers em português
   - Dados formatados para análise

3. **Relatório Textual**
   - Resumo executivo
   - Estatísticas detalhadas
   - Lista de tarefas vencidas
   - Próximas tarefas (7 dias)

### Filtros de Exportação
- Incluir/excluir tarefas concluídas
- Incluir/excluir tarefas pendentes
- Contador dinâmico de itens

## 🎯 Casos de Uso

### Para Estudantes
- Gerenciar trabalhos e projetos
- Controlar prazos de entrega
- Organizar estudos por prioridade
- Exportar relatórios de produtividade

### Para Profissionais
- Acompanhar tarefas do trabalho
- Definir prioridades claras
- Gerar relatórios para gestores
- Backup de dados importantes

### Para Desenvolvedores
- Exemplo de CRUD completo
- Padrões de React/Next.js
- Integração com localStorage
- Base para migração NoSQL

## 🔒 Segurança e Boas Práticas

### Autenticação
- Validação de entrada nos formulários
- Sanitização de dados do usuário
- Sessão isolada por usuário
- Logout seguro com limpeza

### Dados
- Validação de tipos com TypeScript
- Tratamento de erros consistente
- Backup automático via exportação
- Isolamento de dados por usuário

### Interface
- Componentes acessíveis (ARIA)
- Feedback visual para ações
- Estados de loading
- Tratamento de erros na UI

## 🚀 Deploy e Produção

### Vercel (Recomendado)
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Outras Plataformas
- **Netlify**: Build command: `npm run build`
- **Railway**: Suporte nativo ao Next.js
- **Heroku**: Adicionar `package.json` scripts

### Variáveis de Ambiente
Para produção, configure:
\`\`\`env
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
NODE_ENV=production
\`\`\`

## 📈 Próximos Passos

### Melhorias Sugeridas
1. **Integração Real com MongoDB**
   - Connection string configurável
   - Operações assíncronas otimizadas
   - Indexação para performance

2. **Funcionalidades Avançadas**
   - Colaboração entre usuários
   - Notificações de vencimento
   - Categorias personalizadas
   - Anexos de arquivos

3. **Performance**
   - Paginação de tarefas
   - Cache inteligente
   - Lazy loading de componentes
   - Service Worker para offline

4. **Analytics**
   - Métricas de produtividade
   - Gráficos de progresso
   - Relatórios temporais
   - Insights de uso

## 🤝 Contribuição

Este projeto foi desenvolvido como exemplo educacional. Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico para demonstrar:
- Operações CRUD com NoSQL
- Autenticação de usuários
- Interface moderna e responsiva
- Exportação de dados
- Boas práticas de desenvolvimento

---

**TodoApp** - Organize suas tarefas com eficiência! 🚀
\`\`\`

```json file="" isHidden
