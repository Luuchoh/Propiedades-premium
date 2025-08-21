# API Documentation - Propiedades Premium

Esta documentación describe las interfaces API que debe implementar tu backend personalizado para integrar con la aplicación web de propiedades.

## Base URL
\`\`\`
http://localhost:3001/api
\`\`\`

## Autenticación
Todas las rutas protegidas requieren un token JWT en el header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Endpoints

### Autenticación

#### POST /auth/login
Iniciar sesión de usuario.

**Request Body:**
\`\`\`json
{
  "email": "string",
  "password": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "admin|agent|client",
      "avatar": "string?",
      "phone": "string?",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "token": "string"
  }
}
\`\`\`

#### POST /auth/logout
Cerrar sesión (invalidar token).

#### GET /auth/me
Obtener información del usuario actual.

### Propiedades

#### GET /properties
Obtener lista de propiedades con filtros y paginación.

**Query Parameters:**
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 12)
- `priceMin`: precio mínimo
- `priceMax`: precio máximo
- `bedrooms`: número mínimo de habitaciones
- `bathrooms`: número mínimo de baños
- `propertyType`: tipo de propiedad
- `city`: ciudad
- `status`: estado de la propiedad

#### GET /properties/:id
Obtener una propiedad específica.

#### POST /properties
Crear nueva propiedad (requiere rol agent o admin).

#### PUT /properties/:id
Actualizar propiedad (requiere rol agent o admin).

#### DELETE /properties/:id
Eliminar propiedad (requiere rol agent o admin).

### Usuarios

#### GET /users
Obtener lista de usuarios (requiere rol admin).

#### GET /users/:id
Obtener usuario específico.

#### POST /users
Crear nuevo usuario (requiere rol admin).

#### PUT /users/:id
Actualizar usuario.

#### DELETE /users/:id
Eliminar usuario (requiere rol admin).

### Estadísticas

#### GET /stats/dashboard
Obtener estadísticas del dashboard.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "totalProperties": "number",
    "availableProperties": "number",
    "pendingProperties": "number",
    "soldProperties": "number",
    "totalUsers": "number",
    "totalAgents": "number",
    "totalClients": "number",
    "monthlyRevenue": "number",
    "monthlyInquiries": "number",
    "popularCities": [
      {
        "city": "string",
        "count": "number"
      }
    ]
  }
}
\`\`\`

### Subida de Archivos

#### POST /upload
Subir archivos (imágenes).

**Request:** FormData con archivo
**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "url": "string"
  }
}
\`\`\`

### Favoritos

#### GET /favorites
Obtener propiedades favoritas del usuario.

#### POST /favorites/:propertyId
Añadir propiedad a favoritos.

#### DELETE /favorites/:propertyId
Eliminar propiedad de favoritos.

#### GET /favorites/:propertyId/check
Verificar si una propiedad está en favoritos.

### Mensajes de Contacto

#### GET /contact-messages
Obtener mensajes de contacto.

#### POST /contact-messages
Crear nuevo mensaje de contacto.

#### PUT /contact-messages/:id
Actualizar estado del mensaje.

### Notificaciones

#### GET /notifications
Obtener notificaciones del usuario.

#### PUT /notifications/:id/read
Marcar notificación como leída.

#### PUT /notifications/read-all
Marcar todas las notificaciones como leídas.

### Configuración

#### GET /settings
Obtener configuración de la aplicación.

#### PUT /settings
Actualizar configuración (requiere rol admin).

## Tipos de Datos

Ver `lib/types.ts` para las definiciones completas de TypeScript de todos los tipos de datos utilizados en la API.

## Códigos de Error

- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - Token inválido o faltante
- `403`: Forbidden - Sin permisos
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor

## Formato de Respuesta

Todas las respuestas siguen este formato:
\`\`\`json
{
  "success": boolean,
  "data": any,
  "message": "string?"
}
\`\`\`

Para respuestas paginadas:
\`\`\`json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
