"use client"

import { useState, useEffect, useMemo } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Home, Filter, Loader2 } from "lucide-react"
import Link from "next/link"

import { Property } from "@/store/useAppStore"
import { formatPrice } from "@/lib/utils"

export default function PropertiesPage() {
  const { properties, loading, error, fetchProperties } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [addressFilter, setAddressFilter] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesName = property.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAddress = property.address.toLowerCase().includes(addressFilter.toLowerCase())
      const min = minPrice ? parseInt(minPrice) : 0
      const max = maxPrice ? parseInt(maxPrice) : Infinity
      const matchesPrice = property.price >= min && property.price <= max

      return matchesName && matchesAddress && matchesPrice
    })
  }, [properties, searchTerm, addressFilter, minPrice, maxPrice])

  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-card-foreground">PropiedadesPremium</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 bg-transparent">
                <DollarSign className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Cargando propiedades...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre de propiedad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="address"
                        placeholder="Filtrar por dirección..."
                        value={addressFilter}
                        onChange={(e) => setAddressFilter(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="minPrice">Precio Mínimo (CLP)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="Ej: 200000000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">Precio Máximo (CLP)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="Ej: 500000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Mostrando {filteredProperties.length} de {properties.length} propiedades
          </p>
        </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <Card key={`${property.idProperty}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={property.image?.file || "/placeholder.svg"}
                        alt={property.propertyName}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{property.propertyType}</Badge>
                    </div>

                    <CardHeader>
                      <h3 className="font-semibold text-lg">{property.propertyName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.address}
                      </p>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{property.rooms}</p>
                          <p className="text-muted-foreground">Habitaciones</p>
                        </div>
                        <div>
                          <p className="font-medium">{property.bathrooms}</p>
                          <p className="text-muted-foreground">Baños</p>
                        </div>
                        <div>
                          <p className="font-medium">{property.area} m²</p>
                          <p className="text-muted-foreground">Área</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Link 
                        href={`/property/${property.idProperty}`} 
                        className="w-full"
                        onClick={() => useAppStore.getState().setSelectedProperty(property)}
                      >
                        <Button className="w-full">Ver Detalles</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No se encontraron propiedades que coincidan con los filtros.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  )
}
