export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: "pt" | "en"
  tasksPerPage: number
  defaultPriority: "low" | "medium" | "high"
  showCompletedTasks: boolean
  notifications: {
    dueDateReminders: boolean
    dailySummary: boolean
  }
  dateFormat: "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd"
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "pt",
  tasksPerPage: 20,
  defaultPriority: "medium",
  showCompletedTasks: true,
  notifications: {
    dueDateReminders: true,
    dailySummary: false,
  },
  dateFormat: "dd/mm/yyyy",
}

const PREFERENCES_STORAGE_PREFIX = "preferences-"

export function getUserPreferences(userId: string): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES

  try {
    const stored = localStorage.getItem(`${PREFERENCES_STORAGE_PREFIX}${userId}`)
    if (stored) {
      const preferences = JSON.parse(stored)
      return { ...DEFAULT_PREFERENCES, ...preferences }
    }
  } catch (error) {
    console.error("Error loading preferences:", error)
  }

  return DEFAULT_PREFERENCES
}

export function saveUserPreferences(userId: string, preferences: Partial<UserPreferences>): void {
  if (typeof window === "undefined") return

  try {
    const current = getUserPreferences(userId)
    const updated = { ...current, ...preferences }
    localStorage.setItem(`${PREFERENCES_STORAGE_PREFIX}${userId}`, JSON.stringify(updated))
  } catch (error) {
    console.error("Error saving preferences:", error)
  }
}

export function applyTheme(theme: "light" | "dark" | "system"): void {
  if (typeof window === "undefined") return

  const root = document.documentElement

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    root.classList.toggle("dark", systemTheme === "dark")
  } else {
    root.classList.toggle("dark", theme === "dark")
  }
}

export function formatDate(date: string | Date, format: UserPreferences["dateFormat"]): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  switch (format) {
    case "mm/dd/yyyy":
      return dateObj.toLocaleDateString("en-US")
    case "yyyy-mm-dd":
      return dateObj.toISOString().split("T")[0]
    default: // dd/mm/yyyy
      return dateObj.toLocaleDateString("pt-BR")
  }
}
