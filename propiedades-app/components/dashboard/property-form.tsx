"use client"

import type React from "react"

import { useState } from "react"
import type { Property } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => void
  loading?: boolean
}

export function PropertyForm({ property, onSubmit, loading = false }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || 0,
    location: {
      address: property?.location.address || "",
      city: property?.location.city || "",
      state: property?.location.state || "",
      zipCode: property?.location.zipCode || "",
    },
    details: {
      bedrooms: property?.details.bedrooms || 1,
      bathrooms: property?.details.bathrooms || 1,
      area: property?.details.area || 0,
      yearBuilt: property?.details.yearBuilt || new Date().getFullYear(),
      propertyType: property?.details.propertyType || ("house" as const),
      status: property?.details.status || ("available" as const),
    },
    features: property?.features || [],
    agent: property?.agent || {
      id: "agent1",
      name: "María González",
      email: "maria@propiedades.com",
      phone: "+34 600 123 456",
      avatar: "/professional-woman-diverse.png",
    },
  })

  const [newFeature, setNewFeature] = useState("")

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const propertyData: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      images: property?.images || ["/placeholder.svg"],
    }

    onSubmit(propertyData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ej: Casa moderna en zona residencial"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe la propiedad en detalle..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio (€)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", Number(e.target.value))}
              placeholder="450000"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.location.address}
              onChange={(e) => handleInputChange("location.address", e.target.value)}
              placeholder="Calle Los Robles 123"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => handleInputChange("location.city", e.target.value)}
                placeholder="Madrid"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Provincia/Estado</Label>
              <Input
                id="state"
                value={formData.location.state}
                onChange={(e) => handleInputChange("location.state", e.target.value)}
                placeholder="Madrid"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Código Postal</Label>
              <Input
                id="zipCode"
                value={formData.location.zipCode}
                onChange={(e) => handleInputChange("location.zipCode", e.target.value)}
                placeholder="28001"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Propiedad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Habitaciones</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.details.bedrooms}
                onChange={(e) => handleInputChange("details.bedrooms", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Baños</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.details.bathrooms}
                onChange={(e) => handleInputChange("details.bathrooms", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                type="number"
                min="0"
                value={formData.details.area}
                onChange={(e) => handleInputChange("details.area", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Año de construcción</Label>
              <Input
                id="yearBuilt"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.details.yearBuilt}
                onChange={(e) => handleInputChange("details.yearBuilt", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Tipo de Propiedad</Label>
              <Select
                value={formData.details.propertyType}
                onValueChange={(value) => handleInputChange("details.propertyType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="condo">Condominio</SelectItem>
                  <SelectItem value="townhouse">Adosado</SelectItem>
                  <SelectItem value="land">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.details.status}
                onValueChange={(value) => handleInputChange("details.status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="sold">Vendida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Añadir característica..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 hover:bg-transparent"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {property ? "Actualizando..." : "Creando..."}
            </>
          ) : property ? (
            "Actualizar Propiedad"
          ) : (
            "Crear Propiedad"
          )}
        </Button>
      </div>
    </form>
  )
}
