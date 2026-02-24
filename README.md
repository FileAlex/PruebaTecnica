# 📦 CRM Orders Management — Prueba Técnica

Sistema CRM desarrollado con **NestJS + SQL Server + Vue 3** que permite la gestión de clientes y órdenes con autenticación JWT, control de roles y encriptación de datos sensibles.

---

# 🚀 Tecnologías

## Backend

* NestJS
* Prisma (ORM)
* SQL Server Express
* JWT Authentication
* Crypto (encriptación de campos sensibles)

## Frontend

* Vue 3 (Composition API)
* Vue Router
* Axios
* CSS moderno (cards + dashboard)

---

# ✨ Funcionalidades

## 🔐 Autenticación

* Registro de usuarios
* Login con JWT
* Protección de rutas
* Roles (ADMIN / USER)

## 👥 Clientes

* Crear clientes
* Listar clientes
* Visualizar datos completos
* Ver órdenes asociadas

## 📦 Órdenes

* Crear órdenes
* Listado global
* Filtrado por cliente
* Cambio de estatus con reglas de negocio:

  * Solo ADMIN puede cancelar
  * Una orden cancelada no puede modificarse

## 📊 Dashboard

* Total de órdenes
* Total de clientes
* Totales por moneda
* Órdenes por estatus

## 🔒 Seguridad

* Encriptación de campos sensibles (notas internas)
* JWT protegido
* Validaciones frontend y backend

---

# 🏗️ Arquitectura

```
backend/
  src/
    auth/
    users/
    customers/
    orders/
    encryption/
    common/

frontend/
  src/
    views/
    router/
    api/
```

---

# ⚙️ Instalación y Configuración

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js** (versión 18 o superior): [Descargar aquí](https://nodejs.org/)
- **SQL Server Express** (o cualquier versión de SQL Server): [Descargar aquí](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Git**: Para clonar el repositorio
- **Un editor de código**: Recomendado VS Code

## 1️⃣ Clonar el repositorio

```bash
git clone <repo-url>
cd PruebaTecnica
```

## 2️⃣ Configurar la Base de Datos

### Instalar SQL Server Express

1. Descarga e instala SQL Server Express desde el enlace de prerrequisitos.
2. Durante la instalación, configura:
   - Modo de autenticación: Modo mixto (Windows + SQL Server)
   - Usuario SA: Habilítalo y establece una contraseña segura.

### Crear la base de datos

Abre SQL Server Management Studio (SSMS) o usa la línea de comandos:

```sql
CREATE DATABASE crm_db;
GO
```

Crea un usuario para la aplicación (opcional, pero recomendado):

```sql
CREATE LOGIN crm_user WITH PASSWORD = 'pasePrueba938';
GO
USE crm_db;
GO
CREATE USER crm_user FOR LOGIN crm_user;
GO
ALTER ROLE db_owner ADD MEMBER crm_user;
GO
```

## 3️⃣ Configurar el Backend

### Instalar dependencias

```bash
cd backend
npm install
```

### Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
DATABASE_URL="sqlserver://localhost:1433;database=crm_db;user=crm_user;password=pasePrueba938;encrypt=true;trustServerCertificate=true"
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_min_32_caracteres
ENCRYPTION_KEY=12345678901234567890123456789012
```

**Notas importantes:**
- Cambia `JWT_SECRET` por una clave segura y única (mínimo 32 caracteres).
- `ENCRYPTION_KEY` debe ser exactamente 32 caracteres para AES-256.
- Asegúrate de que la URL de la base de datos coincida con tu configuración de SQL Server.

### Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev --name init
```

Esto creará las tablas en la base de datos.

### Ejecutar el backend

```bash
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

## 4️⃣ Configurar el Frontend

### Instalar dependencias

```bash
cd ../frontend
npm install
```

### Ejecutar el frontend

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 5️⃣ Verificar la instalación

1. Abre `http://localhost:5173` en tu navegador.
2. Registra un usuario o usa las credenciales de prueba.
3. Crea un cliente y una orden para probar la funcionalidad.

## 🔧 Solución de problemas comunes

### Error de conexión a la base de datos
- Verifica que SQL Server esté ejecutándose.
- Confirma las credenciales en `DATABASE_URL`.
- Asegúrate de que el puerto 1433 no esté bloqueado por firewall.

### Error en migraciones de Prisma
- Ejecuta `npx prisma generate` si hay problemas con el cliente.
- Revisa que la base de datos exista y tengas permisos.

### Puertos ocupados
- Si el puerto 3000 o 5173 están en uso, cambia el puerto en los archivos de configuración respectivos.

### Dependencias faltantes
- Asegúrate de tener Node.js actualizado.
- Borra `node_modules` y ejecuta `npm install` nuevamente.

Si encuentras otros problemas, revisa los logs en la consola o crea un issue en el repositorio.

---

# 📖 Uso de la Aplicación

## Autenticación

1. **Registro**: Ve a `/register` y crea una cuenta. Los roles se asignan por defecto como "USER".
2. **Login**: Ve a `/login` e ingresa tus credenciales. Recibirás un token JWT que se almacena en localStorage.
3. **Acceso protegido**: Las rutas requieren autenticación. Si no tienes token, serás redirigido a login.

## Dashboard

- Accede a `/` después de loguearte.
- Muestra estadísticas: total de clientes, órdenes, totales por moneda y estatus.

## Gestión de Clientes

- **Listar**: Ve a `/customers`. Usa paginación y búsqueda por nombre/email.
- **Crear**: Haz clic en "Nuevo Cliente" y llena el formulario.
- **Ver detalles**: Haz clic en un cliente para ver sus datos y órdenes asociadas.
- **Editar**: Solo usuarios con rol ADMIN pueden editar.
- **Eliminar**: Solo ADMIN pueden eliminar clientes.

## Gestión de Órdenes

- **Crear**: Desde la vista de un cliente, crea una nueva orden.
- **Listar**: Ve a `/orders` para ver todas las órdenes con filtros por estatus, fecha desde/hasta.
- **Cambiar estatus**: Solo ADMIN pueden cancelar órdenes. Una vez cancelada, no se puede modificar.


### Autenticación

- `POST /auth/register` - Registrar usuario
  - Body: `{ email, password, nombre }`
- `POST /auth/login` - Iniciar sesión
  - Body: `{ email, password }`
- `GET /auth/me` - Obtener usuario actual (requiere JWT)

### Clientes

- `POST /customers` - Crear cliente (requiere JWT)
  - Body: `{ nombre, email, telefono?, direccion, documentoFiscal }`
- `GET /customers` - Listar clientes (paginado, búsqueda)
  - Query: `?page=1&q=search`
- `GET /customers/:id` - Obtener cliente por ID
- `PATCH /customers/:id` - Actualizar cliente
- `DELETE /customers/:id` - Eliminar cliente (solo ADMIN)

### Órdenes

- `POST /customers/:id/orders` - Crear orden para cliente
  - Body: `{ monto, moneda, notasInternas? }`
- `GET /customers/:id/orders` - Listar órdenes de cliente
- `PATCH /orders/:id/status` - Cambiar estatus de orden
  - Body: `{ status }` (solo ADMIN para "CANCELADA")
- `GET /orders` - Listar todas las órdenes con filtros
  - Query: `?status=CREADA&from=2023-01-01&to=2023-12-31`

---

# Usuarios de prueba

Administrador
Email:
Pass:

Usuario:
Email: user@example.com
Pass: user123








