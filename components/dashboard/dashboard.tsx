"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { TodoForm } from "@/components/todos/todo-form"
import { TodoList } from "@/components/todos/todo-list"
import { TodoFilters, type FilterStatus, type FilterPriority, type SortBy } from "@/components/todos/todo-filters"
import { StatsCards } from "./stats-cards"
import { ExportDialog } from "./export-dialog"
import { useTodos } from "@/hooks/use-todos"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()
  const { todos, isLoading, error, createTodo, updateTodo, deleteTodo, toggleTodo } = useTodos()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all")
  const [sortBy, setSortBy] = useState<SortBy>("created")
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    byPriority: { low: 0, medium: 0, high: 0 },
  })

  // Update stats when todos change
  useEffect(() => {
    const newStats = {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
      byPriority: {
        low: todos.filter((t) => t.priority === "low").length,
        medium: todos.filter((t) => t.priority === "medium").length,
        high: todos.filter((t) => t.priority === "high").length,
      },
    }
    setStats(newStats)
  }, [todos])

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter === "completed") {
      filtered = filtered.filter((todo) => todo.completed)
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((todo) => !todo.completed)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((todo) => todo.priority === priorityFilter)
    }

    // Sort todos
    const sortedTodos = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return sortedTodos
  }, [todos, searchTerm, statusFilter, priorityFilter, sortBy])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando tarefas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <ExportDialog todos={todos} />
      </Header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Todo Form */}
            <div className="lg:col-span-1">
              <TodoForm onSubmit={createTodo} />
            </div>

            {/* Todo List */}
            <div className="lg:col-span-2 space-y-6">
              <TodoFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Suas Tarefas ({filteredAndSortedTodos.length})</h2>
                </div>

                <TodoList
                  todos={filteredAndSortedTodos}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
