"use client"

import { useState } from "react"
import type { User as UserType } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { MoreHorizontal, Edit, Trash2, Shield, Briefcase } from "lucide-react"
import { User } from "lucide-react" // Import User icon

interface UsersTableProps {
  users: UserType[]
  onDelete: (id: string) => void
  onUpdate: (user: UserType) => void
}

export function UsersTable({ users, onDelete, onUpdate }: UsersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)

  const getRoleIcon = (role: UserType["role"]) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "agent":
        return <Briefcase className="h-4 w-4" />
      case "client":
        return <User className="h-4 w-4" /> // Use User icon here
      default:
        return <User className="h-4 w-4" /> // Use User icon here
    }
  }

  const getRoleText = (role: UserType["role"]) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "agent":
        return "Agente"
      case "client":
        return "Cliente"
      default:
        return role
    }
  }

  const getRoleColor = (role: UserType["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "agent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "client":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete.id)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron usuarios</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead className="w-16">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{user.email}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{user.phone || "No especificado"}</p>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(user.role)}
                      <span>{getRoleText(user.role)}</span>
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(user)} className="text-destructive">
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario "{userToDelete?.name}" del
              sistema.
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
