"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AuthForm } from "@/components/auth-form"
import { TaskCard, type Task } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { TaskFilters } from "@/components/task-filters"
import { TaskStatsComponent } from "@/components/task-stats"
import { TaskActions } from "@/components/task-actions"
import { PreferencesDialog } from "@/components/preferences-dialog"
import { getStoredAuth } from "@/lib/auth"
import {
  getTasksForUser,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTaskStats,
  searchTasks,
} from "@/lib/tasks"
import { getUserPreferences, applyTheme } from "@/lib/preferences"

export default function HomePage() {
  const [authState, setAuthState] = useState<{ user: any; isAuthenticated: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created")

  useEffect(() => {
    const auth = getStoredAuth()
    setAuthState(auth)
    setLoading(false)

    if (auth.isAuthenticated) {
      loadTasks(auth.user.id)
      const preferences = getUserPreferences(auth.user.id)
      applyTheme(preferences.theme)
    }
  }, [])

  const loadTasks = (userId: string) => {
    const userTasks = getTasksForUser(userId)
    setTasks(userTasks)
  }

  const handleAuthSuccess = () => {
    const auth = getStoredAuth()
    setAuthState(auth)
    if (auth.user) {
      loadTasks(auth.user.id)
      const preferences = getUserPreferences(auth.user.id)
      applyTheme(preferences.theme)
    }
  }

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!authState?.user) return

    createTask(authState.user.id, taskData)
    loadTasks(authState.user.id)
    setShowTaskForm(false)
  }

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!editingTask || !authState?.user) return

    updateTask(authState.user.id, editingTask.id, taskData)
    loadTasks(authState.user.id)
    setEditingTask(null)
  }

  const handleToggleComplete = (taskId: string) => {
    if (!authState?.user) return

    toggleTaskComplete(authState.user.id, taskId)
    loadTasks(authState.user.id)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!authState?.user) return

    deleteTask(authState.user.id, taskId)
    loadTasks(authState.user.id)
  }

  const handleTasksChange = () => {
    if (authState?.user) {
      loadTasks(authState.user.id)
    }
  }

  // Get filtered tasks and stats
  const filteredTasks = authState?.user
    ? searchTasks(authState.user.id, searchTerm, {
        priority: priorityFilter as any,
        status: statusFilter as any,
        sortBy: sortBy as any,
      })
    : []

  const stats = authState?.user ? getTaskStats(authState.user.id) : null

  const displayTasks = authState?.user
    ? (() => {
        const preferences = getUserPreferences(authState.user.id)
        return preferences.showCompletedTasks ? filteredTasks : filteredTasks.filter((task) => !task.completed)
      })()
    : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  if (!authState?.isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  if (showTaskForm || editingTask) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <TaskForm
          task={editingTask || undefined}
          userId={authState.user.id}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Minhas Tarefas</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, {authState.user?.name}</span>
            <Button
              onClick={() => {
                localStorage.clear()
                setAuthState({ user: null, isAuthenticated: false })
              }}
              variant="outline"
              size="sm"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Section */}
        {stats && <TaskStatsComponent stats={stats} />}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-balance">Organize suas tarefas</h2>
            <p className="text-muted-foreground text-pretty">
              {tasks.length === 0
                ? "Comece criando sua primeira tarefa"
                : `${tasks.filter((t) => !t.completed).length} pendentes de ${tasks.length} tarefas`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PreferencesDialog userId={authState.user.id} />
            <TaskActions userId={authState.user.id} onTasksChange={handleTasksChange} />
            <Button onClick={() => setShowTaskForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <TaskFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </div>

        <div className="space-y-4">
          {displayTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {tasks.length === 0
                  ? "Nenhuma tarefa criada ainda"
                  : "Nenhuma tarefa encontrada com os filtros aplicados"}
              </div>
              {tasks.length === 0 && (
                <Button onClick={() => setShowTaskForm(true)} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeira tarefa
                </Button>
              )}
            </div>
          ) : (
            displayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
