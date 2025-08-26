"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageChange: (file: File | null) => void
  currentImage?: File | string | null
  accept?: string
  maxSize?: number // in MB
  className?: string
  placeholder?: string
  showPreview?: boolean
  disabled?: boolean
}

export function ImageUpload({
  onImageChange,
  currentImage,
  accept = "image/*",
  maxSize = 5,
  className,
  placeholder = "Haz clic para subir una imagen",
  showPreview = true,
  disabled = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return "El archivo debe ser una imagen"
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return `El archivo debe ser menor a ${maxSize}MB`
    }

    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onImageChange(file)

    // Create preview
    if (showPreview) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const getImageSrc = () => {
    if (preview) return preview
    if (typeof currentImage === "string") return currentImage
    return null
  }

  const hasImage = currentImage || preview

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {hasImage && showPreview ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <img src={getImageSrc() || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={disabled}>
                    <Upload className="h-4 w-4 mr-1" />
                    Cambiar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRemove} disabled={disabled}>
                    <X className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
            dragActive ? "border-primary bg-primary/5" : "border-border",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50",
            error ? "border-destructive" : "",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4">
              {error ? (
                <AlertCircle className="h-12 w-12 text-destructive" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}>
                {error || placeholder}
              </p>
              <p className="text-xs text-muted-foreground">Arrastra y suelta o haz clic para seleccionar</p>
              <Badge variant="outline" className="text-xs">
                Máximo {maxSize}MB
              </Badge>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
