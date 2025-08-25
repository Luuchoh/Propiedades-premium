"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { fileToBase64 } from "@/lib/image-utils"

export interface PropertyFormData {
  name: string
  type: string
  address: string
  price: string
  bedrooms: string
  bathrooms: string
  area: string
  yearBuilt?: string
  annualTax?: string
  monthlyExpenses?: string
  description?: string
  features?: string[]
  image?: string | null
  status?: "Disponible" | "Vendido" | "Reservado"
}

const propertyTypes = ["Casa", "Departamento", "Penthouse", "Loft", "Oficina", "Local Comercial"]

export function PropertyForm({
  data,
  onChange,
  onToggleFeature,
  formatPrice,
}: {
  data: PropertyFormData
  onChange: (field: keyof PropertyFormData, value: string | File | null) => Promise<void>
  onToggleFeature: (feature: string) => void
  formatPrice: (value: string) => string
}) {
  const commonFeatures = [
    "Estacionamiento",
    "Jardín",
    "Terraza",
    "Piscina",
    "Gimnasio",
    "Seguridad 24/7",
    "Ascensor",
    "Calefacción central",
    "Aire acondicionado",
    "Cocina equipada",
    "Bodega",
    "Portón automático",
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre de la Propiedad *</Label>
          <Input
            id="name"
            placeholder="Ej: Casa Moderna en Las Condes"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo de Propiedad *</Label>
          <Select value={data.type} onValueChange={(value) => onChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Dirección Completa *</Label>
        <Input
          id="address"
          placeholder="Ej: Av. Las Condes 1234, Las Condes, Santiago"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="price">Precio (COP) *</Label>
          <Input
            id="price"
            placeholder="450000000"
            value={data.price}
            onChange={(e) => onChange("price", e.target.value.replace(/\D/g, ""))}
          />
          {data.price && (
            <p className="text-xs text-muted-foreground mt-1">{formatPrice(data.price)} COP</p>
          )}
        </div>
        <div>
          <Label htmlFor="bedrooms">Dormitorios *</Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="4"
            value={data.bedrooms}
            onChange={(e) => onChange("bedrooms", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Baños *</Label>
          <Input
            id="bathrooms"
            type="number"
            placeholder="3"
            value={data.bathrooms}
            onChange={(e) => onChange("bathrooms", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="area">Área (m²) *</Label>
          <Input
            id="area"
            type="number"
            placeholder="180"
            value={data.area}
            onChange={(e) => onChange("area", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="yearBuilt">Año de Construcción</Label>
          <Input
            id="yearBuilt"
            type="number"
            placeholder="2020"
            value={data.yearBuilt}
            onChange={(e) => onChange("yearBuilt", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="propertyTax">Impuesto Predial Anual (COP)</Label>
          <Input
            id="propertyTax"
            placeholder="2500000"
            value={data.annualTax}
            onChange={(e) => onChange("annualTax", e.target.value.replace(/\D/g, ""))}
          />
          {data.annualTax && (
            <p className="text-xs text-muted-foreground mt-1">{formatPrice(data.annualTax)} COP</p>
          )}
        </div>
        <div>
          <Label htmlFor="maintenanceFee">Gastos Comunes (COP)</Label>
          <Input
            id="maintenanceFee"
            placeholder="150000"
            value={data.monthlyExpenses}
            onChange={(e) => onChange("monthlyExpenses", e.target.value.replace(/\D/g, ""))}
          />
          {data.monthlyExpenses && (
            <p className="text-xs text-muted-foreground mt-1">{formatPrice(data.monthlyExpenses)} COP</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          placeholder="Describe las características principales de la propiedad..."
          rows={4}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Características</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {["Estacionamiento","Jardín","Terraza","Piscina","Gimnasio","Seguridad 24/7","Ascensor","Calefacción central","Aire acondicionado","Cocina equipada","Bodega","Portón automático"].map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => onToggleFeature(feature)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                data.features?.includes(feature)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Imagen de la Propiedad</Label>
        <ImageUpload
          onImageChange={async (file) => {
            if (file) {
              const imgBase64 = await fileToBase64(file);
              await onChange("image", imgBase64);
            } else {
              await onChange("image", null);
            }
          }}
          currentImage={data.image || null}
          placeholder="Sube una imagen de la propiedad"
          maxSize={5}
          className="mt-2"
        />
      </div>
    </div>
  )
}
