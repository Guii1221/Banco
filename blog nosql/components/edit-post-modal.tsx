"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useBlog } from "@/hooks/use-blog"
import type { BlogPost } from "@/lib/blog-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditPostModalProps {
  post: BlogPost
  isOpen: boolean
  onClose: () => void
}

export function EditPostModal({ post, isOpen, onClose }: EditPostModalProps) {
  const { updatePost } = useBlog()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  // Update form data when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
      })
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    // Check if there are any changes
    if (formData.title.trim() === post.title && formData.content.trim() === post.content) {
      toast({
        title: "Nenhuma alteração",
        description: "Não foram detectadas alterações no post.",
      })
      onClose()
      return
    }

    setIsSubmitting(true)

    try {
      const updatedPost = updatePost(post.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
      })

      if (updatedPost) {
        toast({
          title: "Post atualizado!",
          description: "As alterações foram salvas com sucesso.",
        })
        onClose()
      } else {
        throw new Error("Failed to update post")
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar post",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form to original values
      setFormData({
        title: post.title,
        content: post.content,
      })
      onClose()
    }
  }

  const hasChanges = formData.title !== post.title || formData.content !== post.content

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              Título
            </Label>
            <Input
              id="edit-title"
              placeholder="Digite o título do seu post"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content" className="text-sm font-medium">
              Conteúdo
            </Label>
            <Textarea
              id="edit-content"
              placeholder="Escreva o conteúdo do seu post..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              disabled={isSubmitting}
              className="min-h-[200px] resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">{formData.content.length} caracteres</div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-muted-foreground">
              Autor: {post.author} • Criado em: {new Date(post.createdAt).toLocaleDateString("pt-BR")}
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !hasChanges}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
