# Sistema de Gestión de Incapacidades y Pensiones 🇨🇴

Sistema web integral para la gestión digital de documentos de incapacidades laborales y pensiones en Barranquilla, Colombia.

## 📋 Descripción del Proyecto

Plataforma desarrollada para **Luis Carlos García** que digitaliza y optimiza el proceso de tramitación de incapacidades y pensiones, eliminando la gestión manual en papel y centralizando toda la documentación en un sistema seguro y eficiente.

### Características Principales

✅ **Autenticación Segura**: Sistema JWT con refresh tokens  
✅ **Gestión de Usuarios**: Roles diferenciados (Usuario, Admin)  
✅ **Gestión de Documentos**: Upload, download, visualización de PDFs/imágenes  
✅ **Almacenamiento Híbrido**: PostgreSQL + MongoDB GridFS  
✅ **API REST**: Documentada con Swagger/OpenAPI  
✅ **Testing**: >80% de cobertura  
✅ **Responsive Design**: Optimizado para móviles y desktop  

## 🏗️ Arquitectura

```
┌─────────────┐         HTTP/REST + JWT         ┌─────────────┐
│             │ ────────────────────────────────▶│             │
│  Next.js 15 │                                  │  NestJS 10  │
│  (Frontend) │◀──────────────────────────────── │  (Backend)  │
│  Port 3000  │                                  │  Port 4000  │
└─────────────┘                                  └──────┬──────┘
                                                        │
                                        ┌───────────────┴───────────────┐
                                        │                               │
                                        ▼                               ▼
                                ┌───────────────┐            ┌─────────────────┐
                                │ PostgreSQL 16 │            │   MongoDB 7     │
                                │ (Metadata)    │            │ (GridFS Files)  │
                                │ Port 5432     │            │ Port 27017      │
                                └───────────────┘            └─────────────────┘
```

## 🚀 Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (ES6+)
- **UI**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Playwright

### Backend
- **Framework**: NestJS 10
- **Language**: JavaScript (ES2022+)
- **Runtime**: Node.js 20 LTS
- **Auth**: JWT + Passport
- **ORM**: Prisma (PostgreSQL)
- **ODM**: Mongoose (MongoDB)
- **Testing**: Jest + Supertest
- **Docs**: Swagger/OpenAPI

### Bases de Datos
- **PostgreSQL 16**: Datos estructurados
- **MongoDB 7**: Almacenamiento de archivos (GridFS)

## 📁 Estructura del Proyecto

```
MVC Incapacitaciones/
├── backend/                # API Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Autenticación JWT
│   │   ├── users/         # Gestión de usuarios
│   │   ├── documents/     # Gestión de documentos
│   │   ├── storage/       # GridFS file storage
│   │   ├── prisma/        # Prisma service
│   │   └── common/        # Utilidades compartidas
│   ├── prisma/
│   │   └── schema.prisma  # Schema de DB
│   └── test/              # Tests
│
├── frontend/              # UI Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & API
│   │   ├── hooks/         # Custom hooks
│   │   └── store/         # Zustand stores
│   └── public/            # Static assets
│
├── testing/               # Tests E2E globales
├── docker-compose.yml     # Orquestación de servicios
└── README.md              # Este archivo
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js >= 20.0.0
- PostgreSQL 16
- MongoDB 7
- npm >= 10.0.0
- Docker & Docker Compose (recomendado)

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone <repository-url>
cd "MVC Incapacitaciones"

# Levantar bases de datos
docker-compose up -d

# Instalar dependencias del backend
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate

# Instalar dependencias del frontend
cd ../frontend
npm install

# Iniciar desarrollo
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Opción 2: Sin Docker (Manual)

```bash
# 1. Instalar PostgreSQL 16
# Windows: https://www.postgresql.org/download/windows/
# Crear base de datos 'incapacidades'

# 2. Instalar MongoDB 7
# Windows: https://www.mongodb.com/try/download/community

# 3. Configurar variables de entorno
cd backend
cp .env.example .env
# Editar .env con tus credenciales

# 4. Instalar y ejecutar backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev

# 5. Instalar y ejecutar frontend
cd ../frontend
npm install
npm run dev
```

## 🎯 Acceso a la Aplicación

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:4000/api/v1>
- **Swagger Docs**: <http://localhost:4000/api/docs>
- **Prisma Studio**: `npm run prisma:studio` (puerto 5555)

## 🔐 Credenciales por Defecto

### Base de Datos PostgreSQL

```bash
Host: localhost
Port: 5432
Database: incapacidades
Username: postgres
Password: Salac123*
```

### Base de Datos MongoDB

```bash
Host: localhost
Port: 27017
Database: incapacidades
```

### Usuario Admin (después del seed)

```bash
Email: admin@incapacidades.com
Password: Admin123!
```

## 📚 Documentación

### Backend API

Documentación completa disponible en Swagger UI:

- **URL**: <http://localhost:4000/api/docs>
- **Formato**: OpenAPI 3.0

### Endpoints Principales

```bash
# Autenticación
POST /api/v1/auth/register   # Registro
POST /api/v1/auth/login      # Login
POST /api/v1/auth/refresh    # Refresh token

