# Million — Propiedades Premium

Repositorio monorepo con:

- Frontend: `propiedades-app/` (Next.js 15 + TypeScript + Tailwind + Zustand)
- Backend: `propiedades-server/` (ASP.NET Core 8 WebAPI + MongoDB)


## Requisitos previos

- Node.js 18+ (recomendado 20 LTS). Verifica con `node -v`.
- Gestor de paquetes: pnpm (recomendado) o npm.
  - Instalar pnpm: `npm i -g pnpm`
- .NET SDK 8.0. Verifica con `dotnet --version`.
- MongoDB 6+ local o en contenedor Docker.


## Estructura del repositorio

```
/propiedades-app        # Frontend Next.js
/propiedades-server     # Backend .NET 8 WebAPI
```


## Backend — ASP.NET Core 8 + MongoDB

- Ruta: `propiedades-server/`
- Proyecto Web: `propiedades-server/WebAPI/WebAPI.csproj`
- Configuración DB: `propiedades-server/WebAPI/appsettings.json`

### Configuración de base de datos
El backend usa MongoDB. 

Por ello levanta el servidor 

```bash
# Levanta el servidor de mongo
mongod
```

El archivo `appsettings.json` ya está configurado por defecto a:

```json
{
  "PropertyPremiumDatabase": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "property-premium",
    "OwnerCollectionName": "Owner",
    "PropertyCollectionName": "Property",
    "PropertyImageCollectionName": "PropertyImage"
  }
}
```

Si tu MongoDB no corre en `localhost:27017`, ajusta `ConnectionString`.

Opcional (Docker):

```bash
# MongoDB
docker run -d --name mongo -p 27017:27017 mongo:6

# (opcional) Mongo Express para UI web
# docker run -d --name mongo-express --link mongo:mongo -p 8081:8081 \
#   -e ME_CONFIG_MONGODB_SERVER=mongo mongo-express
```

### Puertos y URL del backend
- Ver `propiedades-server/WebAPI/Properties/launchSettings.json`.
- Por defecto:
  - HTTP: `http://localhost:5106`
  - HTTPS: `https://localhost:7252`

Para evitar problemas de certificados en desarrollo, usa HTTP (`5106`).

### Levantar el backend (desarrollo)

Desde la raíz del repo o desde `propiedades-server/`:

```bash
# Restaurar dependencias
dotnet restore propiedades-server/propiedades-server.sln

# Compilar
dotnet build propiedades-server/propiedades-server.sln

# Ejecutar la WebAPI (usando HTTP por simplicidad)
dotnet run --project propiedades-server/WebAPI/WebAPI.csproj
```

Al iniciar, la API quedará disponible en `http://localhost:5106`.

### Swagger (documentación de API)
Intenta acceder a `http://localhost:5106/swagger`.
- Si no aparece, habilítalo en `Program.cs` con:
  - `builder.Services.AddEndpointsApiExplorer();`
  - `builder.Services.AddSwaggerGen();`
  - En el pipeline: `app.UseSwagger(); app.UseSwaggerUI();`

### CORS (si llamas desde el frontend en http://localhost:3000)
Si el navegador bloquea por CORS, agrega en `Program.cs`:

```csharp
// services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// middleware
app.UseCors();
```

### Principales endpoints disponibles
Controladores en `propiedades-server/WebAPI/Controllers/`.

- Owner (`api/Owner/...`)
  - GET `api/Owner/GetAllOwners`
  - POST `api/Owner/GetOneOwnerById`  Body: `{ "MongoGeneralId": "<id>" }`
  - POST `api/Owner/GetOneOwnerByDNI` Body: `{ "dni": "<dni>" }`
  - POST `api/Owner/CreateOwner`      Body: `OwnerDTO`
  - PUT  `api/Owner/UpdateOwner`      Body: `OwnerDTO`
  - DELETE `api/Owner/DeleteOwner`    Body: `{ "MongoGeneralId": "<id>" }`

- Property (`api/Property/...`)
  - GET `api/Property/GetAllProperties`
  - GET `api/Property/GetOnePropertyByID` Body: `{ "MongoGeneralId": "<id>" }` (nota: GET con body no es usual)
  - POST `api/Property/CreateProperty`    Body: `PropertyDTO`
  - PUT  `api/Property/UpdateProperty`    Body: `PropertyDTO`
  - DELETE `api/Property/DeleteProperty`  Body: `{ "MongoGeneralId": "<id>" }`

> Nota: `OwnerDTO` y `PropertyDTO` están en `propiedades-server/Application/DTOs/`. Las colecciones se crean automáticamente al insertar.

### Tests (opcional)

```bash
dotnet test propiedades-server/UnitTests/UnitTests.csproj
```


## Frontend — Next.js 15

- Ruta: `propiedades-app/`
- Scripts: `dev`, `build`, `start` (ver `propiedades-app/package.json`)

### Variables de entorno
Crea `propiedades-app/.env.local` con la URL del backend (HTTP recomendado en dev):

```
NEXT_PUBLIC_SERVER_HOST=http://localhost:5106
```

### Instalar dependencias

```bash
# Usando pnpm (recomendado)
cd propiedades-app
pnpm install

# o con npm
npm install
```

### Levantar el frontend (desarrollo)

```bash
pnpm dev
# o
npm run dev
```

La app estará en `http://localhost:3000`.

### Build y ejecución en modo producción

```bash
pnpm build && pnpm start
# o con npm
npm run build && npm start
```


## Flujo recomendado para levantar todo en local

1) Arrancar MongoDB (local o Docker) en `mongodb://localhost:27017`.
2) Levantar el backend:
   - `dotnet run --project propiedades-server/WebAPI/WebAPI.csproj`
   - Verifica que responde en `http://localhost:5106` (y Swagger en `/swagger` si está habilitado).
3) Configurar el frontend:
   - `propiedades-app/.env.local` con `NEXT_PUBLIC_SERVER_HOST=http://localhost:5106`.
   - `pnpm install` (o `npm install`).
4) Levantar el frontend:
   - `pnpm dev` (o `npm run dev`) en `http://localhost:3000`.


## Problemas comunes y soluciones

- CORS bloquea peticiones desde `http://localhost:3000`:
  - Agrega `AddCors`/`UseCors` como se indica arriba.
- Puerto del backend diferente a `5106`:
  - Revisa `propiedades-server/WebAPI/Properties/launchSettings.json` y ajusta `NEXT_PUBLIC_SERVER_HOST` en el frontend.
- HTTPS falla por certificado en dev:
  - Usa la URL HTTP (`http://localhost:5106`).
- MongoDB no accesible / autenticación:
  - Ajusta `ConnectionString` en `appsettings.json`.
- Node incompatible:
  - Actualiza Node a 18+ (recomendado 20 LTS).


## Stack técnico

- Frontend: Next.js 15, React 19, Tailwind 4, Zustand, Radix UI, shadcn/ui, TypeScript
- Backend: .NET 8 WebAPI, MongoDB.Driver, FluentValidation
- DB: MongoDB
- Docs API: Swashbuckle (Swagger) (si está habilitado en `Program.cs`)


## Licencia

Este proyecto se distribuye bajo la licencia incluida en `LICENSE`.
