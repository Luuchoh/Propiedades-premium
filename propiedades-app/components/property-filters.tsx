"use client"

import type { PropertyFilters as PropertyFiltersType } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface PropertyFiltersProps {
  filters: PropertyFiltersType
  onFiltersChange: (filters: PropertyFiltersType) => void
  onClearFilters: () => void
}

export function PropertyFilters({ filters, onFiltersChange, onClearFilters }: PropertyFiltersProps) {
  const updateFilter = (key: keyof PropertyFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined)

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Filtros de Búsqueda
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground bg-transparent"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Price Range */}
          <div className="space-y-2">
            <Label htmlFor="priceMin">Precio Mínimo</Label>
            <Input
              id="priceMin"
              type="number"
              placeholder="€ Min"
              value={filters.priceMin || ""}
              onChange={(e) => updateFilter("priceMin", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceMax">Precio Máximo</Label>
            <Input
              id="priceMax"
              type="number"
              placeholder="€ Max"
              value={filters.priceMax || ""}
              onChange={(e) => updateFilter("priceMax", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label>Habitaciones</Label>
            <Select
              value={filters.bedrooms?.toString() || "0"}
              onValueChange={(value) => updateFilter("bedrooms", value ? Number(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Cualquiera</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <Label>Baños</Label>
            <Select
              value={filters.bathrooms?.toString() || "0"}
              onValueChange={(value) => updateFilter("bathrooms", value ? Number(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Cualquiera</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Type */}
          <div className="space-y-2">
            <Label>Tipo de Propiedad</Label>
            <Select
              value={filters.propertyType || "all"}
              onValueChange={(value) => updateFilter("propertyType", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="apartment">Apartamento</SelectItem>
                <SelectItem value="condo">Condominio</SelectItem>
                <SelectItem value="townhouse">Adosado</SelectItem>
                <SelectItem value="land">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              placeholder="Buscar por ciudad"
              value={filters.city || ""}
              onChange={(e) => updateFilter("city", e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="sold">Vendida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