# Usuarios
GET    /api/v1/users         # Listar usuarios (Admin)
GET    /api/v1/users/profile # Perfil actual
GET    /api/v1/users/:id     # Usuario por ID
PUT    /api/v1/users/:id     # Actualizar usuario
DELETE /api/v1/users/:id     # Eliminar usuario (Admin)

# Documentos
GET    /api/v1/documents     # Listar documentos
POST   /api/v1/documents     # Crear documento
GET    /api/v1/documents/:id # Documento por ID
PUT    /api/v1/documents/:id # Actualizar documento
DELETE /api/v1/documents/:id # Eliminar documento
POST   /api/v1/documents/:id/upload  # Subir archivo
GET    /api/v1/documents/:id/download # Descargar archivo
```

## 🧪 Testing

### Backend

```bash
cd backend

# Tests unitarios
npm test

# Tests con cobertura
npm run test:cov

# Tests E2E
npm run test:e2e

# Ver reporte de cobertura
open coverage/index.html
```

### Frontend

```bash
cd frontend

# Tests unitarios
npm test

# Tests E2E con Playwright
npm run test:e2e

# Tests con cobertura
npm run test:coverage
```

### Cobertura Mínima Requerida

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🚀 Despliegue

### Backend (Railway/Render)

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Frontend (Vercel)

```bash
# Build
npm run build

# Preview
npm run start
```

### Variables de Entorno en Producción

**Backend (.env)**:

```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=<postgresql-production-url>
MONGODB_URI=<mongodb-production-url>
JWT_SECRET=<strong-secret-min-32-chars>
REFRESH_TOKEN_SECRET=<strong-refresh-secret>
CORS_ORIGIN=<frontend-production-url>
```

**Frontend (.env.local)**:

```bash
NEXT_PUBLIC_API_URL=<backend-production-url>
```

## 🛡️ Seguridad

- ✅ Passwords hasheados con bcrypt (12 rounds)
- ✅ JWT con expiración (1h access, 7d refresh)
- ✅ Validación exhaustiva de inputs (frontend + backend)
- ✅ CORS configurado correctamente
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS prevention (React escaping)
- ✅ File upload validation (tipo, tamaño)
- ✅ Rate limiting recomendado en producción

## 📊 Base de Datos

### Modelos Principales

#### User

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  fullName  String
  cedula    String   @unique
  phone     String?
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Document

```prisma
model Document {
  id          String         @id @default(uuid())
  title       String
  description String?
  type        DocumentType
  status      DocumentStatus @default(PENDING)
  userId      String
  fileId      String?        // MongoDB GridFS ID
  fileName    String?
  fileSize    Int?
  mimeType    String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
```

## 🔄 Workflow de Desarrollo

### Branching Strategy

```bash
main          # Producción
  ↑
develop       # Desarrollo
  ↑
feature/*     # Nuevas features
bugfix/*      # Corrección de bugs
hotfix/*      # Fixes urgentes
```

### Commits Convencionales

```bash
feat(scope): description     # Nueva funcionalidad
fix(scope): description      # Corrección de bug
docs(scope): description     # Documentación
test(scope): description     # Tests
refactor(scope): description # Refactorización
chore(scope): description    # Mantenimiento
```

## 🐛 Troubleshooting

### Backend no inicia

```bash
# Verificar PostgreSQL
pg_isready

# Verificar MongoDB
mongosh --eval "db.version()"

# Verificar variables de entorno
cat backend/.env
```

### Frontend no conecta con Backend

```bash
# Verificar CORS en backend/.env
CORS_ORIGIN=http://localhost:3000

# Verificar API URL en frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Error en migraciones de Prisma

```bash
cd backend
npx prisma migrate reset  # ⚠️ Solo en desarrollo
npx prisma migrate dev
```

## 👥 Equipo de Desarrollo

- **Arquitecto**: Project Architect Agent
- **Backend**: Backend Development Agent (NestJS)
- **Frontend**: Frontend Development Agent (Next.js)
- **QA**: Testing & QA Agent

## 📞 Soporte

Para dudas o problemas:

1. Revisar documentación en `/api/docs`
2. Consultar README de cada módulo
3. Revisar issues en GitHub
4. Contactar al equipo de desarrollo

## 📄 Licencia

MIT

---

**Cliente**: Luis Carlos García  
**Ubicación**: Barranquilla, Atlántico, Colombia 🇨🇴  
**Proyecto**: Sistema de Gestión de Incapacidades y Pensiones  
**Versión**: 1.0.0 (MVP)  
**Última actualización**: Octubre 2025
