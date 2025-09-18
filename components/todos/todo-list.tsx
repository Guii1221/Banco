"use client"

import type { Todo, UpdateTodoData } from "@/lib/todo-service"
import { TodoItem } from "./todo-item"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoList({ todos, onToggle, onUpdate, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
          <p className="text-sm">Crie sua primeira tarefa para começar!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}
