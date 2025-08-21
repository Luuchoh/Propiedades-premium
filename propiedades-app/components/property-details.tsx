import type { Property } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Bath, Square, Calendar, Home } from "lucide-react"

interface PropertyDetailsProps {
  property: Property
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Home className="h-5 w-5 mr-2" />
          Detalles de la Propiedad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <Bed className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{property.details.bedrooms}</p>
            <p className="text-sm text-muted-foreground">
              {property.details.bedrooms === 1 ? "Habitación" : "Habitaciones"}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <Bath className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{property.details.bathrooms}</p>
            <p className="text-sm text-muted-foreground">{property.details.bathrooms === 1 ? "Baño" : "Baños"}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <Square className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{property.details.area}</p>
            <p className="text-sm text-muted-foreground">m² construidos</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{property.details.yearBuilt || "N/A"}</p>
            <p className="text-sm text-muted-foreground">Año construcción</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Tipo de propiedad</p>
              <p className="font-semibold">{getPropertyTypeText(property.details.propertyType)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Estado</p>
              <p className="font-semibold">
                {property.details.status === "available" && "Disponible"}
                {property.details.status === "pending" && "Pendiente"}
                {property.details.status === "sold" && "Vendida"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Precio por m²</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                }).format(Math.round(property.price / property.details.area))}
                /m²
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Código de propiedad</p>
              <p className="font-semibold">#{property.id.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
