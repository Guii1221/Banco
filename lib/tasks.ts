import type { Task } from "@/components/task-card"

const TASKS_STORAGE_PREFIX = "tasks-"

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byPriority: {
    high: number
    medium: number
    low: number
  }
}

export function getTasksForUser(userId: string): Task[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(`${TASKS_STORAGE_PREFIX}${userId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading tasks:", error)
  }

  return []
}

export function saveTasksForUser(userId: string, tasks: Task[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(`${TASKS_STORAGE_PREFIX}${userId}`, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks:", error)
  }
}

export function createTask(userId: string, taskData: Omit<Task, "id" | "createdAt" | "userId">): Task {
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    userId,
  }

  const tasks = getTasksForUser(userId)
  const updatedTasks = [...tasks, newTask]
  saveTasksForUser(userId, updatedTasks)

  return newTask
}

export function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Omit<Task, "id" | "createdAt" | "userId">>,
): Task | null {
  const tasks = getTasksForUser(userId)
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex === -1) return null

  const updatedTask = { ...tasks[taskIndex], ...updates }
  tasks[taskIndex] = updatedTask
  saveTasksForUser(userId, tasks)

  return updatedTask
}

export function deleteTask(userId: string, taskId: string): boolean {
  const tasks = getTasksForUser(userId)
  const filteredTasks = tasks.filter((task) => task.id !== taskId)

  if (filteredTasks.length === tasks.length) return false

  saveTasksForUser(userId, filteredTasks)
  return true
}

export function toggleTaskComplete(userId: string, taskId: string): Task | null {
  const tasks = getTasksForUser(userId)
  const task = tasks.find((t) => t.id === taskId)

  if (!task) return null

  return updateTask(userId, taskId, { completed: !task.completed })
}

export function getTaskStats(userId: string): TaskStats {
  const tasks = getTasksForUser(userId)
  const now = new Date()

  const stats: TaskStats = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    overdue: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
  }

  tasks.forEach((task) => {
    if (task.completed) {
      stats.completed++
    } else {
      stats.pending++

      // Check if overdue
      if (task.dueDate && new Date(task.dueDate) < now) {
        stats.overdue++
      }
    }

    stats.byPriority[task.priority]++
  })

  return stats
}

export function searchTasks(
  userId: string,
  searchTerm: string,
  filters: {
    priority?: "all" | "high" | "medium" | "low"
    status?: "all" | "completed" | "pending"
    sortBy?: "created" | "dueDate" | "priority" | "title"
  } = {},
): Task[] {
  const tasks = getTasksForUser(userId)
  const { priority = "all", status = "all", sortBy = "created" } = filters

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesPriority = priority === "all" || task.priority === priority

    const matchesStatus =
      status === "all" || (status === "completed" && task.completed) || (status === "pending" && !task.completed)

    return matchesSearch && matchesPriority && matchesStatus
  })

  // Sort tasks
  filteredTasks.sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "title":
        return a.title.localeCompare(b.title)
      default: // created
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return filteredTasks
}

export function exportTasks(userId: string): string {
  const tasks = getTasksForUser(userId)
  return JSON.stringify(tasks, null, 2)
}

export function importTasks(
  userId: string,
  tasksJson: string,
): { success: boolean; error?: string; imported?: number } {
  try {
    const importedTasks = JSON.parse(tasksJson)

    if (!Array.isArray(importedTasks)) {
      return { success: false, error: "Formato inválido: esperado um array de tarefas" }
    }

    // Validate task structure
    const validTasks = importedTasks.filter((task) => {
      return (
        task &&
        typeof task === "object" &&
        typeof task.title === "string" &&
        typeof task.completed === "boolean" &&
        ["low", "medium", "high"].includes(task.priority)
      )
    })

    if (validTasks.length === 0) {
      return { success: false, error: "Nenhuma tarefa válida encontrada" }
    }

    // Assign new IDs and user ID
    const tasksToImport = validTasks.map((task) => ({
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: task.createdAt || new Date().toISOString(),
    }))

    const existingTasks = getTasksForUser(userId)
    const allTasks = [...existingTasks, ...tasksToImport]
    saveTasksForUser(userId, allTasks)

    return { success: true, imported: tasksToImport.length }
  } catch (error) {
    return { success: false, error: "Erro ao processar arquivo JSON" }
  }
}
