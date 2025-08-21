"use client"

import { useState, useEffect } from "react"
import type { Property } from "@/lib/types"
import { mockProperties } from "@/lib/mock-data"
import { PropertiesTable } from "@/components/dashboard/properties-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (searchQuery) {
      const filtered = properties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredProperties(filtered)
    } else {
      setFilteredProperties(properties)
    }
  }, [properties, searchQuery])

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestión de Propiedades</h2>
          <p className="text-muted-foreground">Administra todas las propiedades del sistema</p>
        </div>
        <Link href="/dashboard/propiedades/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busca y filtra propiedades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, ciudad o dirección..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertiesTable properties={filteredProperties} onDelete={handleDeleteProperty} />
        </CardContent>
      </Card>
    </div>
  )
}
