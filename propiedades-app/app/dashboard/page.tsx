"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"

// Mock data - En producción esto vendría de tu API REST
const mockProperties = [
  {
    id: 1,
    name: "Casa Moderna en Las Condes",
    address: "Av. Las Condes 1234, Las Condes, Santiago",
    price: 450000000,
    type: "Casa",
    status: "Disponible",
    createdAt: "2024-01-15",
    owner: "María González",
  },
  {
    id: 2,
    name: "Departamento Vista al Mar",
    address: "Av. del Mar 567, Viña del Mar",
    price: 280000000,
    type: "Departamento",
    status: "Vendido",
    createdAt: "2024-01-10",
    owner: "Carlos Rodríguez",
  },
  {
    id: 3,
    name: "Casa Familiar en Providencia",
    address: "Calle Los Aromos 890, Providencia, Santiago",
    price: 380000000,
    type: "Casa",
    status: "Disponible",
    createdAt: "2024-01-08",
    owner: "Ana Martínez",
  },
  {
    id: 4,
    name: "Penthouse Centro Histórico",
    address: "Plaza de Armas 123, Santiago Centro",
    price: 650000000,
    type: "Penthouse",
    status: "Reservado",
    createdAt: "2024-01-05",
    owner: "Roberto Silva",
  },
  {
    id: 5,
    name: "Casa con Piscina en La Reina",
    address: "Av. Príncipe de Gales 456, La Reina, Santiago",
    price: 520000000,
    type: "Casa",
    status: "Disponible",
    createdAt: "2024-01-03",
    owner: "Patricia López",
  },
  {
    id: 6,
    name: "Loft Industrial Ñuñoa",
    address: "Av. Grecia 789, Ñuñoa, Santiago",
    price: 195000000,
    type: "Loft",
    status: "Disponible",
    createdAt: "2024-01-01",
    owner: "Diego Morales",
  },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProperties = mockProperties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
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
  const totalProperties = mockProperties.length
  const availableProperties = mockProperties.filter((p) => p.status === "Disponible").length
  const soldProperties = mockProperties.filter((p) => p.status === "Vendido").length
  const totalValue = mockProperties.reduce((sum, p) => sum + p.price, 0)
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{property.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{property.owner}</TableCell>
                      <TableCell className="font-medium">{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(property.createdAt).toLocaleDateString("es-CL")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/property/${property.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/edit/${property.id}`}>
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
