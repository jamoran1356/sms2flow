"use client"

import { useState, useEffect } from "react"

const NewCustomerPage = () => {
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
  })

  // Verificar si hay parámetros en la URL para prellenar el formulario
  useEffect(() => {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search)
    const idFromURL = params.get("id")

    if (idFromURL) {
      setCustomer((prev) => ({
        ...prev,
        id: idFromURL,
      }))
    }
  }, [])

  return (
    <div>
      <h1>New Customer</h1>
      {/* Form elements will go here */}
    </div>
  )
}

export default NewCustomerPage
