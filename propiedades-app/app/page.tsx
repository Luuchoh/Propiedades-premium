"use client"

import { useState, useEffect } from "react"
import type { Property, PropertyFilters } from "@/lib/types"
import { mockProperties } from "@/lib/mock-data"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters as PropertyFiltersComponent } from "@/components/property-filters"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

  // Filter properties based on filters and search query
  useEffect(() => {
    let filtered = properties

    // Apply filters
    if (filters.priceMin) {
      filtered = filtered.filter((p) => p.price >= filters.priceMin!)
    }
    if (filters.priceMax) {
      filtered = filtered.filter((p) => p.price <= filters.priceMax!)
    }
    if (filters.bedrooms) {
      filtered = filtered.filter((p) => p.details.bedrooms >= filters.bedrooms!)
    }
    if (filters.bathrooms) {
      filtered = filtered.filter((p) => p.details.bathrooms >= filters.bathrooms!)
    }
    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.details.propertyType === filters.propertyType)
    }
    if (filters.city) {
      filtered = filtered.filter((p) => p.location.city.toLowerCase().includes(filters.city!.toLowerCase()))
    }
    if (filters.status) {
      filtered = filtered.filter((p) => p.details.status === filters.status)
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.city.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProperties(filtered)
  }, [properties, filters, searchQuery])

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Propiedades Premium</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <UserMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Encuentra tu Hogar Ideal</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubre las mejores propiedades en venta con la atención personalizada que mereces
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Buscar por título, descripción o ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <PropertyFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">
            Propiedades Disponibles
            <span className="text-muted-foreground text-lg ml-2">
              ({filteredProperties.length} {filteredProperties.length === 1 ? "resultado" : "resultados"})
            </span>
          </h3>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron propiedades</h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar tus filtros de búsqueda para encontrar más resultados
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Limpiar Filtros
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Propiedades Premium. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
