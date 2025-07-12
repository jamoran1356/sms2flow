"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ className, selected, onSelect, disabled, ...props }) {
  const [date, setDate] = React.useState(selected)

  // Actualizar el estado local cuando cambia la prop selected
  React.useEffect(() => {
    if (selected) {
      setDate(selected)
    }
  }, [selected])

  const handleSelect = (selectedDate) => {
    setDate(selectedDate)
    onSelect?.(selectedDate)
  }

  // Función para formatear la fecha en formato legible
  const formatDate = (date) => {
    if (!date) return ""

    const day = date.getDate()
    const month = date.toLocaleString("es-ES", { month: "long" })
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar selected={date} onSelect={handleSelect} disabled={disabled} />
      </PopoverContent>
    </Popover>
  )
}
