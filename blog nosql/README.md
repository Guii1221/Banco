# Blog NoSQL - Sistema de Blog Moderno

Um sistema de blog completo construído com Next.js e tecnologia NoSQL, oferecendo funcionalidades CRUD completas, comentários aninhados e exportação de dados.

## 🚀 Funcionalidades

### ✅ Operações CRUD Completas
- **Create**: Criar novos posts com título, conteúdo e autor
- **Read**: Visualizar posts em grid responsivo com preview
- **Update**: Editar posts existentes com modal dedicado
- **Delete**: Remover posts com confirmação de segurança

### 💬 Sistema de Comentários Aninhados
- Comentários hierárquicos com até 3 níveis de profundidade
- Respostas aninhadas com indentação visual
- Formulários dinâmicos para adicionar comentários e respostas
- Contagem automática de comentários por post

### 📊 Exportação de Dados
- **Formato JSON**: Estrutura completa com dados aninhados
- **Formato CSV**: Dados tabulares para planilhas
- Opções configuráveis:
  - Incluir/excluir comentários
  - Incluir/excluir metadados (datas)
- Estatísticas do blog (posts, comentários, autores)

### 🎨 Interface Moderna
- Design responsivo com Tailwind CSS
- Tema claro/escuro automático
- Componentes acessíveis com shadcn/ui
- Animações suaves e feedback visual
- Modal system para ações complexas

## 🏗️ Arquitetura NoSQL

### Estrutura de Dados
O sistema utiliza uma abordagem NoSQL baseada em documentos JSON armazenados no localStorage, simulando um banco de documentos como MongoDB ou Firestore.

\`\`\`typescript
interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  replies: Comment[] // Comentários aninhados
}
\`\`\`

### Vantagens da Abordagem NoSQL
- **Flexibilidade**: Estrutura de dados dinâmica
- **Comentários Embutidos**: Relacionamento natural entre posts e comentários
- **Escalabilidade**: Fácil adição de novos campos
- **Performance**: Menos consultas necessárias

## 🛠️ Tecnologias Utilizadas

- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI acessíveis
- **Radix UI**: Primitivos de interface
- **Lucide React**: Ícones modernos
- **LocalStorage**: Simulação de banco NoSQL

## 📁 Estrutura do Projeto

\`\`\`
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Homepage do blog
│   └── globals.css         # Estilos globais
├── components/
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── blog-header.tsx     # Cabeçalho do blog
│   ├── post-card.tsx       # Card de post
│   ├── create-post-modal.tsx # Modal de criação
│   ├── edit-post-modal.tsx   # Modal de edição
│   ├── post-detail-modal.tsx # Modal de detalhes
│   ├── comments-section.tsx  # Seção de comentários
│   ├── comment-item.tsx      # Item de comentário
│   ├── export-data-modal.tsx # Modal de exportação
│   └── export-data-button.tsx # Botão de exportação
├── lib/
│   ├── blog-storage.ts     # Lógica de armazenamento NoSQL
│   └── utils.ts            # Utilitários
└── hooks/
    └── use-blog.ts         # Hook personalizado para blog
\`\`\`

## 🎯 Como Usar

### Criando Posts
1. Clique no botão "Criar Post" na homepage
2. Preencha título, conteúdo e autor
3. Clique em "Criar Post" para publicar

### Gerenciando Posts
- **Visualizar**: Clique em "Ver detalhes" no menu do post
- **Editar**: Clique em "Editar" no menu do post
- **Deletar**: Clique em "Deletar" (com confirmação)

### Comentários
1. Abra um post em detalhes
2. Clique em "Adicionar Comentário"
3. Para responder, clique em "Responder" em qualquer comentário
4. Comentários podem ter até 3 níveis de profundidade

### Exportação de Dados
1. Clique no botão "Exportar Dados"
2. Escolha o formato (JSON ou CSV)
3. Configure as opções de exportação
4. Clique em "Exportar Dados" para baixar

## 🔧 Funcionalidades Técnicas

### Armazenamento NoSQL
- Dados persistidos no localStorage
- Estrutura de documentos JSON
- Relacionamentos embutidos (comentários dentro de posts)
- IDs únicos gerados automaticamente

### Validação e Segurança
- Validação de formulários em tempo real
- Sanitização de dados de entrada
- Confirmações para ações destrutivas
- Tratamento de erros com feedback visual

### Performance
- Componentes React otimizados
- Lazy loading de modais
- Debounce em formulários
- Memoização de cálculos pesados

### Acessibilidade
- Navegação por teclado
- Labels semânticos
- Contraste adequado
- Screen reader friendly
- Focus management

## 📊 Estatísticas do Sistema

O sistema rastreia automaticamente:
- Número total de posts
- Número total de comentários (incluindo respostas)
- Número de autores únicos
- Datas de criação e atualização

## 🚀 Próximos Passos

### Melhorias Sugeridas
- [ ] Busca e filtros avançados
- [ ] Sistema de tags/categorias
- [ ] Paginação para muitos posts
- [ ] Editor de texto rico (WYSIWYG)
- [ ] Sistema de usuários com autenticação
- [ ] Moderação de comentários
- [ ] Notificações em tempo real
- [ ] API REST para integração externa

### Integração com Banco Real
Para usar com banco NoSQL real:
1. **MongoDB**: Substituir localStorage por MongoDB client
2. **Firestore**: Usar Firebase SDK
3. **Supabase**: Integrar com Supabase client
4. **DynamoDB**: Usar AWS SDK

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests
- Compartilhar feedback

---

**Desenvolvido com ❤️ usando Next.js e tecnologia NoSQL**
