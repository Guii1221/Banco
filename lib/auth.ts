export interface User {
  id: string
  email: string
  name: string
  password?: string // A senha só existe no banco, não no cliente
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
    // Simple validation for demo
    if (!email || !password) {
      return { success: false, error: "Email e senha são obrigatórios" }
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter pelo menos 6 caracteres" }
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || "Erro ao fazer login" }
      }

      // Armazena o usuário logado no localStorage para manter a sessão
      localStorage.setItem(this.storageKey, JSON.stringify(data))

      return { success: true, user: data }
    } catch (error) {
      return { success: false, error: "Não foi possível conectar ao servidor." }
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simple validation
    if (!email || !password || !name) {
      return { success: false, error: "Todos os campos são obrigatórios" }
    }

    if (password.length < 6) {
      return { success: false, error: "Senha deve ter pelo menos 6 caracteres" }
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || "Erro ao registrar" }
      }

      // Após o registro, faz o login automaticamente
      return this.login(email, password)
    } catch (error) {
      return { success: false, error: "Não foi possível conectar ao servidor." }
    }
  }

  logout(): void {
    localStorage.removeItem(this.storageKey)
  }
}

export const authService = new AuthService()
