"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Simple utility function defined inline to avoid import conflicts
function formatDateForInput(date) {
  if (!date) return ""
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return ""
    return dateObj.toISOString().split("T")[0]
  } catch (error) {
    console.error("Error formatting date for input:", error)
    return ""
  }
}

export function DateInput({ className, label, value, onChange, disabled = false, ...props }) {
  const inputId = React.useId()
  const [dateValue, setDateValue] = React.useState(() => formatDateForInput(value))

  // Update internal value when prop value changes
  React.useEffect(() => {
    setDateValue(formatDateForInput(value))
  }, [value])

  function handleChange(e) {
    const newValue = e.target.value
    setDateValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative">
        <Input
          id={inputId}
          type="date"
          value={dateValue}
          onChange={handleChange}
          disabled={disabled}
          className="pr-10"
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}
