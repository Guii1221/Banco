"use client"

import { useState, useEffect } from "react"
import { type Todo, type CreateTodoData, type UpdateTodoData, todoService } from "@/lib/todo-service"
import { useAuth } from "./use-auth"

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const loadTodos = async () => {
    if (!user) {
      setTodos([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const userTodos = await todoService.getUserTodos(user.id)
      setTodos(userTodos)
    } catch (err) {
      setError("Erro ao carregar tarefas")
      console.error("Error loading todos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const createTodo = async (data: CreateTodoData) => {
    if (!user) return null

    try {
      setError(null)
      const newTodo = await todoService.createTodo(user.id, data)
      setTodos((prev) => [newTodo, ...prev])
      return newTodo
    } catch (err) {
      setError("Erro ao criar tarefa")
      console.error("Error creating todo:", err)
      return null
    }
  }

  const updateTodo = async (todoId: string, data: UpdateTodoData) => {
    try {
      setError(null)
      const updatedTodo = await todoService.updateTodo(todoId, data)
      if (updatedTodo) {
        setTodos((prev) => prev.map((todo) => (todo.id === todoId ? updatedTodo : todo)))
        return updatedTodo
      }
      return null
    } catch (err) {
      setError("Erro ao atualizar tarefa")
      console.error("Error updating todo:", err)
      return null
    }
  }

  const deleteTodo = async (todoId: string) => {
    try {
      setError(null)
      const success = await todoService.deleteTodo(todoId)
      if (success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== todoId))
        return true
      }
      return false
    } catch (err) {
      setError("Erro ao deletar tarefa")
      console.error("Error deleting todo:", err)
      return false
    }
  }

  const toggleTodo = async (todoId: string) => {
    const todo = todos.find((t) => t.id === todoId)
    if (!todo) return null

    return updateTodo(todoId, { completed: !todo.completed })
  }

  useEffect(() => {
    loadTodos()
  }, [user])

  return {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: loadTodos,
  }
}
