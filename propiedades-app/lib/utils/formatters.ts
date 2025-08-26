// Utility functions for formatting data

export function formatPrice(price: number, currency = "EUR", locale = "es-ES"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatArea(area: number): string {
  return `${area.toLocaleString("es-ES")} m²`
}

export function formatDate(date: string | Date, locale = "es-ES"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeDate(date: string | Date, locale = "es-ES"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return "Hoy"
  } else if (diffInDays === 1) {
    return "Ayer"
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} días`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `Hace ${months} ${months === 1 ? "mes" : "meses"}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `Hace ${years} ${years === 1 ? "año" : "años"}`
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Format Spanish phone numbers
  if (cleaned.startsWith("34")) {
    const number = cleaned.substring(2)
    return `+34 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
  } else if (cleaned.length === 9) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`
  }

  return phone
}

export function formatPropertyType(type: string): string {
  const types: Record<string, string> = {
    house: "Casa",
    apartment: "Apartamento",
    condo: "Condominio",
    townhouse: "Adosado",
    land: "Terreno",
  }
  return types[type] || type
}

export function formatPropertyStatus(status: string): string {
  const statuses: Record<string, string> = {
    available: "Disponible",
    pending: "Pendiente",
    sold: "Vendida",
  }
  return statuses[status] || status
}

export function formatUserRole(role: string): string {
  const roles: Record<string, string> = {
    admin: "Administrador",
    agent: "Agente",
    client: "Cliente",
  }
  return roles[role] || role
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export function generatePropertyUrl(property: { id: string; title: string }): string {
  const slug = slugify(property.title)
  return `/propiedades/${property.id}/${slug}`
}
