"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthPage } from "@/components/auth/auth-page"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />
}
