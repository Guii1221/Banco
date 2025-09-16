"use client"

import { useBlog } from "@/hooks/use-blog"
import { BlogHeader } from "@/components/blog-header"
import { PostCard } from "@/components/post-card"
import { CreatePostModal } from "@/components/create-post-modal"
import { ExportDataButton } from "@/components/export-data-button"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LogIn } from "lucide-react"

export default function HomePage() {
  const { posts, loading } = useBlog()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        </main>
      </div>
    )
  }

  const handleCreatePost = () => {
    if (isAuthenticated) {
      setIsCreateModalOpen(true)
    } else {
      setIsAuthModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Blog NoSQL</h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Um sistema de blog moderno construído com tecnologia NoSQL. Crie posts, adicione comentários aninhados e
            exporte seus dados facilmente.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={handleCreatePost} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isAuthenticated ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Post
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar para Criar Post
                </>
              )}
            </Button>
            <ExportDataButton />
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground mt-4">Faça login para criar posts e comentários</p>
          )}
        </section>

        {/* Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Posts Recentes</h2>
            <div className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">Nenhum post encontrado</div>
              <Button onClick={handleCreatePost} variant="outline">
                {isAuthenticated ? "Criar seu primeiro post" : "Entrar para criar posts"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          )}
        </section>
      </main>

      {isAuthenticated && <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
