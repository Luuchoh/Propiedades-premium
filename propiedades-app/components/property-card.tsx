import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface Property {
  id: number
  name: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  type: string
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img src={property.image || "/placeholder.svg"} alt={property.name} className="w-full h-full object-cover" />
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
  )
}
