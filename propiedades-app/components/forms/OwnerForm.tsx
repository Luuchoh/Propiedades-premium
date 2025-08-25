"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { fileToBase64 } from "@/lib/image-utils"

export interface OwnerFormData {
  dni: string
  name: string
  phone: string
  email: string
  birthday: string
  photo?: string | null
}

export function OwnerForm({
  data,
  onChange,
}: {
  data: OwnerFormData
  onChange: (field: keyof OwnerFormData, value: string | File | null) => Promise<void>
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            placeholder="Ej: María González"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ownerDni">DNI *</Label>
          <Input
            id="dni"
            placeholder="11111111-1"
            value={data.dni}
            onChange={(e) => onChange("dni", e.target.value)}
          />
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            placeholder="+56 9 1234 5678"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@dominio.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthday">Fecha de Cumpleaños *</Label>
          <Input
            id="birthday"
            placeholder="01 de enero"
            value={data.birthday || ""}
            onChange={(e) => onChange("birthday", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Foto del Propietario</Label>
        {/* <ImageUpload
          onImageChange={(file) => onChange("photo", file)}
          currentImage={data.photo || null}
          placeholder="Sube una foto del propietario"
          maxSize={2}
          className="mt-2"
        /> */}
        <ImageUpload
          onImageChange={async (file) => {
            if (file) {
              const base64 = await fileToBase64(file);
              await onChange("photo", base64);
            } else {
              await onChange("photo", null);
            }
          }}
          currentImage={data.photo || null}
          placeholder="Sube una foto del propietario"
          maxSize={2}
          className="mt-2"
        />
      </div>
    </div>
  )
}
