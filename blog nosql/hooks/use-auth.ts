"use client"

import { useState, useEffect } from "react"
import { authStorage, type User } from "@/lib/auth-storage"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize sample users
    authStorage.initializeSampleUsers()

    // Check for existing session
    const currentUser = authStorage.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = authStorage.login(email, password)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return result
  }

  const register = async (username: string, email: string, password: string) => {
    const result = authStorage.register(username, email, password)
    if (result.success && result.user) {
      // Auto-login after registration
      const loginResult = authStorage.login(email, password)
      if (loginResult.success && loginResult.user) {
        setUser(loginResult.user)
      }
    }
    return result
  }

  const logout = () => {
    authStorage.logout()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}
