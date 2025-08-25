"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"

export function OwnerLookup({
  onFound,
  onCreateNew,
}: {
  onFound: (owner: any) => void
  onCreateNew: (dni: string) => void
}) {
  const [dni, setDni] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const findOwnerByDni = useAppStore((s) => s.findOwnerByDni)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const owner = await findOwnerByDni(dni)
      console.log("owner")
      console.log(owner)
      console.log(owner?.idOwner)
      if (owner) onFound(owner)
      else setError("No se encontró un propietario con ese DNI")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="">
        <Label htmlFor="dni">Buscar por DNI</Label>
        <Input id="dni" placeholder="11111111-1" value={dni} onChange={(e) => setDni(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSearch} disabled={!dni || loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
        <Button variant="outline" onClick={() => onCreateNew(dni)} className="bg-transparent">
          Registrar nuevo propietario
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
