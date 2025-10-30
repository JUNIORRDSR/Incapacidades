# Backend - Sistema de Gestión de Incapacidades

Backend API REST para la gestión digital de documentos de incapacidades laborales y pensiones en Barranquilla, Colombia.

## 🚀 Stack Tecnológico

- **Framework**: NestJS 10
- **Lenguaje**: JavaScript (ES2022+) con JSDoc
- **Runtime**: Node.js 20 LTS
- **Bases de Datos**:
  - PostgreSQL 16 (datos estructurados)
  - MongoDB 7 (almacenamiento de archivos GridFS)
- **ORM**: Prisma
- **Auth**: JWT + Passport
- **Testing**: Jest + Supertest
- **Documentación**: Swagger/OpenAPI

## 📋 Prerrequisitos

- Node.js >= 20.0.0
- PostgreSQL 16
- MongoDB 7
- npm >= 10.0.0

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Ejecutar seed
npm run prisma:seed
```

## ⚙️ Variables de Entorno

```bash
# Servidor
NODE_ENV=development
PORT=4000

# PostgreSQL
DATABASE_URL="postgresql://postgres:Salac123*@localhost:5432/incapacidades?schema=public"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/incapacidades"

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-secret-here
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🏃 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Debug
npm run start:debug
```

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con cobertura
npm run test:cov

# Tests E2E
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 📚 Documentación API

Una vez iniciado el servidor, accede a:

- **Swagger UI**: http://localhost:4000/api/docs
- **API Base URL**: http://localhost:4000/api/v1

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/              # Autenticación JWT
│   ├── users/             # Gestión de usuarios
│   ├── documents/         # Gestión de documentos
│   ├── storage/           # Almacenamiento GridFS
│   ├── prisma/            # Servicio Prisma
│   ├── common/            # Utilidades compartidas
│   ├── config/            # Configuración
│   ├── app.module.js      # Módulo raíz
│   └── main.js            # Entry point
├── prisma/
│   └── schema.prisma      # Schema de base de datos
├── test/                  # Tests E2E
├── .env                   # Variables de entorno
└── package.json
```

## 🔐 Autenticación

El sistema utiliza JWT con dos tipos de tokens:

- **Access Token**: Válido por 1 hora
- **Refresh Token**: Válido por 7 días

### Endpoints de Auth

```bash
POST /api/v1/auth/register  # Registro
POST /api/v1/auth/login     # Login
POST /api/v1/auth/refresh   # Refrescar token
```

## 👥 Roles de Usuario

- **USER**: Usuario estándar (puede gestionar sus propios documentos)
- **ADMIN**: Administrador (acceso completo)

## 📝 Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Password123!",
    "fullName": "Juan Pérez",
    "cedula": "1234567890",
    "phone": "3001234567"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Password123!"
  }'
```

### Obtener Perfil (requiere token)

```bash
curl http://localhost:4000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛠️ Scripts Disponibles

```bash
npm start          # Iniciar servidor
npm run start:dev  # Modo desarrollo (hot reload)
npm test           # Ejecutar tests
npm run test:cov   # Tests con cobertura
npm run lint       # Linter
npm run format     # Formatear código
```

## 📊 Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **Document**: Metadata de documentos
- **RefreshToken**: Tokens de refresco

### Prisma Studio

```bash
npm run prisma:studio
```

Abre una UI web en http://localhost:5555 para explorar/editar datos.

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (12 rounds)
- ✅ Validación exhaustiva de inputs
- ✅ JWT con expiración
- ✅ CORS configurado
- ✅ Rate limiting (recomendado en producción)
- ✅ Helmet para headers de seguridad

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
pg_isready

# Verificar credenciales en .env
DATABASE_URL="postgresql://postgres:Salac123*@localhost:5432/incapacidades?schema=public"
```

### Error de conexión a MongoDB

```bash
# Verificar que MongoDB está corriendo
mongosh --eval "db.version()"

# Verificar URI en .env
MONGODB_URI="mongodb://localhost:27017/incapacidades"
```

## 📞 Soporte

Para dudas o problemas:
- Revisar documentación en `/api/docs`
- Consultar logs del servidor
- Revisar variables de entorno

## 👨‍💻 Desarrollo

### Agregar nueva migración

```bash
npx prisma migrate dev --name nombre_migracion
```

### Regenerar cliente Prisma

```bash
npm run prisma:generate
```

## 📄 Licencia

MIT

## 🇨🇴 Hecho en

Barranquilla, Atlántico, Colombia

---

**Cliente**: Luis Carlos García  
**Proyecto**: Sistema de Gestión de Incapacidades y Pensiones
