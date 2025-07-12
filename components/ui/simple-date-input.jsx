"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SimpleDateInput({ label, value, onChange, className, ...props }) {
  const [dateValue, setDateValue] = useState(value || "")

  useEffect(() => {
    if (value) {
      setDateValue(value)
    }
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setDateValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <Input type="date" value={dateValue} onChange={handleChange} {...props} />
    </div>
  )
}
