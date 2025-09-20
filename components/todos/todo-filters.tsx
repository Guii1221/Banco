"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export type FilterStatus = "all" | "pending" | "completed"
export type FilterPriority = "all" | "low" | "medium" | "high"
export type SortBy = "created" | "dueDate" | "priority" | "title"

interface TodoFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: FilterStatus
  onStatusFilterChange: (status: FilterStatus) => void
  priorityFilter: FilterPriority
  onPriorityFilterChange: (priority: FilterPriority) => void
  sortBy: SortBy
  onSortByChange: (sort: SortBy) => void
}

export function TodoFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
}: TodoFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange("all")}
          >
            Todas
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange("completed")}
          >
            Concluídas
          </Button>
        </div>

        <Select value={priorityFilter} onValueChange={(value: FilterPriority) => onPriorityFilterChange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: SortBy) => onSortByChange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Data de Criação</SelectItem>
            <SelectItem value="dueDate">Data de Vencimento</SelectItem>
            <SelectItem value="priority">Prioridade</SelectItem>
            <SelectItem value="title">Título</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
