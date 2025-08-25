"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Home, User, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { OwnerLookup } from "@/components/forms/OwnerLookup"
import { OwnerForm, OwnerFormData } from "@/components/forms/OwnerForm"
import { PropertyForm, PropertyFormData } from "@/components/forms/PropertyForm"
import { useAppStore, Owner as StoreOwner, Property as StoreProperty, Image } from "@/store/useAppStore"

// Using PropertyFormData and OwnerFormData types from shared form components

export default function CreatePropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createProperty = useAppStore((s) => s.createProperty)
  const createOwner = useAppStore((s) => s.createOwner)

  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    name: "",
    type: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    features: [],
    yearBuilt: "",
    annualTax: "",
    monthlyExpenses: "",
    image: undefined,
  })

  const [ownerData, setOwnerData] = useState<OwnerFormData>({
    dni: "",
    name: "",
    phone: "",
    email: "",
    birthday: "",
    photo: null,
  })

  const [ownerMode, setOwnerMode] = useState<"lookup" | "create">("lookup")
  const [selectedOwner, setSelectedOwner] = useState<StoreOwner | null>(null)
  
  const handlePropertyChange = async (field: keyof PropertyFormData, value: string | File | null) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOwnerChange = async (field: keyof OwnerFormData, value: string | File | null) => {
    setOwnerData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleFeature = (feature: string) => {
    setPropertyData((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features || [], feature],
    }))
  }

  const validatePropertyForm = () => {
    const required = ["name", "address", "price", "bedrooms", "bathrooms", "area", "type", "description"]
    return required.every((field) => propertyData[field as keyof PropertyFormData])
  }

  const validateOwnerForm = () => {
    const required = ["dni", "name", "phone", "email", "birthday"]
    return required.every((field) => ownerData[field as keyof OwnerFormData])
  }

  const isOwnerReady = selectedOwner !== null || validateOwnerForm()

  const handleSubmit = async () => {
    if (!validatePropertyForm() || !isOwnerReady) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    setIsSubmitting(true)

    try {
      let createdOwner: StoreOwner | null = selectedOwner

      if (ownerMode === "create") {
        let ownerDataToSend: Omit<StoreOwner, "idOwner"> | null = null
        if (!selectedOwner) {
          ownerDataToSend = {
            dni: ownerData.dni,
            ownerName: ownerData.name,
            phone: ownerData.phone,
            email: ownerData.email,
            birthday: ownerData.birthday,
            photo: ownerData.photo  || undefined,
          }
        }
        createdOwner = ownerDataToSend ? await createOwner(ownerDataToSend) : null
        
        if(!createdOwner){
          alert("Error al crear el propietario")
          return
        }
      }

      if(!createdOwner){
        alert("Falla al encontrar el propietario")
        return
      }
      
      const propertyPayload: Omit<StoreProperty, "idProperty"> & { ownerDni?: string } = {
        idOwner: createdOwner.idOwner,
        propertyName: propertyData.name,
        propertyType: propertyData.type,
        address: propertyData.address,
        price: Number(propertyData.price || 0),
        rooms: Number(propertyData.bedrooms || 0),
        bathrooms: Number(propertyData.bathrooms || 0),
        area: Number(propertyData.area || 0),
        description: propertyData.description,
        features: propertyData.features,
        yearConstruction: propertyData.yearBuilt ? Number(propertyData.yearBuilt) : undefined,
        annualTax: propertyData.annualTax ? Number(propertyData.annualTax) : undefined,
        monthlyExpenses: propertyData.monthlyExpenses ? Number(propertyData.monthlyExpenses) : undefined,
        image: propertyData.image ? {
          file: propertyData.image
        } : undefined,
        status: "Disponible" as const,
      }

      const created = await createProperty(propertyPayload)
      router.push(`/property/${created.idProperty}`)
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
                <User className="h-3 w-3" />
                Propietario
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant={currentStep >= 2 ? "default" : "outline"} className="gap-1">
                <Home className="h-3 w-3" />
                Propiedad
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
                <User className="h-5 w-5" />
                Información del Propietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedOwner ? (
                <>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Propietario seleccionado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span>{selectedOwner.ownerName}</span>
                      <span className="text-muted-foreground">DNI:</span>
                      <span>{selectedOwner.dni}</span>
                      <span className="text-muted-foreground">Teléfono:</span>
                      <span>{selectedOwner.phone}</span>
                      <span className="text-muted-foreground">Correo:</span>
                      <span>{selectedOwner.email}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedOwner(null)
                        setOwnerMode("lookup")
                      }}
                    >
                      Buscar otro propietario
                    </Button>
                    <Button onClick={() => setCurrentStep(2)} className="gap-2">
                      Siguiente: Información de la Propiedad
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : ownerMode === "lookup" ? (
                <OwnerLookup
                  onFound={(owner) => {
                    setSelectedOwner(owner)
                  }}
                  onCreateNew={(dni) => {
                    setOwnerMode("create")
                    setOwnerData((prev) => ({ ...prev, dni }))
                  }}
                />
              ) : (
                <>
                  <OwnerForm data={ownerData} onChange={handleOwnerChange} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setOwnerMode("lookup")}>Volver a búsqueda</Button>
                    <Button onClick={() => setCurrentStep(2)} disabled={!validateOwnerForm()} className="gap-2">
                      Siguiente: Información de la Propiedad
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Información de la Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PropertyForm
                data={propertyData}
                onChange={handlePropertyChange}
                onToggleFeature={toggleFeature}
                formatPrice={formatPrice}
              />

              <Separator />

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Resumen del Propietario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span>{selectedOwner ? selectedOwner.ownerName : ownerData.name}</span>
                  <span className="text-muted-foreground">DNI:</span>
                  <span>{selectedOwner ? selectedOwner.dni : ownerData.dni}</span>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span>{selectedOwner ? selectedOwner.phone : ownerData.phone}</span>
                  <span className="text-muted-foreground">Correo:</span>
                  <span>{selectedOwner ? selectedOwner.email : ownerData.email}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a Propietario
                </Button>
                <Button onClick={handleSubmit}  className="gap-2">
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
