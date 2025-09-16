export interface User {
  id: string
  username: string
  email: string
  password: string // In a real app, this would be hashed
  createdAt: string
  avatar?: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

class AuthStorage {
  private readonly USERS_KEY = "nosql_blog_users"
  private readonly SESSION_KEY = "nosql_blog_session"

  // Register new user
  register(username: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getAllUsers()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email já está em uso" }
    }

    if (users.find((u) => u.username === username)) {
      return { success: false, error: "Nome de usuário já está em uso" }
    }

    const newUser: User = {
      id: this.generateId(),
      username,
      email,
      password, // In production, hash this!
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)

    return { success: true, user: newUser }
  }

  // Login user
  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getAllUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return { success: false, error: "Email ou senha incorretos" }
    }

    // Create session
    const session: AuthSession = {
      user,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    this.saveSession(session)
    return { success: true, user }
  }

  // Logout user
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem(this.SESSION_KEY)
    if (!stored) return null

    const session: AuthSession = JSON.parse(stored)

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      this.logout()
      return null
    }

    return session
  }

  // Get current user
  getCurrentUser(): User | null {
    const session = this.getCurrentSession()
    return session?.user || null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  // Private methods
  private getAllUsers(): User[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.USERS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveUsers(users: User[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    }
  }

  private saveSession(session: AuthSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36)
  }

  // Initialize with sample users
  initializeSampleUsers(): void {
    const existingUsers = this.getAllUsers()
    if (existingUsers.length > 0) return

    const sampleUsers: User[] = [
      {
        id: this.generateId(),
        username: "admin",
        email: "admin@blog.com",
        password: "admin123",
        createdAt: new Date().toISOString(),
      },
      {
        id: this.generateId(),
        username: "joao",
        email: "joao@email.com",
        password: "123456",
        createdAt: new Date().toISOString(),
      },
    ]

    this.saveUsers(sampleUsers)
  }
}

export const authStorage = new AuthStorage()
