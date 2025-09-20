"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Upload, Trash2 } from "lucide-react"
import { exportTasks, importTasks, saveTasksForUser } from "@/lib/tasks"
import { useToast } from "@/hooks/use-toast"

interface TaskActionsProps {
  userId: string
  onTasksChange: () => void
}

export function TaskActions({ userId, onTasksChange }: TaskActionsProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleExport = () => {
    const tasksJson = exportTasks(userId)
    const blob = new Blob([tasksJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `minhas-tarefas-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exportação concluída",
      description: "Suas tarefas foram exportadas com sucesso.",
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const result = importTasks(userId, content)

      if (result.success) {
        toast({
          title: "Importação concluída",
          description: `${result.imported} tarefas foram importadas com sucesso.`,
        })
        onTasksChange()
        setImportDialogOpen(false)
      } else {
        toast({
          title: "Erro na importação",
          description: result.error,
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllTasks = () => {
    saveTasksForUser(userId, [])
    onTasksChange()
    setClearDialogOpen(false)

    toast({
      title: "Tarefas removidas",
      description: "Todas as tarefas foram removidas com sucesso.",
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-transparent">
        <Download className="h-4 w-4" />
        Exportar
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Tarefas</DialogTitle>
            <DialogDescription>
              Selecione um arquivo JSON com suas tarefas para importar. As tarefas serão adicionadas às existentes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-file">Arquivo JSON</Label>
              <Input id="import-file" type="file" accept=".json" onChange={handleImport} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive bg-transparent">
            <Trash2 className="h-4 w-4" />
            Limpar Tudo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Todas as Tarefas</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Todas as suas tarefas serão permanentemente removidas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearAllTasks}>
              Remover Tudo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
