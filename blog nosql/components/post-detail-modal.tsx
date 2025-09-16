"use client"
import type { BlogPost } from "@/lib/blog-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CommentsSection } from "./comments-section"
import { Calendar, User, MessageCircle } from "lucide-react"

interface PostDetailModalProps {
  post: BlogPost
  isOpen: boolean
  onClose: () => void
}

export function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalComments = (comments: any[]): number => {
    return comments.reduce((acc, comment) => acc + 1 + totalComments(comment.replies || []), 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-balance leading-tight">{post.title}</DialogTitle>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </div>
            {totalComments(post.comments) > 0 && (
              <Badge variant="secondary" className="text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                {totalComments(post.comments)} comentários
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="pb-6">
            {/* Post Content */}
            <div className="prose prose-sm max-w-none mb-8">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-pretty">{post.content}</p>
            </div>

            {/* Comments Section */}
            <div className="border-t border-border pt-6">
              <CommentsSection postId={post.id} comments={post.comments} />
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t border-border">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
