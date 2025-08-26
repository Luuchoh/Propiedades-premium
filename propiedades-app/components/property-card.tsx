import type { Property } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
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

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <Image
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          width={400}
          height={250}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(property.details.status)}>{getStatusText(property.details.status)}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
            {property.details.propertyType === "house" && "Casa"}
            {property.details.propertyType === "apartment" && "Apartamento"}
            {property.details.propertyType === "condo" && "Condominio"}
            {property.details.propertyType === "townhouse" && "Adosado"}
            {property.details.propertyType === "land" && "Terreno"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {property.location.address}, {property.location.city}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{property.description}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.details.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.details.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.details.area}m²</span>
            </div>
          </div>
        </div>

        <div className="text-2xl font-bold text-primary mb-3">{formatPrice(property.price)}</div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/propiedades/${property.id}`} className="w-full">
          <Button className="w-full" variant="default">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
