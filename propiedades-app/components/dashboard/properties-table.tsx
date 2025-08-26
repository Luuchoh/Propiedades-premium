"use client"

import { useState } from "react"
import type { Property } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PropertiesTableProps {
  properties: Property[]
  onDelete: (id: string) => void
}

export function PropertiesTable({ properties, onDelete }: PropertiesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)

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

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (propertyToDelete) {
      onDelete(propertyToDelete.id)
      setDeleteDialogOpen(false)
      setPropertyToDelete(null)
    }
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron propiedades</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Agente</TableHead>
              <TableHead className="w-16">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium line-clamp-1">{property.title}</p>
                    <p className="text-sm text-muted-foreground">ID: {property.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{property.location.city}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{property.location.address}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{formatPrice(property.price)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(Math.round(property.price / property.details.area))}/m²
                  </p>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>
                      {property.details.bedrooms} hab • {property.details.bathrooms} baños
                    </p>
                    <p className="text-muted-foreground">{property.details.area}m²</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(property.details.status)}>
                    {getStatusText(property.details.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{property.agent.name}</p>
                    <p className="text-xs text-muted-foreground">{property.agent.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/propiedades/${property.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/propiedades/${property.id}/editar`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(property)} className="text-destructive">
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la propiedad "{propertyToDelete?.title}"
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
