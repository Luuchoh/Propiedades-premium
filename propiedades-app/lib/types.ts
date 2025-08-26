export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  details: {
    bedrooms: number
    bathrooms: number
    area: number // in square meters
    yearBuilt?: number
    propertyType: "house" | "apartment" | "condo" | "townhouse" | "land"
    status: "available" | "pending" | "sold"
  }
  images: string[]
  features: string[]
  agent: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent" | "client"
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

// API Response types for future backend integration
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter types for property search
export interface PropertyFilters {
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: Property["details"]["propertyType"]
  city?: string
  status?: Property["details"]["status"]
}

// Additional types for better API integration and form handling
export interface ContactMessage {
  id: string
  propertyId: string
  senderName: string
  senderEmail: string
  senderPhone?: string
  message: string
  agentId: string
  status: "new" | "read" | "replied" | "closed"
  createdAt: string
  updatedAt: string
}

export interface PropertyStats {
  totalViews: number
  monthlyViews: number
  inquiries: number
  favorites: number
  lastViewedAt?: string
}

export interface DashboardStats {
  totalProperties: number
  availableProperties: number
  pendingProperties: number
  soldProperties: number
  totalUsers: number
  totalAgents: number
  totalClients: number
  monthlyRevenue: number
  monthlyInquiries: number
  popularCities: Array<{
    city: string
    count: number
  }>
}

export interface SearchFilters extends PropertyFilters {
  sortBy?: "price" | "date" | "area" | "popularity"
  sortOrder?: "asc" | "desc"
}

export interface ImageUpload {
  file: File
  preview: string
  uploaded?: boolean
  url?: string
}

export interface PropertyFormData {
  title: string
  description: string
  price: number
  location: Property["location"]
  details: Property["details"]
  features: string[]
  images: ImageUpload[]
}

export interface UserFormData {
  name: string
  email: string
  phone?: string
  role: User["role"]
  avatar?: ImageUpload
}

// Validation schemas
export interface ValidationError {
  field: string
  message: string
}

export interface FormValidation {
  isValid: boolean
  errors: ValidationError[]
}

// API Error types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Notification types
export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

// Settings types
export interface AppSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  features: {
    allowRegistration: boolean
    requireEmailVerification: boolean
    enableNotifications: boolean
    enableAnalytics: boolean
  }
}
