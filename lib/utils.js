export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(date) {
  if (!date) return ""

  // If date is a string, convert it to a Date object
  const dateObj = typeof date === "string" ? new Date(date) : date

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return ""

  // Format the date as YYYY-MM-DD
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

// Función para formatear fechas en formato largo
export function formatDateLong(date) {
  if (!date) return ""

  const options = { month: "long", day: "numeric", year: "numeric" }
  return new Date(date).toLocaleDateString("es-ES", options)
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}
