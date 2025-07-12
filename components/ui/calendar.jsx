"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Calendar({
  className,
  month: initialMonth = new Date(),
  onMonthChange,
  onSelect,
  selected,
  disabled = [],
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(initialMonth)
  const [selectedDate, setSelectedDate] = React.useState(selected)

  React.useEffect(() => {
    if (selected) {
      setSelectedDate(selected)
    }
  }, [selected])

  // Función para obtener días del mes actual
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Función para obtener el día de la semana del primer día del mes (0 = domingo, 1 = lunes, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePreviousMonth = () => {
    const previousMonth = new Date(currentMonth)
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    setCurrentMonth(previousMonth)
    onMonthChange?.(previousMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
    onMonthChange?.(nextMonth)
  }

  const handleSelectDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    onSelect?.(date)
  }

  // Renderizar el calendario
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Nombres de los meses
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  // Nombres de los días de la semana
  const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]

  // Crear array de días para renderizar
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null) // Espacios vacíos para alinear el primer día
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Función para verificar si una fecha está deshabilitada
  const isDateDisabled = (date) => {
    if (!disabled || !Array.isArray(disabled)) return false

    return disabled.some(
      (disabledDate) =>
        disabledDate instanceof Date &&
        disabledDate.getDate() === date.getDate() &&
        disabledDate.getMonth() === date.getMonth() &&
        disabledDate.getFullYear() === date.getFullYear(),
    )
  }

  // Función para verificar si una fecha está seleccionada
  const isDateSelected = (date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Mes anterior</span>
        </Button>
        <div className="font-medium">
          {monthNames[month]} {year}
        </div>
        <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Mes siguiente</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="py-1 text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />
          }

          const date = new Date(year, month, day)
          const isSelected = isDateSelected(date)
          const isDisabled = isDateDisabled(date)

          return (
            <Button
              key={`day-${index}`}
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 p-0 font-normal",
                isSelected && "bg-primary text-primary-foreground",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
              disabled={isDisabled}
              onClick={() => !isDisabled && handleSelectDate(day)}
            >
              {day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
