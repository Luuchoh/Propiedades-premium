import type { PropertyFormData, UserFormData, ValidationError, FormValidation } from "@/lib/types"

export function validateProperty(data: PropertyFormData): FormValidation {
  const errors: ValidationError[] = []

  // Title validation
  if (!data.title || data.title.trim().length < 5) {
    errors.push({
      field: "title",
      message: "El título debe tener al menos 5 caracteres",
    })
  }

  // Description validation
  if (!data.description || data.description.trim().length < 20) {
    errors.push({
      field: "description",
      message: "La descripción debe tener al menos 20 caracteres",
    })
  }

  // Price validation
  if (!data.price || data.price <= 0) {
    errors.push({
      field: "price",
      message: "El precio debe ser mayor a 0",
    })
  }

  // Location validation
  if (!data.location.address || data.location.address.trim().length < 5) {
    errors.push({
      field: "location.address",
      message: "La dirección debe tener al menos 5 caracteres",
    })
  }

  if (!data.location.city || data.location.city.trim().length < 2) {
    errors.push({
      field: "location.city",
      message: "La ciudad es requerida",
    })
  }

  if (!data.location.state || data.location.state.trim().length < 2) {
    errors.push({
      field: "location.state",
      message: "El estado/provincia es requerido",
    })
  }

  if (!data.location.zipCode || data.location.zipCode.trim().length < 4) {
    errors.push({
      field: "location.zipCode",
      message: "El código postal debe tener al menos 4 caracteres",
    })
  }

  // Details validation
  if (data.details.bedrooms < 0) {
    errors.push({
      field: "details.bedrooms",
      message: "El número de habitaciones no puede ser negativo",
    })
  }

  if (data.details.bathrooms < 0) {
    errors.push({
      field: "details.bathrooms",
      message: "El número de baños no puede ser negativo",
    })
  }

  if (!data.details.area || data.details.area <= 0) {
    errors.push({
      field: "details.area",
      message: "El área debe ser mayor a 0",
    })
  }

  if (data.details.yearBuilt && (data.details.yearBuilt < 1800 || data.details.yearBuilt > new Date().getFullYear())) {
    errors.push({
      field: "details.yearBuilt",
      message: "El año de construcción no es válido",
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateUser(data: UserFormData): FormValidation {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "El nombre debe tener al menos 2 caracteres",
    })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({
      field: "email",
      message: "El email no es válido",
    })
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[+]?[0-9\s\-$$$$]{9,}$/
    if (!phoneRegex.test(data.phone)) {
      errors.push({
        field: "phone",
        message: "El teléfono no es válido",
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): FormValidation {
  const errors: ValidationError[] = []

  if (password.length < 6) {
    errors.push({
      field: "password",
      message: "La contraseña debe tener al menos 6 caracteres",
    })
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push({
      field: "password",
      message: "La contraseña debe contener al menos una letra minúscula",
    })
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push({
      field: "password",
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push({
      field: "password",
      message: "La contraseña debe contener al menos un número",
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
