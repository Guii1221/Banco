export interface Todo {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoData {
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  dueDate?: string
}

export interface UpdateTodoData {
  title?: string
  description?: string
  completed?: boolean
  priority?: "low" | "medium" | "high"
  dueDate?: string
}

class TodoService {
  private storageKey = "todo-app-todos"

  private getTodos(): Todo[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.storageKey)
    if (!stored) return []

    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  private saveTodos(todos: Todo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos))
  }

  async getUserTodos(userId: string): Promise<Todo[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const todos = this.getTodos()
    return todos.filter((todo) => todo.userId === userId)
  }

  async createTodo(userId: string, data: CreateTodoData): Promise<Todo> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const todos = this.getTodos()
    const newTodo: Todo = {
      id: Date.now().toString(),
      userId,
      title: data.title,
      description: data.description,
      completed: false,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    todos.push(newTodo)
    this.saveTodos(todos)

    return newTodo
  }

  async updateTodo(todoId: string, data: UpdateTodoData): Promise<Todo | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const todos = this.getTodos()
    const todoIndex = todos.findIndex((todo) => todo.id === todoId)

    if (todoIndex === -1) return null

    const updatedTodo = {
      ...todos[todoIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    todos[todoIndex] = updatedTodo
    this.saveTodos(todos)

    return updatedTodo
  }

  async deleteTodo(todoId: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const todos = this.getTodos()
    const filteredTodos = todos.filter((todo) => todo.id !== todoId)

    if (filteredTodos.length === todos.length) return false

    this.saveTodos(filteredTodos)
    return true
  }

  async exportUserTodos(userId: string): Promise<string> {
    const todos = await this.getUserTodos(userId)
    return JSON.stringify(todos, null, 2)
  }

  async getTodoStats(userId: string): Promise<{
    total: number
    completed: number
    pending: number
    byPriority: { low: number; medium: number; high: number }
  }> {
    const todos = await this.getUserTodos(userId)

    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
      byPriority: {
        low: todos.filter((t) => t.priority === "low").length,
        medium: todos.filter((t) => t.priority === "medium").length,
        high: todos.filter((t) => t.priority === "high").length,
      },
    }
  }
}

export const todoService = new TodoService()
