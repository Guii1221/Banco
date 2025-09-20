"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileJson, FileText, BarChart3 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Todo } from "@/lib/todo-service"

interface ExportDialogProps {
  todos: Todo[]
}

export function ExportDialog({ todos }: ExportDialogProps) {
  const { user } = useAuth()
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "report">("json")
  const [includeCompleted, setIncludeCompleted] = useState(true)
  const [includePending, setIncludePending] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const getFilteredTodos = () => {
    return todos.filter((todo) => {
      if (!includeCompleted && todo.completed) return false
      if (!includePending && !todo.completed) return false
      return true
    })
  }

  const exportAsJSON = (filteredTodos: Todo[]) => {
    const exportData = {
      user: {
        name: user?.name,
        email: user?.email,
        exportDate: new Date().toISOString(),
      },
      todos: filteredTodos,
      summary: {
        total: filteredTodos.length,
        completed: filteredTodos.filter((t) => t.completed).length,
        pending: filteredTodos.filter((t) => !t.completed).length,
        byPriority: {
          high: filteredTodos.filter((t) => t.priority === "high").length,
          medium: filteredTodos.filter((t) => t.priority === "medium").length,
          low: filteredTodos.filter((t) => t.priority === "low").length,
        },
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `todos-${user?.name}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = (filteredTodos: Todo[]) => {
    const headers = [
      "ID",
      "Título",
      "Descrição",
      "Status",
      "Prioridade",
      "Data de Vencimento",
      "Criado em",
      "Atualizado em",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredTodos.map((todo) =>
        [
          todo.id,
          `"${todo.title.replace(/"/g, '""')}"`,
          `"${(todo.description || "").replace(/"/g, '""')}"`,
          todo.completed ? "Concluída" : "Pendente",
          todo.priority === "high" ? "Alta" : todo.priority === "medium" ? "Média" : "Baixa",
          todo.dueDate ? new Date(todo.dueDate).toLocaleDateString("pt-BR") : "",
          new Date(todo.createdAt).toLocaleDateString("pt-BR"),
          new Date(todo.updatedAt).toLocaleDateString("pt-BR"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `todos-${user?.name}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsReport = (filteredTodos: Todo[]) => {
    const stats = {
      total: filteredTodos.length,
      completed: filteredTodos.filter((t) => t.completed).length,
      pending: filteredTodos.filter((t) => !t.completed).length,
      byPriority: {
        high: filteredTodos.filter((t) => t.priority === "high").length,
        medium: filteredTodos.filter((t) => t.priority === "medium").length,
        low: filteredTodos.filter((t) => t.priority === "low").length,
      },
    }

    const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : "0"

    const reportContent = `
RELATÓRIO DE TAREFAS - ${user?.name}
Gerado em: ${new Date().toLocaleString("pt-BR")}

=== RESUMO GERAL ===
Total de Tarefas: ${stats.total}
Tarefas Concluídas: ${stats.completed}
Tarefas Pendentes: ${stats.pending}
Taxa de Conclusão: ${completionRate}%

=== POR PRIORIDADE ===
Alta Prioridade: ${stats.byPriority.high}
Média Prioridade: ${stats.byPriority.medium}
Baixa Prioridade: ${stats.byPriority.low}

=== DETALHES DAS TAREFAS ===
${filteredTodos
  .map(
    (todo, index) => `
${index + 1}. ${todo.title}
   Status: ${todo.completed ? "✓ Concluída" : "○ Pendente"}
   Prioridade: ${todo.priority === "high" ? "Alta" : todo.priority === "medium" ? "Média" : "Baixa"}
   ${todo.description ? `Descrição: ${todo.description}` : ""}
   ${todo.dueDate ? `Vencimento: ${new Date(todo.dueDate).toLocaleDateString("pt-BR")}` : ""}
   Criada em: ${new Date(todo.createdAt).toLocaleDateString("pt-BR")}
`,
  )
  .join("")}

=== TAREFAS VENCIDAS ===
${
  filteredTodos
    .filter((todo) => todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed)
    .map((todo) => `- ${todo.title} (Vencimento: ${new Date(todo.dueDate!).toLocaleDateString("pt-BR")})`)
    .join("\n") || "Nenhuma tarefa vencida"
}

=== PRÓXIMAS TAREFAS (7 DIAS) ===
${
  filteredTodos
    .filter((todo) => {
      if (!todo.dueDate || todo.completed) return false
      const dueDate = new Date(todo.dueDate)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      return dueDate <= nextWeek && dueDate >= new Date()
    })
    .map((todo) => `- ${todo.title} (Vencimento: ${new Date(todo.dueDate!).toLocaleDateString("pt-BR")})`)
    .join("\n") || "Nenhuma tarefa nos próximos 7 dias"
}
`

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-todos-${user?.name}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    if (!user) return

    setIsExporting(true)
    try {
      const filteredTodos = getFilteredTodos()

      switch (exportFormat) {
        case "json":
          exportAsJSON(filteredTodos)
          break
        case "csv":
          exportAsCSV(filteredTodos)
          break
        case "report":
          exportAsReport(filteredTodos)
          break
      }

      setIsOpen(false)
    } catch (error) {
      console.error("Error exporting data:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const filteredCount = getFilteredTodos().length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Dados
          </DialogTitle>
          <DialogDescription>Exporte suas tarefas em diferentes formatos para backup ou análise.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Formato de Exportação</Label>
            <Select value={exportFormat} onValueChange={(value: "json" | "csv" | "report") => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON - Dados estruturados
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV - Planilha
                  </div>
                </SelectItem>
                <SelectItem value="report">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Relatório - Texto formatado
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Filtros de Exportação</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="completed" checked={includeCompleted} onCheckedChange={setIncludeCompleted} />
                <Label htmlFor="completed" className="text-sm">
                  Incluir tarefas concluídas ({todos.filter((t) => t.completed).length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="pending" checked={includePending} onCheckedChange={setIncludePending} />
                <Label htmlFor="pending" className="text-sm">
                  Incluir tarefas pendentes ({todos.filter((t) => !t.completed).length})
                </Label>
              </div>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>{filteredCount}</strong> tarefa{filteredCount !== 1 ? "s" : ""} será
              {filteredCount !== 1 ? "ão" : ""} exportada{filteredCount !== 1 ? "s" : ""}.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={isExporting || filteredCount === 0}>
              {isExporting ? "Exportando..." : "Exportar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
