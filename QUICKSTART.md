# 🚀 Quick Start Guide - Sistema de Gestión de Incapacidades

## Estado Actual

**Frontend**: ✅ Funcional en http://localhost:3000  
**Backend**: ⚠️ Bloqueado (requiere configuración de Babel)  
**Databases**: ✅ Corriendo (PostgreSQL + MongoDB)

---

## ▶️ Iniciar Frontend (YA FUNCIONA)

```bash
# Terminal 1
cd frontend
npm run dev

# Abrir navegador en: http://localhost:3000
```

### Páginas Disponibles
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/dashboard` - Panel principal (requiere auth)
- `/documents` - Lista de documentos (requiere auth)
- `/documents/new` - Subir documento (requiere auth)

### Nota Importante
El frontend está 100% funcional en UI/UX, pero las llamadas a la API fallarán hasta que el backend esté corriendo.

---

## ⚠️ Iniciar Backend (REQUIERE CONFIGURACIÓN)

### Problema
El backend usa JavaScript con decorators de NestJS que no son nativamente soportados.

### Solución (5 minutos)

```bash
# Terminal 2
cd backend

# 1. Instalar Babel
npm install --save-dev @babel/core @babel/node @babel/preset-env @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties

# 2. Crear archivo .babelrc
cat > .babelrc << 'EOF'
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
EOF

# 3. Actualizar package.json scripts (editar manualmente)
# Cambiar:
#   "start:dev": "node src/main.js"
# Por:
#   "start:dev": "babel-node src/main.js"

# 4. Iniciar backend
npm run start:dev

# Backend corriendo en: http://localhost:4000
# Swagger docs en: http://localhost:4000/api/docs
```

---

## 🗄️ Verificar Bases de Datos

```bash
# PostgreSQL (ya corriendo)
docker exec -it postgres psql -U postgres -d incapacidades -c "\dt"

# MongoDB (ya corriendo)
docker exec -it mongodb mongosh --eval "use incapacidades; db.stats()"
```

### Usuarios de Prueba

**Admin:**
- Email: `admin@incapacidades.com`
- Password: `Admin123!`

**Usuario:**
- Email: `usuario@test.com`
- Password: `User123!`

---

## ✅ Flujo de Prueba Completo

Una vez que el backend esté corriendo:

1. **Registro**
   - Ir a http://localhost:3000/register
   - Crear nuevo usuario
   - Automáticamente se logueará y redirigirá a `/dashboard`

2. **Login**
   - Ir a http://localhost:3000/login
   - Usar credenciales de prueba
   - Redirección automática a `/dashboard`

3. **Dashboard**
   - Ver estadísticas (por ahora en 0)
   - Ver información del usuario
   - Click en "Subir Nuevo Documento"

4. **Subir Documento**
   - Llenar formulario
   - Seleccionar tipo
   - Arrastrar o seleccionar archivo
   - Click "Subir Documento"

5. **Ver Documentos**
   - Ir a `/documents`
   - Ver lista de documentos subidos
   - Descargar documentos
   - Ver detalles

---

## 🐛 Troubleshooting

### Frontend no carga
```bash
# Verificar puerto 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Reinstalar dependencias
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend falla al iniciar
```bash
# Verificar que Babel está instalado
cd backend
npm list @babel/core

# Verificar .babelrc existe
cat .babelrc

# Verificar databases corriendo
docker ps

# Reiniciar si es necesario
cd ..
docker-compose restart
```

### Error "Cannot connect to database"
```bash
# Verificar PostgreSQL
docker exec -it postgres psql -U postgres -c "SELECT version();"

# Verificar MongoDB
docker exec -it mongodb mongosh --eval "db.version()"

# Reconstruir containers si falla
docker-compose down -v
docker-compose up -d
```

### Error "localStorage is not defined"
Esto es normal en server-side rendering de Next.js. El código ya maneja esto correctamente.

### API calls devuelven 404
- Verificar que backend esté corriendo en http://localhost:4000
- Verificar `.env.local` en frontend:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
  ```

---

## 📚 Documentación Completa

- Frontend: `frontend/README.md`
- Backend: `backend/README.md`
- Progress: `PROGRESS.md`
- Arquitectura: `AGENTS.md`

---

## 🎯 Próximo Paso Crítico

**ACCIÓN REQUERIDA**: Configurar Babel en el backend (ver sección "Iniciar Backend")

Una vez hecho esto, tendrás un sistema completamente funcional:
- ✅ Login/Registro
- ✅ Dashboard
- ✅ Subir documentos
- ✅ Ver documentos
- ✅ Descargar documentos

---

**¿Necesitas ayuda?** Revisa `PROGRESS.md` para ver el estado detallado de todas las características.
