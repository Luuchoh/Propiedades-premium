"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"

// Generic hook for API calls with loading and error states
export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Hook for properties with filters
export function useProperties(filters?: any, page = 1, limit = 12) {
  return useApi(() => apiService.getProperties(filters, page, limit), [JSON.stringify(filters), page, limit])
}

// Hook for single property
export function useProperty(id: string) {
  return useApi(() => apiService.getProperty(id), [id])
}

// Hook for users
export function useUsers(page = 1, limit = 10) {
  return useApi(() => apiService.getUsers(page, limit), [page, limit])
}

// Hook for dashboard stats
export function useDashboardStats() {
  return useApi(() => apiService.getDashboardStats(), [])
}

// Hook for notifications
export function useNotifications(page = 1, limit = 10) {
  return useApi(() => apiService.getNotifications(page, limit), [page, limit])
}

// Hook for favorites
export function useFavorites(page = 1, limit = 12) {
  return useApi(() => apiService.getFavorites(page, limit), [page, limit])
}

// Hook for checking if property is favorite
export function useIsFavorite(propertyId: string) {
  return useApi(() => apiService.isFavorite(propertyId), [propertyId])
}
