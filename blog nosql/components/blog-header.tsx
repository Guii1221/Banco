"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Github, Download, FileText, LogIn, LogOut, User } from "lucide-react"
import { ExportDataModal } from "./export-data-modal"
import { DocumentationModal } from "./documentation-modal"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/hooks/use-auth"

export function BlogHeader() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Blog NoSQL</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Documentação
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDocsModalOpen(true)}
                className="text-muted-foreground hover:text-primary md:hidden"
              >
                <FileText className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="w-4 h-4" />
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 ml-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{user?.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:ml-2 sm:inline">Sair</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-muted-foreground hover:text-primary ml-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:ml-2 sm:inline">Entrar</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <ExportDataModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <DocumentationModal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
