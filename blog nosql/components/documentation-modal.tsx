"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Database, MessageCircle, Download, Plus, Eye, Code, Zap, Shield, Palette } from "lucide-react"

interface DocumentationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6 text-primary" />
            Documentação do Blog NoSQL
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="pb-6 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Visão Geral
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sistema de blog moderno construído com Next.js e tecnologia NoSQL, oferecendo funcionalidades CRUD
                completas, comentários aninhados e exportação de dados.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Badge variant="secondary" className="justify-center py-2">
                  <Database className="w-3 h-3 mr-1" />
                  NoSQL
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Comentários
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  <Download className="w-3 h-3 mr-1" />
                  Exportação
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  <Palette className="w-3 h-3 mr-1" />
                  Responsivo
                </Badge>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-accent" />
                Funcionalidades Principais
              </h2>
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    Operações CRUD Completas
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • <strong>Create</strong>: Criar novos posts com título, conteúdo e autor
                    </li>
                    <li>
                      • <strong>Read</strong>: Visualizar posts em grid responsivo
                    </li>
                    <li>
                      • <strong>Update</strong>: Editar posts existentes
                    </li>
                    <li>
                      • <strong>Delete</strong>: Remover posts com confirmação
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    Sistema de Comentários Aninhados
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comentários hierárquicos com até 3 níveis</li>
                    <li>• Respostas aninhadas com indentação visual</li>
                    <li>• Formulários dinâmicos para comentários</li>
                    <li>• Contagem automática de comentários</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    Exportação de Dados
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Formato JSON com estrutura completa</li>
                    <li>• Formato CSV para planilhas</li>
                    <li>• Opções configuráveis de exportação</li>
                    <li>• Estatísticas detalhadas do blog</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* NoSQL Architecture */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-accent" />
                Arquitetura NoSQL
              </h2>
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">Estrutura de Dados</h3>
                <pre className="text-xs bg-background rounded p-3 overflow-x-auto">
                  {`interface BlogPost {
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
  replies: Comment[] // Aninhados
}`}
                </pre>
              </div>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Flexibilidade</strong>
                    <p className="text-xs text-muted-foreground">Estrutura de dados dinâmica e adaptável</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Relacionamentos Embutidos</strong>
                    <p className="text-xs text-muted-foreground">Comentários armazenados dentro dos posts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <strong className="text-sm">Performance</strong>
                    <p className="text-xs text-muted-foreground">Menos consultas, dados co-localizados</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                Como Usar
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-sm">Criando Posts</h3>
                  <ol className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>1. Clique no botão "Criar Post" na homepage</li>
                    <li>2. Preencha título, conteúdo e autor</li>
                    <li>3. Clique em "Criar Post" para publicar</li>
                  </ol>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-sm">Adicionando Comentários</h3>
                  <ol className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>1. Abra um post clicando em "Ver detalhes"</li>
                    <li>2. Clique em "Adicionar Comentário"</li>
                    <li>3. Para responder, clique em "Responder"</li>
                    <li>4. Suporte a até 3 níveis de profundidade</li>
                  </ol>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-sm">Exportando Dados</h3>
                  <ol className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>1. Clique no botão "Exportar Dados"</li>
                    <li>2. Escolha formato (JSON ou CSV)</li>
                    <li>3. Configure opções de exportação</li>
                    <li>4. Baixe o arquivo gerado</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Tecnologias</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "Radix UI", "Lucide React"].map((tech) => (
                  <Badge key={tech} variant="outline" className="justify-center py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t border-border">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Fechar Documentação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
