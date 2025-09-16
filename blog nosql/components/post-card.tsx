"use client"

import { useState } from "react"
import type { BlogPost } from "@/lib/blog-storage"
import { useBlog } from "@/hooks/use-blog"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { MoreVertical, MessageCircle, Edit, Trash2, Calendar, User, Eye } from "lucide-react"
import { EditPostModal } from "./edit-post-modal"
import { PostDetailModal } from "./post-detail-modal"

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost } = useBlog()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    deletePost(post.id)
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

  const getContentPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const totalComments = (comments: any[]): number => {
    return comments.reduce((acc, comment) => acc + 1 + totalComments(comment.replies || []), 0)
  }

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 text-balance">{post.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDetailModalOpen(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{getContentPreview(post.content)}</p>

          {post.content.length > 150 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto mt-2 text-primary"
              onClick={() => setIsDetailModalOpen(true)}
            >
              Ler mais
            </Button>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-border">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {totalComments(post.comments) > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {totalComments(post.comments)}
                </Badge>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>

      <EditPostModal post={post} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <PostDetailModal post={post} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o post "{post.title}"? Esta ação não pode ser desfeita e todos os
              comentários serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
