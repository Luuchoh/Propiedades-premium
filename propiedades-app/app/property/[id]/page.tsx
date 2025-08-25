"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Home,
  Bath,
  Bed,
  Square,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Heart,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import type { AppState } from "@/store/useAppStore"
import { formatPrice, getInitials } from "@/lib/utils"

// Data se obtiene desde el store (fetchPropertyById)

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const { selectedProperty: property, selectedOwner: owner, fetchOwnerById, loading, error } = useAppStore((s: AppState) => ({
    selectedProperty: s.selectedProperty,
    selectedOwner: s.selectedOwner,
    fetchOwnerById: s.fetchOwnerById,
    loading: s.loading,
    error: s.error,
  }))

  // Cargar el propietario cuando la propiedad esté disponible
  useEffect(() => {
    if (property?.idOwner) {
      fetchOwnerById(property.idOwner)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Cargando propiedad...</h2>
        </div>
      </div>
    )
  }

  if (!property || property.idProperty !== propertyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Propiedad no encontrada</h2>
          <p className="text-muted-foreground mb-4">La propiedad que buscas no existe o ha sido removida.</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  
  const images = property.image

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-card-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver a propiedades</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={images?.file || "/placeholder.svg"}
                  alt={`${property.propertyName} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{property.propertyType}</Badge>
              </div>
              {/* {images?.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {images?.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index ? "border-primary" : "border-border"
                        }`}
                      >
                        <img
                          src={image.file || "/placeholder.svg"}
                          alt={`Vista ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )} */}
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.propertyName}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{formatPrice(property.price)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.rooms}</span>
                    <span className="text-sm text-muted-foreground">dormitorios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="text-sm text-muted-foreground">baños</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.area}</span>
                    <span className="text-sm text-muted-foreground">m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.yearConstruction ?? "—"}</span>
                    <span className="text-sm text-muted-foreground">año</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.description || "Sin descripción."}</p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(property.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Financiera</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{formatPrice(property.price)}</div>
                    <div className="text-sm text-muted-foreground">Precio de venta</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Home className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{formatPrice(property.annualTax ?? 0)}</div>
                    <div className="text-sm text-muted-foreground">Impuesto anual</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{formatPrice(property.monthlyExpenses ?? 0)}</div>
                    <div className="text-sm text-muted-foreground">Gastos mensuales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Owner Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Propietario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage 
                      src={owner?.photo ? 
                        (owner.photo.startsWith('data:image/') ? 
                          owner.photo : 
                          `data:image/jpeg;base64,${owner.photo}`) : 
                        "/placeholder.svg"} 
                      alt={owner?.ownerName} 
                    />
                    <AvatarFallback className="text-lg">{getInitials(owner?.ownerName || "")}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{owner?.ownerName}</h3>
                  <p className="text-sm text-muted-foreground">Propietario</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{owner?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{owner?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{owner?.birthday ?? "—"} Cumpleaños</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar ahora
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar visita
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Solicitar financiamiento
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir propiedad
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
