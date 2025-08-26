import type {
  Property,
  User,
  ApiResponse,
  PaginatedResponse,
  PropertyFilters,
  ContactMessage,
  DashboardStats,
  PropertyStats,
  Notification,
  AppSettings,
  SearchFilters,
} from "./types"
import { mockUsers } from "./mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Properties API
  async getProperties(filters?: PropertyFilters, page = 1, limit = 12): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters || {}).filter(([_, value]) => value !== undefined)),
    })

    const response = await this.request<PaginatedResponse<Property>>(`/properties?${params}`)
    return response.data
  }

  async getProperty(id: string): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`)
    return response.data
  }

  async createProperty(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
    const response = await this.request<Property>("/properties", {
      method: "POST",
      body: JSON.stringify(property),
    })
    return response.data
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(property),
    })
    return response.data
  }

  async deleteProperty(id: string): Promise<void> {
    await this.request(`/properties/${id}`, {
      method: "DELETE",
    })
  }

  // Users API
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response = await this.request<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`)
    return response.data
  }

  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/users/${id}`)
    return response.data
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const response = await this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
    return response.data
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Auth API
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app this would be an API call
    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    // Mock password validation (in real app, this would be handled by backend)
    const validPasswords: Record<string, string> = {
      "admin@propiedades.com": "admin123",
      "agente@propiedades.com": "agente123",
      "cliente@email.com": "cliente123",
    }

    if (validPasswords[email] !== password) {
      throw new Error("Contraseña incorrecta")
    }

    const token = `mock_token_${user.id}_${Date.now()}`

    return { user, token }
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    // In real app, this would invalidate the token on the server
    localStorage.removeItem("auth_token")
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw new Error("No token found")
    }

    // Extract user ID from mock token
    const userId = token.split("_")[2]
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    return user
  }

  // Contact Messages API
  async getContactMessages(page = 1, limit = 10): Promise<PaginatedResponse<ContactMessage>> {
    const response = await this.request<PaginatedResponse<ContactMessage>>(
      `/contact-messages?page=${page}&limit=${limit}`,
    )
    return response.data
  }

  async createContactMessage(message: Omit<ContactMessage, "id" | "createdAt" | "updatedAt">): Promise<ContactMessage> {
    const response = await this.request<ContactMessage>("/contact-messages", {
      method: "POST",
      body: JSON.stringify(message),
    })
    return response.data
  }

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    const response = await this.request<ContactMessage>(`/contact-messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
    return response.data
  }

  // Statistics API
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>("/stats/dashboard")
    return response.data
  }

  async getPropertyStats(propertyId: string): Promise<PropertyStats> {
    const response = await this.request<PropertyStats>(`/stats/properties/${propertyId}`)
    return response.data
  }

  // Image Upload API
  async uploadImage(file: File, folder = "properties"): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await this.request<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
    return response.data
  }

  // Notifications API
  async getNotifications(page = 1, limit = 10): Promise<PaginatedResponse<Notification>> {
    const response = await this.request<PaginatedResponse<Notification>>(`/notifications?page=${page}&limit=${limit}`)
    return response.data
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, {
      method: "PUT",
    })
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request("/notifications/read-all", {
      method: "PUT",
    })
  }

  // Settings API
  async getSettings(): Promise<AppSettings> {
    const response = await this.request<AppSettings>("/settings")
    return response.data
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const response = await this.request<AppSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
    return response.data
  }

  // Search API with advanced filters
  async searchProperties(
    query: string,
    filters?: SearchFilters,
    page = 1,
    limit = 12,
  ): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters || {}).filter(([_, value]) => value !== undefined)),
    })

    const response = await this.request<PaginatedResponse<Property>>(`/search/properties?${params}`)
    return response.data
  }

  // Favorites API
  async getFavorites(page = 1, limit = 12): Promise<PaginatedResponse<Property>> {
    const response = await this.request<PaginatedResponse<Property>>(`/favorites?page=${page}&limit=${limit}`)
    return response.data
  }

  async addToFavorites(propertyId: string): Promise<void> {
    await this.request(`/favorites/${propertyId}`, {
      method: "POST",
    })
  }

  async removeFromFavorites(propertyId: string): Promise<void> {
    await this.request(`/favorites/${propertyId}`, {
      method: "DELETE",
    })
  }

  async isFavorite(propertyId: string): Promise<boolean> {
    try {
      const response = await this.request<{ isFavorite: boolean }>(`/favorites/${propertyId}/check`)
      return response.data.isFavorite
    } catch {
      return false
    }
  }
}

export const apiService = new ApiService()
