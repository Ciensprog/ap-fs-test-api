# 🏢 Alto Porte - Backend REST API (Node.js + Express + TypeScript + MongoDB)

API REST profesional y extensible para la gestión y seguimiento comercial de leads inmobiliarios, desarrollada con **Node.js**, **Express.js**, **TypeScript**, **Mongoose** y **MongoDB**, como parte de la evaluación técnica de **Alto Porte**.

---

## 📋 Tabla de Contenidos

- [🏢 Alto Porte - Backend REST API (Node.js + Express + TypeScript + MongoDB)](#-alto-porte---backend-rest-api-nodejs--express--typescript--mongodb)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [💻 Requisitos del Sistema](#-requisitos-del-sistema)
  - [⚙️ Instalación y Configuración](#️-instalación-y-configuración)
  - [🗄️ Carga de Datos de Prueba (Seed)](#️-carga-de-datos-de-prueba-seed)
  - [🚀 Ejecución del Proyecto](#-ejecución-del-proyecto)
    - [Modo Desarrollo (con Hot-Reloading):](#modo-desarrollo-con-hot-reloading)
    - [Compilación y Ejecución en Producción:](#compilación-y-ejecución-en-producción)
  - [📡 Endpoints de la API](#-endpoints-de-la-api)
    - [1. Estado de Salud (`Health Check`)](#1-estado-de-salud-health-check)
    - [2. Listado de Leads](#2-listado-de-leads)
    - [3. Obtener Lead por ID](#3-obtener-lead-por-id)
    - [4. Crear un Nuevo Lead](#4-crear-un-nuevo-lead)
    - [5. Actualizar Estado Comercial](#5-actualizar-estado-comercial)
    - [6. Resumen del Dashboard (MongoDB Aggregation Pipeline)](#6-resumen-del-dashboard-mongodb-aggregation-pipeline)
  - [🏗️ Arquitectura del Backend](#️-arquitectura-del-backend)
  - [🧪 Pruebas Automatizadas](#-pruebas-automatizadas)
  - [💡 Decisiones Técnicas y Supuestos](#-decisiones-técnicas-y-supuestos)
  - [⚠️ Limitaciones y Deuda Técnica](#️-limitaciones-y-deuda-técnica)
  - [🤖 Declaración de Uso de IA](#-declaración-de-uso-de-ia)

---

## 💻 Requisitos del Sistema

- **Node.js**: `v18.x` o superior
- **npm**: `v9.x` o superior
- **MongoDB**: `v6.0` o superior (Servicio local en puerto 27017 o contenedor Docker)

---

## ⚙️ Instalación y Configuración

1. **Clonar e ingresar al repositorio backend**:

   ```bash
   git clone <URL_DEL_REPOSITORIO> ap-fs-test-api
   cd ap-fs-test-api
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   Copiar el archivo `.env.example` para crear el archivo `.env`:

   ```bash
   cp .env.example .env
   ```

   _Contenido de ejemplo para `.env`:_

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/alto_porte_db
   NODE_ENV=development
   ```

---

## 🗄️ Carga de Datos de Prueba (Seed)

Para poblar la base de datos MongoDB con el conjunto de datos de prueba especificado en el **Anexo A** (10 leads representativos), ejecute el siguiente comando:

```bash
npm run seed
```

El script limpiará la colección `leads` e insertará los 10 registros base con sus fechas y estados comerciales exactos.

---

## 🚀 Ejecución del Proyecto

### Modo Desarrollo (con Hot-Reloading):

```bash
npm run dev
```

La API estará accesible en `http://localhost:3000`.

### Compilación y Ejecución en Producción:

```bash
npm run build
npm start
```

---

## 📡 Endpoints de la API

### 1. Estado de Salud (`Health Check`)

- **`GET /api/health`**
  - **Descripción**: Verifica que la API y la conexión a MongoDB estén operativas.
  - **Respuesta 200 OK**:
    ```json
    {
      "status": "UP",
      "timestamp": "2026-09-02T00:00:00.000Z",
      "service": "Alto Porte Lead Management API",
      "database": "CONNECTED"
    }
    ```

### 2. Listado de Leads

- **`GET /api/leads`**
  - **Filtros opcionales**: `search` (búsqueda por nombre o correo), `status`, `source`, `project`
  - **Paginación**: `page` (default 1), `limit` (default 10)
  - **Ordenamiento**: `sortBy` (`createdAt` | `budget`), `sortOrder` (`asc` | `desc`)
  - **Ejemplo**: `GET /api/leads?search=carlos&status=Nuevo&page=1&limit=5&sortBy=budget&sortOrder=desc`

### 3. Obtener Lead por ID

- **`GET /api/leads/:id`**
  - **Descripción**: Retorna la información de un lead por su Mongo ObjectId.
  - **Errores**: Retorna `400` para ID inválido y `404` si el lead no existe.

### 4. Crear un Nuevo Lead

- **`POST /api/leads`**
  - **Body JSON obligatorio**:
    ```json
    {
      "name": "Carlos Mendoza",
      "email": "carlos@example.com",
      "phone": "7000-1001",
      "source": "Facebook",
      "status": "Nuevo",
      "budget": 145000,
      "project": "Residencial Altavista"
    }
    ```
  - **Validaciones**: `name` y `email` válidos obligatorios, `budget > 0`, `status` permitido (`Nuevo`, `Contactado`, `Calificado`, `Reservado`, `Descartado`).

### 5. Actualizar Estado Comercial

- **`PATCH /api/leads/:id/status`**
  - **Body JSON**:
    ```json
    {
      "status": "Calificado"
    }
    ```

### 6. Resumen del Dashboard (MongoDB Aggregation Pipeline)

- **`GET /api/dashboard/summary`**
  - **Descripción**: Calcula dinámicamente mediante Aggregation Pipeline (`$facet`) todos los kpis comerciales sin iterar en memoria.
  - **Respuesta de control (con datos de Anexo A)**:
    ```json
    {
      "success": true,
      "data": {
        "totalLeads": 10,
        "averageBudget": 174000,
        "reservedLeads": 2,
        "conversionRate": 20,
        "byStatus": [{ "label": "Nuevo", "count": 2 }, ...],
        "bySource": [{ "label": "Facebook", "count": 3 }, ...],
        "byProject": [{ "label": "Residencial Altavista", "count": 4 }, ...]
      }
    }
    ```

---

## 🏗️ Arquitectura del Backend

La arquitectura sigue el patrón por capas (**Controller-Service-Repository/Model**):

```
src/
├── config/           # Configuración de base de datos Mongoose
├── controllers/      # Controladores HTTP de Express (Gestión req/res)
├── middlewares/      # Validaciones y manejo centralizado de excepciones
├── models/           # Esquema Mongoose, tipos de TS e índices compuestos
├── routes/           # Rutas organizadas modularmente por recurso
├── seed/             # Script de carga de datos iniciales
├── services/         # Lógica de negocio y MongoDB Aggregation Pipelines
└── tests/            # Suites de pruebas automatizadas con Jest y Supertest
```

---

## 🧪 Pruebas Automatizadas

Se incluyeron pruebas unitarias e integrales para verificar las rutas de la API, la lógica de validación y la pipeline de agregación.

Para ejecutar la suite de pruebas:

```bash
npm test
```

---

## 💡 Decisiones Técnicas y Supuestos

1. **Pipeline de Agregación Optimizado (`$facet`)**: Se utilizó `$facet` en MongoDB para calcular los totales globales, promedios y agrupaciones en una sola consulta a base de datos.
2. **Índices de Base de Datos**: Se implementaron índices compuestos (`status + createdAt`, `source + createdAt`, `project + createdAt`) anticipando crecimiento de volumen.
3. **Manejo Centralizado de Errores**: Todo error no controlado es capturado por un middleware global que responde con un formato consistente en JSON sin exponer datos sensibles.

---

## ⚠️ Limitaciones y Deuda Técnica

- **Autenticación/Autorización**: Por alcance de la prueba, no se exigió JWT/OAuth2. Para producción se debe integrar un middleware de autenticación.
- **Caché en Memoria**: Para bases de datos superiores a 5 millones de registros, se sugiere integrar Redis para almacenar en caché la respuesta del dashboard con un TTL de 5 minutos.

---

## 🤖 Declaración de Uso de IA

Se utilizaron asistentes de Inteligencia Artificial (Gemini) para acelerar la estructuración de la documentación técnica y generar las plantillas iniciales de las pruebas automatizadas.
