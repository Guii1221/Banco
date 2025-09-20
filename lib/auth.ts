export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

class AuthService {
  private storageKey = "todo-auth-user"

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem(this.storageKey)
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation for demo
    if (!email || !password) {
      return { success: false, error: "Email e senha são obrigatórios" }
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter pelo menos 6 caracteres" }
    }

    // Create user object
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(user))

    return { success: true, user }
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!email || !password || !name) {
      return { success: false, error: "Todos os campos são obrigatórios" }
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter pelo menos 6 caracteres" }
    }

    // Create user object
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(user))

    return { success: true, user }
  }

  logout(): void {
    localStorage.removeItem(this.storageKey)
  }
}

export const authService = new AuthService()
