// Utility functions for image handling

/**
 * Converts a File object to a base64 string
 * @param file The file to convert
 * @returns A promise that resolves to the base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


export interface ImageValidationOptions {
  maxSize?: number // in MB
  allowedTypes?: string[]
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export interface ImageValidationResult {
  isValid: boolean
  error?: string
}

export const validateImage = async (
  file: File,
  options: ImageValidationOptions = {},
): Promise<ImageValidationResult> => {
  const {
    maxSize = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  } = options

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(", ")}`,
    }
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSize) {
    return {
      isValid: false,
      error: `El archivo debe ser menor a ${maxSize}MB`,
    }
  }

  // Check image dimensions if specified
  if (minWidth || minHeight || maxWidth || maxHeight) {
    try {
      const dimensions = await getImageDimensions(file)

      if (minWidth && dimensions.width < minWidth) {
        return {
          isValid: false,
          error: `La imagen debe tener al menos ${minWidth}px de ancho`,
        }
      }

      if (minHeight && dimensions.height < minHeight) {
        return {
          isValid: false,
          error: `La imagen debe tener al menos ${minHeight}px de alto`,
        }
      }

      if (maxWidth && dimensions.width > maxWidth) {
        return {
          isValid: false,
          error: `La imagen no puede tener más de ${maxWidth}px de ancho`,
        }
      }

      if (maxHeight && dimensions.height > maxHeight) {
        return {
          isValid: false,
          error: `La imagen no puede tener más de ${maxHeight}px de alto`,
        }
      }
    } catch (error) {
      return {
        isValid: false,
        error: "Error al validar las dimensiones de la imagen",
      }
    }
  }

  return { isValid: true }
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Error al cargar la imagen"))
    }

    img.src = url
  })
}

export const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    if (!ctx) {
      reject(new Error("No se pudo crear el contexto del canvas"))
      return
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      const aspectRatio = width / height

      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }

      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          } else {
            reject(new Error("Error al redimensionar la imagen"))
          }
        },
        file.type,
        quality,
      )
    }

    img.onerror = () => reject(new Error("Error al cargar la imagen"))
    img.src = URL.createObjectURL(file)
  })
}

export const convertToWebP = (file: File, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    if (!ctx) {
      reject(new Error("No se pudo crear el contexto del canvas"))
      return
    }

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
              type: "image/webp",
              lastModified: Date.now(),
            })
            resolve(webpFile)
          } else {
            reject(new Error("Error al convertir a WebP"))
          }
        },
        "image/webp",
        quality,
      )
    }

    img.onerror = () => reject(new Error("Error al cargar la imagen"))
    img.src = URL.createObjectURL(file)
  })
}

export const generateThumbnail = (file: File, size = 150): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    if (!ctx) {
      reject(new Error("No se pudo crear el contexto del canvas"))
      return
    }

    img.onload = () => {
      // Create square thumbnail
      canvas.width = size
      canvas.height = size

      const { naturalWidth, naturalHeight } = img
      const aspectRatio = naturalWidth / naturalHeight
      let drawWidth = size
      let drawHeight = size
      let offsetX = 0
      let offsetY = 0

      if (aspectRatio > 1) {
        // Landscape
        drawHeight = size / aspectRatio
        offsetY = (size - drawHeight) / 2
      } else {
        // Portrait
        drawWidth = size * aspectRatio
        offsetX = (size - drawWidth) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      resolve(canvas.toDataURL("image/jpeg", 0.8))
    }

    img.onerror = () => reject(new Error("Error al generar thumbnail"))
    img.src = URL.createObjectURL(file)
  })
}

// API connection utilities for when the backend is ready
export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

export const uploadImage = async (file: File, endpoint = "/api/upload"): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      url: data.url,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al subir la imagen",
    }
  }
}

export const deleteImage = async (imageUrl: string, endpoint = "/api/delete"): Promise<boolean> => {
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    })

    return response.ok
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
