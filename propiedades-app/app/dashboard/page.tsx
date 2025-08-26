"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Building,
  Users,
  Image,
} from "lucide-react"
import Link from "next/link"
import { useAppStore, AppState, Property, Owner } from "@/store/useAppStore"

// Datos desde el store (API simulada)

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [owners, setOwners] = useState<Record<string, Owner>>({})
  const properties = useAppStore((s: AppState) => s.properties)
  const fetchProperties = useAppStore((s: AppState) => s.fetchProperties)
  const fetchOwnerById = useAppStore((s: AppState) => s.fetchOwnerById)

  // Fetch properties and their owners
  useEffect(() => {
    const loadData = async () => {
      if (!properties.length) {
        await fetchProperties()
      }
      
      // Fetch owners for all properties
      const ownerPromises = properties.map(async (property) => {
        if (property.idOwner && !owners[property.idOwner]) {
          const owner = await fetchOwnerById(property.idOwner)
          if (owner) {
            setOwners(prev => ({
              ...prev,
              [property.idOwner]: owner
            }))
          }
        }
      })
      
      await Promise.all(ownerPromises)
    }
    
    loadData()
  }, [properties.length, fetchOwnerById, fetchProperties, owners, setOwners])

  const filteredProperties = properties.filter((property: Property) => {
    const ownerName = owners[property.idOwner]?.ownerName?.toLowerCase() || ''
    return (
      property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerName.includes(searchTerm.toLowerCase())
    )
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status?: Property["status"]) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800 border-green-200"
      case "Vendido":
        return "bg-red-100 text-red-800 border-red-200"
      case "Reservado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calcular estadísticas
  const totalProperties = properties.length
  const availableProperties = properties.filter((p: Property) => p.status === "Disponible").length
  const soldProperties = properties.filter((p: Property) => p.status === "Vendido").length
  const totalValue = properties.reduce((sum: number, p: Property) => sum + p.price, 0)
  const averagePrice = totalValue / totalProperties

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Dashboard Administrativo</h1>
                <p className="text-sm text-muted-foreground">Gestiona tus propiedades</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" className="bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver sitio público
                </Button>
              </Link>
              <Link href="/dashboard/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Propiedad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">{availableProperties} disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propiedades Vendidas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldProperties}</div>
              <p className="text-xs text-muted-foreground">
                {((soldProperties / totalProperties) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
              <p className="text-xs text-muted-foreground">Valor total del portafolio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(averagePrice)}</div>
              <p className="text-xs text-muted-foreground">Precio promedio por propiedad</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Gestión de Propiedades</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar propiedades..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property: Property) => (
                    <TableRow key={property.idProperty}>
                      <TableCell>
                        <div className="relative w-25 h-12 rounded-lg overflow-hidden">
                          <img
                            src={property.image?.file || "/placeholder.svg"}
                            alt={property.propertyName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{property.propertyName}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{property.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{owners[property.idOwner]?.ownerName || 'Propietario no disponible'}</TableCell>
                      <TableCell className="font-medium">{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(property.createdAt || new Date().toISOString()).toLocaleDateString("es-CL")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/property/${property.idProperty}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/edit/${property.idProperty}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron propiedades</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Intenta ajustar tu búsqueda para encontrar más resultados."
                    : "Comienza agregando tu primera propiedad."}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Propiedad
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
