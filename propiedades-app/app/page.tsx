"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Home, Filter } from "lucide-react"
import Link from "next/link"

// Mock data - En producción esto vendría de tu API REST
const mockProperties = [
  {
    id: 1,
    name: "Casa Moderna en Las Condes",
    address: "Av. Las Condes 1234, Las Condes, Santiago",
    price: 450000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: "/modern-house-exterior.png",
    type: "Casa",
    owner: {
      name: "María González",
      phone: "+56 9 1234 5678",
      email: "maria.gonzalez@email.com",
    },
  },
  {
    id: 2,
    name: "Departamento Vista al Mar",
    address: "Av. del Mar 567, Viña del Mar",
    price: 280000000,
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    image: "/ocean-view-apartment.png",
    type: "Departamento",
    owner: {
      name: "Carlos Rodríguez",
      phone: "+56 9 8765 4321",
      email: "carlos.rodriguez@email.com",
    },
  },
  {
    id: 3,
    name: "Casa Familiar en Providencia",
    address: "Calle Los Aromos 890, Providencia, Santiago",
    price: 380000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: "/family-house-garden.png",
    type: "Casa",
    owner: {
      name: "Ana Martínez",
      phone: "+56 9 5555 6666",
      email: "ana.martinez@email.com",
    },
  },
  {
    id: 4,
    name: "Penthouse Centro Histórico",
    address: "Plaza de Armas 123, Santiago Centro",
    price: 650000000,
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    image: "/luxury-penthouse-interior.png",
    type: "Penthouse",
    owner: {
      name: "Roberto Silva",
      phone: "+56 9 7777 8888",
      email: "roberto.silva@email.com",
    },
  },
  {
    id: 5,
    name: "Casa con Piscina en La Reina",
    address: "Av. Príncipe de Gales 456, La Reina, Santiago",
    price: 520000000,
    bedrooms: 5,
    bathrooms: 4,
    area: 250,
    image: "/house-with-pool.png",
    type: "Casa",
    owner: {
      name: "Patricia López",
      phone: "+56 9 3333 4444",
      email: "patricia.lopez@email.com",
    },
  },
  {
    id: 6,
    name: "Loft Industrial Ñuñoa",
    address: "Av. Grecia 789, Ñuñoa, Santiago",
    price: 195000000,
    bedrooms: 1,
    bathrooms: 1,
    area: 75,
    image: "/industrial-loft.png",
    type: "Loft",
    owner: {
      name: "Diego Morales",
      phone: "+56 9 9999 0000",
      email: "diego.morales@email.com",
    },
  },
]

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [addressFilter, setAddressFilter] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const matchesName = property.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAddress = property.address.toLowerCase().includes(addressFilter.toLowerCase())
      const matchesMinPrice = !minPrice || property.price >= Number.parseInt(minPrice)
      const matchesMaxPrice = !maxPrice || property.price <= Number.parseInt(maxPrice)

      return matchesName && matchesAddress && matchesMinPrice && matchesMaxPrice
    })
  }, [searchTerm, addressFilter, minPrice, maxPrice])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

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
            Mostrando {filteredProperties.length} de {mockProperties.length} propiedades
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{property.type}</Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{property.name}</CardTitle>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm line-clamp-1">{property.address}</p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{property.bedrooms} dormitorios</span>
                    <span>{property.bathrooms} baños</span>
                    <span>{property.area} m²</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/property/${property.id}`} className="w-full">
                  <Button className="w-full">Ver Detalles</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron propiedades</h3>
            <p className="text-muted-foreground">
              Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
