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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Reply, Trash2, User, Calendar, Send } from "lucide-react"

interface CommentItemProps {
  comment: Comment
  postId: string
  level: number
}

export function CommentItem({ comment, postId, level }: CommentItemProps) {
  const { addComment, deleteComment } = useBlog()
  const { toast } = useToast()
  const [isReplying, setIsReplying] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [replyForm, setReplyForm] = useState({
    content: "",
    author: "",
  })

  const maxNestingLevel = 3 // Limit nesting to prevent UI issues

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyForm.content.trim() || !replyForm.author.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    try {
      const reply = addComment(postId, replyForm.content.trim(), replyForm.author.trim(), comment.id)

      if (reply) {
        toast({
          title: "Resposta adicionada!",
          description: "Sua resposta foi publicada com sucesso.",
        })
        setReplyForm({ content: "", author: "" })
        setIsReplying(false)
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar resposta",
        description: "Não foi possível publicar a resposta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = () => {
    const success = deleteComment(postId, comment.id)
    if (success) {
      toast({
        title: "Comentário deletado",
        description: "O comentário foi removido com sucesso.",
      })
    } else {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o comentário.",
        variant: "destructive",
      })
    }
    setIsDeleteDialogOpen(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`${level > 0 ? "ml-6 pl-4 border-l-2 border-border" : ""}`}>
      {/* Comment Content */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="font-medium text-card-foreground">{comment.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(comment.createdAt)}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-card-foreground leading-relaxed mb-3 text-pretty whitespace-pre-wrap">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {level < maxNestingLevel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-8 text-xs text-muted-foreground hover:text-primary"
            >
              <Reply className="w-3 h-3 mr-1" />
              Responder
            </Button>
          )}

          {comment.replies.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {comment.replies.length} {comment.replies.length === 1 ? "resposta" : "respostas"}
            </span>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <form onSubmit={handleSubmitReply} className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`reply-author-${comment.id}`} className="text-xs font-medium">
                Seu nome
              </Label>
              <Input
                id={`reply-author-${comment.id}`}
                placeholder="Digite seu nome"
                value={replyForm.author}
                onChange={(e) => setReplyForm({ ...replyForm, author: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`reply-content-${comment.id}`} className="text-xs font-medium">
              Resposta
            </Label>
            <Textarea
              id={`reply-content-${comment.id}`}
              placeholder="Escreva sua resposta..."
              value={replyForm.content}
              onChange={(e) => setReplyForm({ ...replyForm, content: e.target.value })}
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsReplying(false)
                setReplyForm({ content: "", author: "" })
              }}
              className="h-8 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-3 h-3 mr-1" />
              Responder
            </Button>
          </div>
        </form>
      )}

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} level={level + 1} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Comentário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita e todas as respostas
              também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
