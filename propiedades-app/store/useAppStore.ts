"use client"

import { create } from "zustand"

export interface Owner {
  idOwner: string
  dni: string
  ownerName: string
  phone: string
  email: string
  birthday: string
  photo?: string
  createdAt?: string
  updateAt?: string
}

export interface Image {
  file: string
}

export interface Property {
  idProperty: string
  idOwner: string
  propertyName: string
  propertyType: string
  address: string
  price: number
  rooms: number
  bathrooms: number
  area: number
  yearConstruction?: number
  annualTax?: number
  monthlyExpenses?: number
  description?: string
  features?: string[]
  image?: Image 
  status?: "Disponible" | "Vendido" | "Reservado"
  createdAt?: string
  updateAt?: string
}

export interface AppState {
  owner: Owner | undefined
  properties: Property[]
  selectedProperty?: Property
  selectedOwner?: Owner
  loading: boolean
  error?: string
  // actions
  fetchProperties: () => Promise<void>
  fetchPropertyById: (id: string) => Promise<Property | undefined>
  fetchOwnerById: (id: string) => Promise<Owner | undefined>
  findOwnerByDni: (dni: string) => Promise<Owner | undefined>
  createOwner: (owner: Omit<Owner, "idOwner">) => Promise<Owner>
  createProperty: (payload: Omit<Property, "idProperty" > ) => Promise<Property>
  setSelectedProperty: (property: Property) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  owner: undefined,
  properties: [],
  selectedProperty: undefined,
  selectedOwner: undefined,
  loading: false,
  error: undefined,

  fetchProperties: async () => {
    set({ loading: true, error: undefined })
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Property/GetAllProperties`, { cache: "no-store" })
      if (!res.ok) throw new Error("Error al obtener propiedades")
      const data = await res.json()
      set({ properties: data as Property[] })
    } catch (e: any) {
      set({ error: e?.message || "Error desconocido" })
    } finally {
      set({ loading: false })
    }
  },

  fetchPropertyById: async (id: string) => {
    set({ loading: true, error: undefined })
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/properties/${id}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Propiedad no encontrada")
      const data = await res.json()
      set({ selectedProperty: data as Property })
      return data as Property
    } catch (e: any) {
      set({ error: e?.message || "Error desconocido" })
      return undefined
    } finally {
      set({ loading: false })
    }
  },

  fetchOwnerById: async (id: string) => {
    set({ loading: true, error: undefined })
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Owner/GetOneOwnerById`,{
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MongoGeneralId: id }),
        cache: "no-store" 
      })
      if (!res.ok) throw new Error("Propietario no encontrado")
      const data = await res.json()
      set({ selectedOwner: data as Owner })
      return data as Owner
    } catch (e: any) {
      set({ error: e?.message || "Error desconocido" })
      return undefined
    } finally {
      set({ loading: false })
    }
  },

  findOwnerByDni: async (dni: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Owner/GetOneOwnerByDNI`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dni: dni }),
      cache: "no-store" 
    })
    if (!res.ok) return undefined
    const data: Owner = await res.json()
    set({ owner: data })
    return data 
  },

  createOwner: async (owner: Omit<Owner, "idOwner">) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}//api/Owner/CreateOwner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( owner ),
    })
    if (!res.ok) throw new Error("No se pudo crear el propietario")
    const data = await res.json()
    return data as Owner
  },

  createProperty: async (property: Omit<Property, "idProperty">) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/Property/CreateProperty`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( property ),
    })
    if (!res.ok) throw new Error("No se pudo crear la propiedad")
    const data = await res.json()
    const created = data as Property
    // update list optimistically
    set({ properties: [created, ...get().properties] })
    return created
  },
  
  setSelectedProperty: (property: Property) => {
    set({ selectedProperty: property })
  },
}))
