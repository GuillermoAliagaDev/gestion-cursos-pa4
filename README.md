# 🎓 OfCourse - Gestión de Cursos e Inscripciones

**Programación Web II - PA4 | Experiencia Integrada (React + Next.js + API REST)**

---

## Integrantes

| Integrante | Rol | Aporte |
|------------|-----|--------|
| _Guillermo Aliaga Matencio_ | _Rol_ | _50%_ |
| _Geraldine Khatrina Tudela Theo_ | _Rol_ | _50%_ |

---

## Descripción del Proyecto

OfCourse es un sistema integrado de **Gestión de Cursos e Inscripciones** compuesto por tres módulos:

1. **API REST** (`server/`) — Backend con Express + JWT que expone endpoints de autenticación, cursos e inscripciones.
2. **Portal del Estudiante** (`react-portal/`) — SPA en React con Vite para que los estudiantes inicien sesión, consulten cursos y gestionen inscripciones.
3. **Módulo Público** (`nextjs-public/`) — Sitio público en Next.js (App Router) con la oferta académica, accesible sin autenticación, usando SSG (Static Site Generation).

---

## Tecnologías Usadas

| Capa | Tecnología |
|------|-----------|
| Frontend (Portal) | React 18 + Vite + React Router + Axios |
| Frontend (Público) | Next.js 14 (App Router) |
| Backend (API) | Node.js + Express + JWT (jsonwebtoken) |
| Autenticación | JWT (JSON Web Tokens) |
| Estilos | CSS vanilla (sin frameworks) |

---

## Estructura del Proyecto

```
ofcourse/
├── server/                    # API REST (Express + JWT)
│   ├── src/
│   │   └── index.js           # Servidor Express
│   ├── .env.example
│   └── package.json
├── react-portal/              # Portal del Estudiante (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── context/           # AuthContext (manejo de sesión)
│   │   ├── services/          # api.js (Axios + interceptors)
│   │   ├── components/        # ProtectedRoute
│   │   ├── pages/             # Login, Dashboard, Cursos, CursoDetalle
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── nextjs-public/             # Módulo Público (Next.js)
│   ├── src/
│   │   └── app/
│   │       ├── layout.js
│   │       ├── page.js        # Página de inicio
│   │       ├── globals.css
│   │       └── cursos/
│   │           ├── page.js    # Catálogo (SSG)
│   │           └── [id]/
│   │               └── page.js # Detalle dinámico (SSG)
│   ├── .env.example
│   └── package.json
├── package.json               # Scripts raíz
├── .gitignore
└── README.md
```

---

## Instalación y Ejecución

### Requisitos

- Node.js 18+ 
- npm

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ofcourse
```

### 2. Instalar dependencias

```bash
# Opción 1: Desde la raíz
cd server && npm install
cd ../react-portal && npm install
cd ../nextjs-public && npm install
cd ..

# Opción 2: Usando el script raíz
npm run install:all
```

### 3. Configurar variables de entorno

Cada módulo tiene su propio archivo `.env.example`. Copie a `.env` (o `.env.local`) y ajuste si es necesario:

**server/.env**
```env
PORT=4000
JWT_SECRET=mi_secreto_super_seguro_cambiame
```

**react-portal/.env**
```env
VITE_API_URL=http://localhost:4000/api
```

**nextjs-public/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Iniciar el proyecto

En **tres terminales separadas**:

```bash
# Terminal 1 - API
cd server
npm run dev

# Terminal 2 - Portal React
cd react-portal
npm run dev

# Terminal 3 - Next.js Público
cd nextjs-public
npm run dev
```

### 5. Acceder

| Módulo | URL |
|--------|-----|
| API REST | http://localhost:4000 |
| Portal del Estudiante | http://localhost:5173 |
| Módulo Público (Next.js) | http://localhost:3000 |

### Credenciales de prueba

| Correo | Contraseña |
|--------|-----------|
| estudiante@isil.pe | 123456 |
| maria@isil.pe | 123456 |

---

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` (server) | Puerto del servidor API | `4000` |
| `JWT_SECRET` (server) | Secreto para firmar tokens JWT | `mi_secreto_super_seguro_cambiame` |
| `VITE_API_URL` (react-portal) | URL base de la API | `http://localhost:4000/api` |
| `NEXT_PUBLIC_API_URL` (nextjs-public) | URL base de la API (pública) | `http://localhost:4000/api` |

---

## Funcionalidades Implementadas

### Portal del Estudiante (React)

- [x] **Inicio de sesión** con JWT y validación de credenciales
- [x] **Listado de cursos** con indicador de vacantes
- [x] **Detalle de curso** con información completa y barra de ocupación
- [x] **Inscripción a cursos** con validación de vacantes y duplicados
- [x] **Dashboard protegido** con inscripciones del estudiante
- [x] **Cierre de sesión** con limpieza de token y redirección
- [x] **Rutas protegidas** via componente `ProtectedRoute`
- [x] **Interceptor Axios** para adjuntar token y manejar 401
- [x] **Estados de carga, error y respuesta vacía**

### Módulo Público (Next.js)

- [x] **Página de inicio** con hero y características
- [x] **Catálogo de cursos** (SSG - Static Site Generation)
- [x] **Detalle dinámico de curso** con `generateStaticParams`
- [x] **Layout compartido** con header y footer
- [x] **Renderizado estático** con revalidación cada 60 segundos

---

## Manejo de Sesión (JWT)

1. El usuario ingresa credenciales en `/login`
2. La API valida y devuelve un **JWT** con expiración de 2 horas
3. El token se almacena en **`localStorage`** (clave: `ofcourse_token`)
4. El **interceptor de Axios** adjunta el token en cada petición
5. Si la API responde `401`, el interceptor limpia el token y redirige a `/login`
6. El **cierre de sesión** elimina el token y los datos del usuario de `localStorage`

> **¿Por qué localStorage?** Es el mecanismo más simple y directo para SPAs sin backend propio. Para mayor seguridad en producción se recomienda usar cookies `httpOnly` con un servidor backend que maneje la sesión.

---

## Build de Producción

### Portal React

```bash
cd react-portal
npm run build
# Salida: ./dist/
```

### Next.js (Público)

```bash
cd nextjs-public
npm run build
# Salida: ./next/ (producción con `npm start`)
```

Ambos builds se han verificado sin errores críticos.

---

## Capturas de Pantalla

_> Inserte aquí capturas de las vistas principales:_

| Vista | Captura |
|-------|---------|
| Login | `[captura]` |
| Dashboard | `[captura]` |
| Catálogo de cursos | `[captura]` |
| Detalle de curso | `[captura]` |
| Next.js - Inicio | `[captura]` |
| Next.js - Catálogo público | `[captura]` |
| Next.js - Detalle público | `[captura]` |
| Build exitoso | `[captura]` |

---

## Video de Sustentación

[▶ Ver video en YouTube](https://youtube.com/URL_DEL_VIDEO)

> El video muestra a los integrantes con cámaras encendidas explicando el trabajo realizado, las decisiones técnicas y la funcionalidad del sistema.

---

## Distribución de Aportes

| Integrante | Contribución |
|------------|-------------|
| _Nombre 1_ | API REST, autenticación JWT |
| _Nombre 2_ | Portal React, vistas, consumo de API |
| _Nombre 3_ | Módulo Next.js, rutas, SSG |
| _Nombre 4_ | Documentación, README, video |

---

## Licencia

Proyecto académico - ISIL &copy; 2026
