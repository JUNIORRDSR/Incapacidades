# Sistema de Gestión de Incapacidades y Pensiones - Frontend

Frontend del sistema de gestión de documentos de incapacidades y pensiones para Luis Carlos García en Barranquilla, Colombia.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript (ES6+)
- **UI:** Tailwind CSS v4 + shadcn/ui components
- **State Management:** Zustand (global) + TanStack Query (server state)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Icons:** Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🔐 Credenciales de Prueba

### Usuario Administrador
- **Email:** admin@incapacidades.com
- **Password:** Admin123!
- **Rol:** ADMIN

### Usuario Regular
- **Email:** usuario@test.com
- **Password:** User123!
- **Rol:** USER

## ✅ Características Implementadas (90%)

### Autenticación
- [x] Página de login con validación
- [x] Página de registro con validación multi-campo
- [x] Persistencia de sesión (localStorage)
- [x] Manejo de JWT tokens
- [x] Auto-logout en errores 401
- [x] Redirección basada en roles
- [x] Toggle de visualización de contraseña

### Dashboard
- [x] Página principal con información del usuario
- [x] Acciones rápidas (subir documento, ver documentos, editar perfil)
- [x] Protección de rutas autenticadas
- [x] Instrucciones de uso
- [x] Botón de logout

### Gestión de Documentos
- [x] Lista de documentos con paginación
- [x] Vista de detalles de documento
- [x] Subir nuevo documento (drag & drop + click)
- [x] Descargar archivos
- [x] Eliminar documentos (con confirmación)
- [x] Validación de tipo y tamaño de archivo (10MB máx)
- [x] Estados visuales con badges (PENDING, APPROVED, REJECTED, IN_REVIEW)
- [x] Filtrado por tipo de documento

### Perfil de Usuario
- [x] Ver información de usuario
- [x] Editar nombre y teléfono
- [x] Cambiar contraseña
- [x] Datos de solo lectura (email, cédula, rol, estado)

### UI Components
- [x] Button (6 variants, 4 sizes)
- [x] Input (con estados de focus)
- [x] Card (sistema completo de 6 componentes)
- [x] Label
- [x] Form (integración React Hook Form)
- [x] Alert (con variants)
- [x] Select (dropdown con Radix UI)
- [x] Badge (5 variants)

## ⏳ Pendiente (10%)

### Funcionalidades
- [ ] Panel de administración (gestión de usuarios)
- [ ] Actualizar estado de documentos (solo admin)
- [ ] Búsqueda y filtros avanzados en documentos
- [ ] Notificaciones en tiempo real

### UI Components
- [ ] Dropdown Menu (menú de usuario en header)
- [ ] Avatar (icono de usuario)
- [ ] Table (para lista de usuarios en admin)
- [ ] Dialog (modales de confirmación)

### Optimizaciones
- [ ] Skeleton loaders mejorados
- [ ] Error boundaries globales
- [ ] Optimistic updates en mutaciones
- [ ] Infinite scroll en documentos
- [ ] PWA support

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/           ✅ Login
│   │   │   └── register/        ✅ Registro
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/       ✅ Dashboard principal
│   │   │   ├── documents/
│   │   │   │   ├── page.jsx     ✅ Lista con paginación
│   │   │   │   ├── new/         ✅ Subir documento
│   │   │   │   └── [id]/        ✅ Ver detalles
│   │   │   └── profile/         ✅ Editar perfil
│   │   ├── layout.js            ✅ Layout raíz
│   │   └── page.js              ✅ Home con redirect
│   ├── components/
│   │   ├── ui/                  ✅ 8 componentes
│   │   └── providers.jsx        ✅ React Query
│   ├── lib/
│   │   ├── api/                 ✅ Axios + services
│   │   ├── validations/         ✅ Zod schemas
│   │   └── utils.js             ✅ 10 utilidades
│   └── store/
│       └── auth-store.js        ✅ Zustand + persist
└── .env.local                   ✅ Configuración
```

## 🔧 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 🎯 Uso

1. **Iniciar Backend:** Asegúrate de que el servidor backend esté corriendo en `http://localhost:4000`
2. **Iniciar Frontend:** Ejecuta `npm run dev` y navega a `http://localhost:3000`
3. **Iniciar Sesión:** Usa las credenciales de prueba para entrar
4. **Subir Documento:** Ve a "Mis Documentos" → "Subir Documento"
5. **Gestionar Perfil:** Edita tu información personal en "Mi Perfil"

## 🔄 Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Frontend envía `POST /api/v1/auth/login` al backend
3. Backend valida y devuelve `accessToken` + `refreshToken` + `user`
4. Zustand store guarda tokens y usuario en `localStorage`
5. Axios interceptor agrega `Authorization: Bearer <token>` a todas las requests
6. Si el token expira (401), Axios hace logout automático

## 📡 Endpoints Implementados

### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovar tokens

### Usuarios
- `GET /users/profile` - Obtener perfil
- `PATCH /users/:id` - Actualizar perfil
- `GET /users` - Listar usuarios (admin)

### Documentos
- `GET /documents` - Listar documentos (paginado)
- `GET /documents/:id` - Ver documento específico
- `POST /documents/upload` - Subir documento con archivo
- `GET /documents/:id/download` - Descargar archivo
- `PATCH /documents/:id` - Actualizar documento
- `DELETE /documents/:id` - Eliminar documento

## ✔️ Validaciones

### Registro
- **fullName:** Mínimo 3 caracteres
- **cedula:** 6-10 dígitos numéricos
- **email:** Formato válido
- **phone:** 10 dígitos, debe comenzar con 3 (opcional)
- **password:** Mínimo 8 caracteres
- **confirmPassword:** Debe coincidir con password

### Documento
- **title:** Mínimo 3 caracteres
- **type:** INCAPACIDAD, PENSION, CERTIFICADO_MEDICO, HISTORIA_CLINICA, OTRO
- **description:** Opcional
- **file:** PDF, JPEG, PNG o DOCX, máximo 10MB

### Perfil
- **fullName:** Mínimo 3 caracteres (opcional)
- **phone:** 10 dígitos comenzando con 3 (opcional)
- **password:** Mínimo 8 caracteres (opcional)
- **confirmPassword:** Debe coincidir si se proporciona password

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests E2E con Playwright
npm run test:e2e

# Coverage
npm run test:coverage
```

## 👤 Cliente

**Nombre:** Luis Carlos García  
**Ubicación:** Barranquilla, Atlántico, Colombia  
**Objetivo:** Plataforma web para gestión digital de documentos de incapacidades laborales

## 📊 Progreso del Proyecto

**Estado Actual:** MVP Funcional - 90% Completado ✅

**Últimas Actualizaciones:**
- ✅ Sistema de autenticación completo
- ✅ CRUD de documentos implementado
- ✅ Upload/download de archivos funcional
- ✅ Perfil de usuario editable
- ✅ Validaciones frontend y backend sincronizadas
- ✅ UI responsive con Tailwind CSS v4

**Próximos Pasos:**
1. Implementar panel de administración
2. Agregar sistema de notificaciones
3. Mejorar búsqueda y filtros
4. Testing comprehensivo
