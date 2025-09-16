"use client"

import type React from "react"

import { useState } from "react"
import { useBlog } from "@/hooks/use-blog"
import type { Comment } from "@/lib/blog-storage"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CommentItem } from "./comment-item"
import { MessageCircle, Send } from "lucide-react"

interface CommentsSectionProps {
  postId: string
  comments: Comment[]
}

export function CommentsSection({ postId, comments }: CommentsSectionProps) {
  const { addComment } = useBlog()
  const { toast } = useToast()
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newComment, setNewComment] = useState({
    content: "",
    author: "",
  })

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.content.trim() || !newComment.author.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    try {
      const comment = addComment(postId, newComment.content.trim(), newComment.author.trim())

      if (comment) {
        toast({
          title: "Comentário adicionado!",
          description: "Seu comentário foi publicado com sucesso.",
        })
        setNewComment({ content: "", author: "" })
        setIsAddingComment(false)
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível publicar o comentário. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comentários ({comments.length})
        </h3>

        {!isAddingComment && (
          <Button
            onClick={() => setIsAddingComment(true)}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Adicionar Comentário
          </Button>
        )}
      </div>

      {/* Add Comment Form */}
      {isAddingComment && (
        <form onSubmit={handleSubmitComment} className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comment-author" className="text-sm font-medium">
                Seu nome
              </Label>
              <Input
                id="comment-author"
                placeholder="Digite seu nome"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment-content" className="text-sm font-medium">
              Comentário
            </Label>
            <Textarea
              id="comment-content"
              placeholder="Escreva seu comentário..."
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingComment(false)
                setNewComment({ content: "", author: "" })
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum comentário ainda.</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} postId={postId} level={0} />)
        )}
      </div>
    </div>
  )
}
