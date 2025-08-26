// Application constants and configuration

export const APP_CONFIG = {
  name: "Propiedades Premium",
  description: "Encuentra tu hogar ideal con la mejor atención personalizada",
  version: "1.0.0",
  author: "Propiedades Premium Team",
  contact: {
    email: "info@propiedadespremium.com",
    phone: "+34 900 123 456",
    address: "Calle Principal 123, 28001 Madrid, España",
  },
  social: {
    facebook: "https://facebook.com/propiedadespremium",
    twitter: "https://twitter.com/propiedadespremium",
    instagram: "https://instagram.com/propiedadespremium",
    linkedin: "https://linkedin.com/company/propiedadespremium",
  },
}

export const API_ENDPOINTS = {
  properties: "/properties",
  users: "/users",
  auth: "/auth",
  upload: "/upload",
  stats: "/stats",
  notifications: "/notifications",
  settings: "/settings",
  search: "/search",
  favorites: "/favorites",
  contactMessages: "/contact-messages",
} as const

export const PROPERTY_TYPES = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Apartamento" },
  { value: "condo", label: "Condominio" },
  { value: "townhouse", label: "Adosado" },
  { value: "land", label: "Terreno" },
] as const

export const PROPERTY_STATUSES = [
  { value: "available", label: "Disponible" },
  { value: "pending", label: "Pendiente" },
  { value: "sold", label: "Vendida" },
] as const

export const USER_ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "agent", label: "Agente" },
  { value: "client", label: "Cliente" },
] as const

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
  defaultPage: 1,
} as const

export const VALIDATION_RULES = {
  password: {
    minLength: 6,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  property: {
    titleMinLength: 5,
    descriptionMinLength: 20,
    addressMinLength: 5,
    cityMinLength: 2,
    stateMinLength: 2,
    zipCodeMinLength: 4,
    minPrice: 1,
    minArea: 1,
    minYear: 1800,
    maxYear: new Date().getFullYear(),
  },
  user: {
    nameMinLength: 2,
    phoneMinLength: 9,
  },
} as const

export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 10,
} as const

export const SEARCH_CONFIG = {
  debounceMs: 300,
  minQueryLength: 2,
  maxResults: 50,
} as const

export const CACHE_KEYS = {
  properties: "properties",
  users: "users",
  stats: "stats",
  notifications: "notifications",
  settings: "settings",
  favorites: "favorites",
} as const

export const ERROR_MESSAGES = {
  network: "Error de conexión. Por favor, verifica tu conexión a internet.",
  unauthorized: "No tienes permisos para realizar esta acción.",
  notFound: "El recurso solicitado no fue encontrado.",
  validation: "Los datos proporcionados no son válidos.",
  server: "Error interno del servidor. Por favor, intenta más tarde.",
  unknown: "Ha ocurrido un error inesperado.",
} as const

export const SUCCESS_MESSAGES = {
  propertyCreated: "Propiedad creada exitosamente",
  propertyUpdated: "Propiedad actualizada exitosamente",
  propertyDeleted: "Propiedad eliminada exitosamente",
  userCreated: "Usuario creado exitosamente",
  userUpdated: "Usuario actualizado exitosamente",
  userDeleted: "Usuario eliminado exitosamente",
  loginSuccess: "Sesión iniciada exitosamente",
  logoutSuccess: "Sesión cerrada exitosamente",
  settingsUpdated: "Configuración actualizada exitosamente",
} as const
