"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Property } from "@/lib/types"
import { mockProperties } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PropertyImageGallery } from "@/components/property-image-gallery"
import { PropertyDetails } from "@/components/property-details"
import { AgentContact } from "@/components/agent-contact"
import { PropertyFeatures } from "@/components/property-features"
import { ArrowLeft, MapPin, Calendar, Share2, Heart } from "lucide-react"
import Link from "next/link"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const propertyId = params.id as string
    // In a real app, this would be an API call
    const foundProperty = mockProperties.find((p) => p.id === propertyId)
    setProperty(foundProperty || null)
    setLoading(false)
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: Property["details"]["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "sold":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusText = (status: Property["details"]["status"]) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "pending":
        return "Pendiente"
      case "sold":
        return "Vendida"
      default:
        return status
    }
  }

  const getPropertyTypeText = (type: Property["details"]["propertyType"]) => {
    switch (type) {
      case "house":
        return "Casa"
      case "apartment":
        return "Apartamento"
      case "condo":
        return "Condominio"
      case "townhouse":
        return "Adosado"
      case "land":
        return "Terreno"
      default:
        return type
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real app, this would save to user preferences or API
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold mb-2">Propiedad no encontrada</h1>
          <p className="text-muted-foreground mb-4">La propiedad que buscas no existe o ha sido eliminada.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a propiedades
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                {isFavorite ? "Guardado" : "Guardar"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getStatusColor(property.details.status)}>
                  {getStatusText(property.details.status)}
                </Badge>
                <Badge variant="secondary">{getPropertyTypeText(property.details.propertyType)}</Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">
                  {property.location.address}, {property.location.city}, {property.location.state}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary mb-2">{formatPrice(property.price)}</div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Publicado {new Date(property.createdAt).toLocaleDateString("es-ES")}</span>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <PropertyImageGallery images={property.images} title={property.title} />

            {/* Property Details */}
            <PropertyDetails property={property} />

            {/* Features */}
            <PropertyFeatures features={property.features} />

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{property.location.address}</p>
                  <p className="text-muted-foreground">
                    {property.location.city}, {property.location.state} {property.location.zipCode}
                  </p>
                  {/* In a real app, you would integrate with Google Maps or similar */}
                  <div className="bg-muted rounded-lg h-64 flex items-center justify-center mt-4">
                    <p className="text-muted-foreground">Mapa interactivo (próximamente)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Contact */}
            <AgentContact agent={property.agent} propertyId={property.id} />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Información Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Precio por m²</p>
                    <p className="font-semibold">
                      {formatPrice(Math.round(property.price / property.details.area))}/m²
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Año construcción</p>
                    <p className="font-semibold">{property.details.yearBuilt || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estado</p>
                    <p className="font-semibold">{getStatusText(property.details.status)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tipo</p>
                    <p className="font-semibold">{getPropertyTypeText(property.details.propertyType)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Propiedades Similares</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Próximamente mostraremos propiedades similares en la zona.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
