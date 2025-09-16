"use client"

import { useState } from "react"
import { useBlog } from "@/hooks/use-blog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Download, FileJson, FileText, Database, Calendar, MessageCircle, User } from "lucide-react"

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const { posts, exportData } = useBlog()
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")
  const [includeComments, setIncludeComments] = useState(true)
  const [includeMetadata, setIncludeMetadata] = useState(true)

  const totalComments = posts.reduce((acc, post) => {
    const countComments = (comments: any[]): number => {
      return comments.reduce((count, comment) => count + 1 + countComments(comment.replies || []), 0)
    }
    return acc + countComments(post.comments)
  }, 0)

  const handleExport = () => {
    try {
      let data: string
      let filename: string
      let mimeType: string

      if (exportFormat === "json") {
        const exportedData = JSON.parse(exportData())

        // Filter data based on options
        const filteredPosts = exportedData.posts.map((post: any) => {
          const filteredPost = { ...post }

          if (!includeComments) {
            delete filteredPost.comments
          }

          if (!includeMetadata) {
            delete filteredPost.createdAt
            delete filteredPost.updatedAt
          }

          return filteredPost
        })

        const finalData = {
          ...exportedData,
          posts: filteredPosts,
          exportOptions: {
            format: exportFormat,
            includeComments,
            includeMetadata,
          },
        }

        data = JSON.stringify(finalData, null, 2)
        filename = `blog-export-${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
      } else {
        // CSV Export
        const csvRows = ["Título,Autor,Conteúdo,Data de Criação,Comentários"]

        posts.forEach((post) => {
          const commentsCount = includeComments
            ? post.comments.reduce((acc, comment) => {
                const countReplies = (replies: any[]): number => {
                  return replies.reduce((count, reply) => count + 1 + countReplies(reply.replies || []), 0)
                }
                return acc + 1 + countReplies(comment.replies)
              }, 0)
            : 0

          const row = [
            `"${post.title.replace(/"/g, '""')}"`,
            `"${post.author.replace(/"/g, '""')}"`,
            `"${post.content.replace(/"/g, '""').substring(0, 100)}..."`,
            includeMetadata ? new Date(post.createdAt).toLocaleDateString("pt-BR") : "N/A",
            includeComments ? commentsCount.toString() : "N/A",
          ]
          csvRows.push(row.join(","))
        })

        data = csvRows.join("\n")
        filename = `blog-export-${new Date().toISOString().split("T")[0]}.csv`
        mimeType = "text/csv"
      }

      // Create and download file
      const blob = new Blob([data], { type: mimeType })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Dados exportados com sucesso!",
        description: `Arquivo ${filename} foi baixado.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dados do Blog
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{posts.length}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalComments}</div>
              <div className="text-xs text-muted-foreground">Comentários</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{new Set(posts.map((p) => p.author)).size}</div>
              <div className="text-xs text-muted-foreground">Autores</div>
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formato de Exportação</Label>
            <RadioGroup value={exportFormat} onValueChange={(value: "json" | "csv") => setExportFormat(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="w-4 h-4" />
                  JSON (Estrutura completa)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <Database className="w-4 h-4" />
                  CSV (Planilha)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Opções de Exportação</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-comments"
                  checked={includeComments}
                  onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                />
                <Label htmlFor="include-comments" className="flex items-center gap-2 cursor-pointer text-sm">
                  <MessageCircle className="w-4 h-4" />
                  Incluir comentários e respostas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                />
                <Label htmlFor="include-metadata" className="flex items-center gap-2 cursor-pointer text-sm">
                  <Calendar className="w-4 h-4" />
                  Incluir datas de criação e atualização
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-muted/20 rounded-lg border">
            <div className="text-xs text-muted-foreground mb-2">Preview do arquivo:</div>
            <div className="text-sm font-mono text-foreground">
              blog-export-{new Date().toISOString().split("T")[0]}.{exportFormat}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {exportFormat === "json"
                ? "Estrutura JSON completa com dados aninhados"
                : "Planilha CSV com dados tabulares"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={posts.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
