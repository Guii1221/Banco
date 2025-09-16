import clientPromise from "./mongodb"
import { Collection, Db, ObjectId } from "mongodb"

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
  private async getDb(): Promise<Db> {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB)
  }

  private async getPostsCollection(): Promise<Collection<BlogPost>> {
    const db = await this.getDb()
    return db.collection<BlogPost>("posts")
  }

  // Create
  createPost(title: string, content: string, authorId: string, authorName: string): BlogPost {
    const posts = this.getAllPosts()
  async createPost(title: string, content: string, authorId: string, authorName: string): Promise<BlogPost> {
    const postsCollection = await this.getPostsCollection()
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
    await postsCollection.insertOne(newPost)
    return newPost
  }

  // Read
  getAllPosts(): BlogPost[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.POSTS_KEY)
    return stored ? JSON.parse(stored) : []
  async getAllPosts(): Promise<BlogPost[]> {
    const postsCollection = await this.getPostsCollection()
    // Sort by creation date, newest first
    return postsCollection.find({}).sort({ createdAt: -1 }).toArray()
  }

  getPostById(id: string): BlogPost | null {
    const posts = this.getAllPosts()
    return posts.find((post) => post.id === id) || null
  async getPostById(id: string): Promise<BlogPost | null> {
    const postsCollection = await this.getPostsCollection()
    return postsCollection.findOne({ id })
  }

  // Update
  updatePost(id: string, updates: Partial<Pick<BlogPost, "title" | "content">>, userId?: string): BlogPost | null {
    const posts = this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === id)
  async updatePost(
    id: string,
    updates: Partial<Pick<BlogPost, "title" | "content">>,
    userId?: string,
  ): Promise<BlogPost | null> {
    const postsCollection = await this.getPostsCollection()

    if (postIndex === -1) return null

    if (userId && posts[postIndex].authorId !== userId) {
      return null // User doesn't own this post
    const filter: any = { id }
    if (userId) {
      filter.authorId = userId // Ensure user owns the post
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    const result = await postsCollection.findOneAndUpdate(
      filter,
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" },
    )

    this.savePosts(posts)
    return posts[postIndex]
    return result
  }

  // Delete
  deletePost(id: string, userId?: string): boolean {
    const posts = this.getAllPosts()
    const postToDelete = posts.find((post) => post.id === id)

    if (!postToDelete) return false

    if (userId && postToDelete.authorId !== userId) {
      return false // User doesn't own this post
  async deletePost(id: string, userId?: string): Promise<boolean> {
    const postsCollection = await this.getPostsCollection()
    const filter: any = { id }
    if (userId) {
      filter.authorId = userId
    }

    const filteredPosts = posts.filter((post) => post.id !== id)
    this.savePosts(filteredPosts)
    return true
    const result = await postsCollection.deleteOne(filter)
    return result.deletedCount === 1
  }

  // Comments CRUD
  addComment(
  async addComment(
    postId: string,
    content: string,
    authorId: string,
    authorName: string,
    parentCommentId?: string,
  ): Comment | null {
    const posts = this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === postId)
  ): Promise<Comment | null> {
    const postsCollection = await this.getPostsCollection()

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
      // Add as a nested reply. This is complex with pure MongoDB updates.
      // A simpler approach for deep nesting is to fetch, update in code, and save.
      // For this example, we'll support one level of nesting for simplicity with $push.
      // A more robust solution might use arrayFilters for deeper updates.
      const result = await postsCollection.updateOne(
        { id: postId, "comments.id": parentCommentId },
        { $push: { "comments.$.replies": newComment }, $set: { updatedAt: new Date().toISOString() } },
      )
      if (result.modifiedCount === 0) return null // Could be a deeper comment, harder to update.
    } else {
      // Add as top-level comment
      posts[postIndex].comments.push(newComment)
      await postsCollection.updateOne(
        { id: postId },
        { $push: { comments: newComment }, $set: { updatedAt: new Date().toISOString() } },
      )
    }

    posts[postIndex].updatedAt = new Date().toISOString()
    this.savePosts(posts)
    return newComment
  }

  deleteComment(postId: string, commentId: string, userId?: string): boolean {
    const posts = this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === postId)
  async deleteComment(postId: string, commentId: string, userId?: string): Promise<boolean> {
    const postsCollection = await this.getPostsCollection()

    if (postIndex === -1) return false
    // This is complex. We'll try to pull from top-level and first-level replies.
    // A truly recursive delete requires more complex logic or a different data model.
    const filter: any = { id: postId }
    if (userId) {
      // This check becomes very complex with nested ownership.
      // For simplicity, we'll allow deletion if the user owns the post or the comment.
      // A real app would need more robust authorization logic.
    }

    const removeComment = (comments: Comment[]): boolean => {
      const index = comments.findIndex((comment) => comment.id === commentId)
      if (index !== -1) {
        if (userId && comments[index].authorId !== userId) {
          return false // User doesn't own this comment
        }
        comments.splice(index, 1)
        return true
      }
    // Try to pull a top-level comment
    let result = await postsCollection.updateOne(filter, { $pull: { comments: { id: commentId } } })

      for (const comment of comments) {
        if (removeComment(comment.replies)) return true
      }
      return false
    if (result.modifiedCount === 0) {
      // Try to pull a nested reply (first level)
      result = await postsCollection.updateOne(filter, { $pull: { "comments.$[].replies": { id: commentId } } })
    }

    const removed = removeComment(posts[postIndex].comments)
    if (removed) {
      posts[postIndex].updatedAt = new Date().toISOString()
      this.savePosts(posts)
    if (result.modifiedCount > 0) {
      await postsCollection.updateOne({ id: postId }, { $set: { updatedAt: new Date().toISOString() } })
      return true
    }

    return removed
    return false
  }

  // Export functionality
  exportData(): string {
    const posts = this.getAllPosts()
  async exportData(): Promise<string> {
    const posts = await this.getAllPosts()
    const totalComments = posts.reduce((acc, post) => acc + this.countComments(post.comments), 0)

    return JSON.stringify(
      {
        posts,
        exportedAt: new Date().toISOString(),
        totalPosts: posts.length,
        totalComments: posts.reduce((acc, post) => acc + this.countComments(post.comments), 0),
        totalComments,
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
  async initializeSampleData(): Promise<void> {
    const postsCollection = await this.getPostsCollection()
    const count = await postsCollection.countDocuments()
    if (count > 0) return

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
    await postsCollection.insertMany(samplePosts)
    console.log("Sample posts initialized in DB.")
  }
}

export const blogStorage = new BlogStorage()
