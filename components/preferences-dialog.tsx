"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Settings } from "lucide-react"
import { getUserPreferences, saveUserPreferences, applyTheme, type UserPreferences } from "@/lib/preferences"
import { useToast } from "@/hooks/use-toast"

interface PreferencesDialogProps {
  userId: string
}

export function PreferencesDialog({ userId }: PreferencesDialogProps) {
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open && userId) {
      const userPrefs = getUserPreferences(userId)
      setPreferences(userPrefs)
    }
  }, [open, userId])

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    if (!preferences) return

    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
  }

  const handleNestedPreferenceChange = (parentKey: keyof UserPreferences, childKey: string, value: any) => {
    if (!preferences) return

    const updated = {
      ...preferences,
      [parentKey]: {
        ...(preferences[parentKey] as any),
        [childKey]: value,
      },
    }
    setPreferences(updated)
  }

  const handleSave = () => {
    if (!preferences) return

    saveUserPreferences(userId, preferences)
    applyTheme(preferences.theme)

    toast({
      title: "Preferências salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    })

    setOpen(false)
  }

  const handleReset = () => {
    if (!userId) return

    // Clear preferences from localStorage
    localStorage.removeItem(`preferences-${userId}`)
    const defaultPrefs = getUserPreferences(userId)
    setPreferences(defaultPrefs)
    applyTheme(defaultPrefs.theme)

    toast({
      title: "Preferências restauradas",
      description: "Suas configurações foram restauradas para os valores padrão.",
    })
  }

  if (!preferences) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>Personalize sua experiência com o aplicativo de tarefas.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Aparência</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tema</Label>
                <div className="text-sm text-muted-foreground">Escolha entre claro, escuro ou automático</div>
              </div>
              <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Idioma</Label>
                <div className="text-sm text-muted-foreground">Idioma da interface</div>
              </div>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange("language", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Formato de Data</Label>
                <div className="text-sm text-muted-foreground">Como as datas são exibidas</div>
              </div>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                  <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Tasks Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tarefas</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Prioridade Padrão</Label>
                <div className="text-sm text-muted-foreground">Prioridade para novas tarefas</div>
              </div>
              <Select
                value={preferences.defaultPriority}
                onValueChange={(value) => handlePreferenceChange("defaultPriority", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tarefas por Página</Label>
                <div className="text-sm text-muted-foreground">Quantas tarefas mostrar por vez</div>
              </div>
              <Select
                value={preferences.tasksPerPage.toString()}
                onValueChange={(value) => handlePreferenceChange("tasksPerPage", Number.parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar Tarefas Concluídas</Label>
                <div className="text-sm text-muted-foreground">Exibir tarefas já finalizadas na lista</div>
              </div>
              <Switch
                checked={preferences.showCompletedTasks}
                onCheckedChange={(checked) => handlePreferenceChange("showCompletedTasks", checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificações</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes de Vencimento</Label>
                <div className="text-sm text-muted-foreground">Notificar sobre tarefas próximas do vencimento</div>
              </div>
              <Switch
                checked={preferences.notifications.dueDateReminders}
                onCheckedChange={(checked) =>
                  handleNestedPreferenceChange("notifications", "dueDateReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumo Diário</Label>
                <div className="text-sm text-muted-foreground">Receber resumo das tarefas do dia</div>
              </div>
              <Switch
                checked={preferences.notifications.dailySummary}
                onCheckedChange={(checked) => handleNestedPreferenceChange("notifications", "dailySummary", checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleReset}>
            Restaurar Padrões
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
