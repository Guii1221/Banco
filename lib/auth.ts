export interface User {
  id: string
  email: string
  name: string
  preferences: {
    theme: "light" | "dark"
    language: "pt" | "en"
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const AUTH_STORAGE_KEY = "todo-app-auth"
const USERS_STORAGE_KEY = "todo-app-users"

export function getStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const auth = JSON.parse(stored)
      return auth
    }
  } catch (error) {
    console.error("Error reading auth from storage:", error)
  }

  return { user: null, isAuthenticated: false }
}

export function setStoredAuth(auth: AuthState): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  } catch (error) {
    console.error("Error saving auth to storage:", error)
  }
}

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading users from storage:", error)
  }

  return []
}

export function setStoredUsers(users: User[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Error saving users to storage:", error)
  }
}

export function registerUser(
  email: string,
  password: string,
  name: string,
): { success: boolean; error?: string; user?: User } {
  const users = getStoredUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email já está em uso" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    preferences: {
      theme: "light",
      language: "pt",
    },
  }

  // Store password separately (in real app, this would be hashed)
  const userWithPassword = { ...newUser, password }
  users.push(userWithPassword as any)
  setStoredUsers(users)

  return { success: true, user: newUser }
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getStoredUsers()
  const user = users.find((u) => u.email === email && (u as any).password === password)

  if (!user) {
    return { success: false, error: "Email ou senha incorretos" }
  }

  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = user as any
  return { success: true, user: userWithoutPassword }
}

export function logoutUser(): void {
  setStoredAuth({ user: null, isAuthenticated: false })
}
