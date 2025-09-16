"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ExportDataModal } from "./export-data-modal"

export function ExportDataButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar Dados
      </Button>

      <ExportDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
