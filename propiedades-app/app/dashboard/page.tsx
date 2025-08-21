"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { Building, Users, TrendingUp, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    totalUsers: 0,
    recentViews: 0,
  })

  useEffect(() => {
    // Calculate stats from mock data
    const availableProperties = mockProperties.filter((p) => p.details.status === "available").length

    setStats({
      totalProperties: mockProperties.length,
      availableProperties,
      totalUsers: mockUsers.length,
      recentViews: 127, // Mock data
    })
  }, [])

  const recentProperties = mockProperties.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Bienvenido, {user?.name}</h2>
        <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad inmobiliaria</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">{stats.availableProperties} disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+2 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vistas Recientes</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentViews}</div>
            <p className="text-xs text-muted-foreground">+12% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Propiedades Recientes</CardTitle>
              <CardDescription>Las últimas propiedades añadidas al sistema</CardDescription>
            </div>
            <Link href="/dashboard/propiedades">
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {property.location.city} • {property.details.bedrooms} hab • {property.details.area}m²
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                    }).format(property.price)}
                  </p>
                  <Badge variant={property.details.status === "available" ? "default" : "secondary"} className="mt-1">
                    {property.details.status === "available" ? "Disponible" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Tareas comunes que puedes realizar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/propiedades/nueva">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Nueva Propiedad</span>
              </Button>
            </Link>
            <Link href="/dashboard/usuarios">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Users className="h-6 w-6" />
                <span>Gestionar Usuarios</span>
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Eye className="h-6 w-6" />
                <span>Ver Sitio Web</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
