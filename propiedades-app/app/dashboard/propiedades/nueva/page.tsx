"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PropertyForm } from "@/components/dashboard/property-form"
import type { Property } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      console.log("Creating property:", propertyData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to properties list
      router.push("/dashboard/propiedades")
    } catch (error) {
      console.error("Error creating property:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/propiedades">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Nueva Propiedad</h2>
          <p className="text-muted-foreground">Añade una nueva propiedad al sistema</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Propiedad</CardTitle>
          <CardDescription>Completa todos los campos para crear la propiedad</CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
