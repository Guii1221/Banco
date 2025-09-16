export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  authorId: string // Added authorId field
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  author: string
  authorId: string // Added authorId field
  createdAt: string
  replies: Comment[]
}

class BlogStorage {
  private readonly POSTS_KEY = "nosql_blog_posts"
  private readonly AUTHORS_KEY = "nosql_blog_authors"

  // Create
  createPost(title: string, content: string, authorId: string, authorName: string): BlogPost {
    const posts = this.getAllPosts()
    const newPost: BlogPost = {
      id: this.generateId(),
      title,
      content,
      author: authorName, // Keep author name for display
      authorId, // Added authorId field
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    }

    posts.push(newPost)
    this.savePosts(posts)
    return newPost
  }

  // Read
  getAllPosts(): BlogPost[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.POSTS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  getPostById(id: string): BlogPost | null {
    const posts = this.getAllPosts()
    return posts.find((post) => post.id === id) || null
  }

  // Update
  updatePost(id: string, updates: Partial<Pick<BlogPost, "title" | "content">>, userId?: string): BlogPost | null {
    const posts = this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === id)

    if (postIndex === -1) return null

    if (userId && posts[postIndex].authorId !== userId) {
      return null // User doesn't own this post
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.savePosts(posts)
    return posts[postIndex]
  }

  // Delete
  deletePost(id: string, userId?: string): boolean {
    const posts = this.getAllPosts()
    const postToDelete = posts.find((post) => post.id === id)

    if (!postToDelete) return false

    if (userId && postToDelete.authorId !== userId) {
      return false // User doesn't own this post
    }

    const filteredPosts = posts.filter((post) => post.id !== id)
    this.savePosts(filteredPosts)
    return true
  }

  // Comments CRUD
  addComment(
    postId: string,
    content: string,
    authorId: string,
    authorName: string,
    parentCommentId?: string,
  ): Comment | null {
    const posts = this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === postId)

    if (postIndex === -1) return null

    const newComment: Comment = {
      id: this.generateId(),
      content,
      author: authorName, // Keep author name for display
      authorId, // Added authorId field
      createdAt: new Date().toISOString(),
      replies: [],
    }

    if (parentCommentId) {
      // Add as nested reply
      const addReply = (comments: Comment[]): boolean => {
        for (const comment of comments) {
          if (comment.id === parentCommentId) {
            comment.replies.push(newComment)
            return true
          }
          if (addReply(comment.replies)) return true
        }
        return false
      }

      if (!addReply(posts[postIndex].comments)) return null
    } else {
      // Add as top-level comment
      posts[postIndex].comments.push(newComment)
    }

    posts[postIndex].updatedAt = new Date().toISOString()
    this.savePosts(posts)
    return newComment
  }

  deleteComment(postId: string, commentId: string, userId?: string): boolean {
    const posts = this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === postId)

    if (postIndex === -1) return false

    const removeComment = (comments: Comment[]): boolean => {
      const index = comments.findIndex((comment) => comment.id === commentId)
      if (index !== -1) {
        if (userId && comments[index].authorId !== userId) {
          return false // User doesn't own this comment
        }
        comments.splice(index, 1)
        return true
      }

      for (const comment of comments) {
        if (removeComment(comment.replies)) return true
      }
      return false
    }

    const removed = removeComment(posts[postIndex].comments)
    if (removed) {
      posts[postIndex].updatedAt = new Date().toISOString()
      this.savePosts(posts)
    }

    return removed
  }

  // Export functionality
  exportData(): string {
    const posts = this.getAllPosts()
    return JSON.stringify(
      {
        posts,
        exportedAt: new Date().toISOString(),
        totalPosts: posts.length,
        totalComments: posts.reduce((acc, post) => acc + this.countComments(post.comments), 0),
      },
      null,
      2,
    )
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private savePosts(posts: BlogPost[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts))
    }
  }

  private countComments(comments: Comment[]): number {
    return comments.reduce((acc, comment) => acc + 1 + this.countComments(comment.replies), 0)
  }

  // Initialize with sample data
  initializeSampleData(): void {
    const existingPosts = this.getAllPosts()
    if (existingPosts.length > 0) return

    const samplePosts: BlogPost[] = [
      {
        id: this.generateId(),
        title: "Bem-vindo ao Blog NoSQL",
        content:
          "Este é o primeiro post do nosso blog construído com tecnologia NoSQL. Aqui você pode criar, editar e comentar posts de forma dinâmica.",
        author: "Admin",
        authorId: "admin-id", // Added authorId
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [
          {
            id: this.generateId(),
            content: "Ótimo post! Muito interessante a abordagem NoSQL.",
            author: "João",
            authorId: "joao-id", // Added authorId
            createdAt: new Date().toISOString(),
            replies: [
              {
                id: this.generateId(),
                content: "Concordo! A flexibilidade dos documentos é incrível.",
                author: "Maria",
                authorId: "maria-id", // Added authorId
                createdAt: new Date().toISOString(),
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: this.generateId(),
        title: "Funcionalidades do Sistema",
        content:
          "Este blog possui todas as operações CRUD: Create (criar), Read (ler), Update (atualizar) e Delete (deletar). Além disso, suporta comentários aninhados e exportação de dados.",
        author: "Desenvolvedor",
        authorId: "dev-id", // Added authorId
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      },
    ]

    this.savePosts(samplePosts)
  }
}

export const blogStorage = new BlogStorage()
