"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical, Edit, Trash2, Calendar } from "lucide-react"
import type { Todo, UpdateTodoData } from "@/lib/todo-service"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, data: UpdateTodoData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [editPriority, setEditPriority] = useState(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || "")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Média"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !todo.completed
  }

  const handleSaveEdit = async () => {
    const updateData: UpdateTodoData = {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    }

    await onUpdate(todo.id, updateData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || "")
    setEditPriority(todo.priority)
    setEditDueDate(todo.dueDate || "")
    setIsEditing(false)
  }

  return (
    <Card className={cn("transition-all duration-200", todo.completed && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={cn("font-medium text-balance", todo.completed && "line-through text-muted-foreground")}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={cn("text-sm text-muted-foreground mt-1 text-pretty", todo.completed && "line-through")}>
                    {todo.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Tarefa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Título</Label>
                          <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Descrição</Label>
                          <Textarea
                            id="edit-description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Prioridade</Label>
                            <Select
                              value={editPriority}
                              onValueChange={(value: "low" | "medium" | "high") => setEditPriority(value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-due-date">Data de Vencimento</Label>
                            <Input
                              id="edit-due-date"
                              type="date"
                              value={editDueDate}
                              onChange={(e) => setEditDueDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveEdit}>Salvar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenuItem onClick={() => onDelete(todo.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Badge className={getPriorityColor(todo.priority)}>{getPriorityLabel(todo.priority)}</Badge>

              {todo.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-1 rounded-md",
                    isOverdue(todo.dueDate) ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  {formatDate(todo.dueDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
