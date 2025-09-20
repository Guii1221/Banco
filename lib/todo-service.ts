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
  async getUserTodos(userId: string): Promise<Todo[]> {
    const response = await fetch(`/api/todos?userId=${userId}`)
    if (!response.ok) {
      throw new Error("Falha ao buscar tarefas")
    }
    const data = await response.json()
    // O MongoDB retorna _id, mas o front-end espera id. A API já deve fazer essa conversão.
    return data.map((item: any) => ({ ...item, id: item._id?.toString() || item.id }))
  }

  async createTodo(userId: string, data: CreateTodoData): Promise<Todo> {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, data }),
    })
    if (!response.ok) {
      throw new Error("Falha ao criar tarefa")
    }
    return response.json()
  }

  async updateTodo(todoId: string, data: UpdateTodoData): Promise<Todo | null> {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Falha ao atualizar tarefa")
    }
    return response.json()
  }

  async deleteTodo(todoId: string): Promise<boolean> {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Falha ao deletar tarefa")
    }
    const result = await response.json()
    return result.success
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
