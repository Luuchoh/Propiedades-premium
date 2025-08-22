"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Home, User, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"

interface PropertyFormData {
  name: string
  address: string
  price: string
  bedrooms: string
  bathrooms: string
  area: string
  type: string
  description: string
  features: string[]
  yearBuilt: string
  propertyTax: string
  maintenanceFee: string
  image: File | null
}

interface OwnerFormData {
  name: string
  phone: string
  email: string
  yearsExperience: string
  propertiesSold: string
  avatar: File | null
}

const propertyTypes = ["Casa", "Departamento", "Penthouse", "Loft", "Oficina", "Local Comercial"]

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

export default function CreatePropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    name: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    type: "",
    description: "",
    features: [],
    yearBuilt: "",
    propertyTax: "",
    maintenanceFee: "",
    image: null,
  })

  const [ownerData, setOwnerData] = useState<OwnerFormData>({
    name: "",
    phone: "",
    email: "",
    yearsExperience: "",
    propertiesSold: "",
    avatar: null,
  })

  const handlePropertyChange = (field: keyof PropertyFormData, value: string | File | null) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOwnerChange = (field: keyof OwnerFormData, value: string | File | null) => {
    setOwnerData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleFeature = (feature: string) => {
    setPropertyData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const validatePropertyForm = () => {
    const required = ["name", "address", "price", "bedrooms", "bathrooms", "area", "type", "description"]
    return required.every((field) => propertyData[field as keyof PropertyFormData])
  }

  const validateOwnerForm = () => {
    const required = ["name", "phone", "email"]
    return required.every((field) => ownerData[field as keyof OwnerFormData])
  }

  const handleSubmit = async () => {
    if (!validatePropertyForm() || !validateOwnerForm()) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    setIsSubmitting(true)

    try {
      // Aquí se conectará con tu API REST personalizada
      const formData = new FormData()

      // Datos de la propiedad
      Object.entries(propertyData).forEach(([key, value]) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(value))
        } else if (key === "image" && value instanceof File) {
          formData.append("propertyImage", value)
        } else if (value !== null && typeof value === "string") {
          formData.append(key, value)
        }
      })

      // Datos del propietario
      Object.entries(ownerData).forEach(([key, value]) => {
        if (key === "avatar" && value instanceof File) {
          formData.append("ownerAvatar", value)
        } else if (value !== null && typeof value === "string") {
          formData.append(`owner_${key}`, value)
        }
      })

      // Simulación de llamada a API
      console.log("Datos a enviar a la API:", {
        property: propertyData,
        owner: ownerData,
      })

      // TODO: Reemplazar con llamada real a tu API REST
      // const response = await fetch('/api/properties', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulación de éxito
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Propiedad creada exitosamente!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al crear la propiedad:", error)
      alert("Error al crear la propiedad. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (value: string) => {
    const number = value.replace(/\D/g, "")
    return new Intl.NumberFormat("es-CL").format(Number(number))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-card-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver al Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant={currentStep >= 1 ? "default" : "outline"} className="gap-1">
                <Home className="h-3 w-3" />
                Propiedad
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant={currentStep >= 2 ? "default" : "outline"} className="gap-1">
                <User className="h-3 w-3" />
                Propietario
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Información de la Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre de la Propiedad *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Casa Moderna en Las Condes"
                    value={propertyData.name}
                    onChange={(e) => handlePropertyChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Propiedad *</Label>
                  <Select value={propertyData.type} onValueChange={(value) => handlePropertyChange("type", value)}>
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
                  value={propertyData.address}
                  onChange={(e) => handlePropertyChange("address", e.target.value)}
                />
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Precio (CLP) *</Label>
                  <Input
                    id="price"
                    placeholder="450000000"
                    value={propertyData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      handlePropertyChange("price", value)
                    }}
                  />
                  {propertyData.price && (
                    <p className="text-xs text-muted-foreground mt-1">{formatPrice(propertyData.price)} CLP</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bedrooms">Dormitorios *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="4"
                    value={propertyData.bedrooms}
                    onChange={(e) => handlePropertyChange("bedrooms", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Baños *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="3"
                    value={propertyData.bathrooms}
                    onChange={(e) => handlePropertyChange("bathrooms", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="area">Área (m²) *</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="180"
                    value={propertyData.area}
                    onChange={(e) => handlePropertyChange("area", e.target.value)}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yearBuilt">Año de Construcción</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    placeholder="2020"
                    value={propertyData.yearBuilt}
                    onChange={(e) => handlePropertyChange("yearBuilt", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="propertyTax">Contribuciones Anuales (CLP)</Label>
                  <Input
                    id="propertyTax"
                    placeholder="2500000"
                    value={propertyData.propertyTax}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      handlePropertyChange("propertyTax", value)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="maintenanceFee">Gastos Comunes (CLP)</Label>
                  <Input
                    id="maintenanceFee"
                    placeholder="150000"
                    value={propertyData.maintenanceFee}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      handlePropertyChange("maintenanceFee", value)
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe las características principales de la propiedad..."
                  rows={4}
                  value={propertyData.description}
                  onChange={(e) => handlePropertyChange("description", e.target.value)}
                />
              </div>

              {/* Features */}
              <div>
                <Label>Características</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {commonFeatures.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        propertyData.features.includes(feature)
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
                  onImageChange={(file) => handlePropertyChange("image", file)}
                  currentImage={propertyData.image}
                  placeholder="Sube una imagen de la propiedad"
                  maxSize={5}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)} disabled={!validatePropertyForm()} className="gap-2">
                  Siguiente: Información del Propietario
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Propietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Owner Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">Nombre Completo *</Label>
                  <Input
                    id="ownerName"
                    placeholder="Ej: María González"
                    value={ownerData.name}
                    onChange={(e) => handleOwnerChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ownerPhone">Teléfono *</Label>
                  <Input
                    id="ownerPhone"
                    placeholder="+56 9 1234 5678"
                    value={ownerData.phone}
                    onChange={(e) => handleOwnerChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ownerEmail">Correo Electrónico *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="maria.gonzalez@email.com"
                  value={ownerData.email}
                  onChange={(e) => handleOwnerChange("email", e.target.value)}
                />
              </div>

              {/* Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsExperience">Años de Experiencia</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    placeholder="8"
                    value={ownerData.yearsExperience}
                    onChange={(e) => handleOwnerChange("yearsExperience", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="propertiesSold">Propiedades Vendidas</Label>
                  <Input
                    id="propertiesSold"
                    type="number"
                    placeholder="45"
                    value={ownerData.propertiesSold}
                    onChange={(e) => handleOwnerChange("propertiesSold", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Foto del Propietario</Label>
                <ImageUpload
                  onImageChange={(file) => handleOwnerChange("avatar", file)}
                  currentImage={ownerData.avatar}
                  placeholder="Sube una foto del propietario"
                  maxSize={2}
                  className="mt-2"
                />
              </div>

              <Separator />

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Resumen de la Propiedad</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span>{propertyData.name}</span>
                  <span className="text-muted-foreground">Tipo:</span>
                  <span>{propertyData.type}</span>
                  <span className="text-muted-foreground">Precio:</span>
                  <span>{formatPrice(propertyData.price)} CLP</span>
                  <span className="text-muted-foreground">Propietario:</span>
                  <span>{ownerData.name}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a Propiedad
                </Button>
                <Button onClick={handleSubmit} disabled={!validateOwnerForm() || isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Crear Propiedad
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
