import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface PropertyFeaturesProps {
  features: string[]
}

export function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Características Destacadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
