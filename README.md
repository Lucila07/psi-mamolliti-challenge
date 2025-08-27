# MindConnect - Plataforma de Reservas Psicológicas

## 📌 Descripción General

MindConnect es una plataforma web para la reserva de sesiones con psicólogos profesionales. El sistema permite a los pacientes explorar perfiles de psicólogos, filtrar por especialidades y modalidades de atención, y reservar sesiones tanto online como presenciales.

La plataforma está diseñada con un enfoque mobile-first y prioriza la experiencia del usuario, ofreciendo una interfaz limpia y profesional que transmite confianza en el ámbito de la salud mental.

## ⚙️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **React 18** con hooks modernos para gestión de estado
- **TypeScript** para tipado estático
- **Tailwind CSS v4** para diseño responsive
- **shadcn/ui** como base del sistema de componentes
- **Lucide React** para iconografía

### Datos
- **LocalStorage** para persistencia de datos de reservas
- **Datos mockeados en TypeScript** con interfaces tipadas

## 🚀 Funcionalidades Principales

### Gestión de Psicólogos
- **Listado completo** con fotos, especialidades y modalidades disponibles
- **Perfiles detallados** con información profesional y experiencia
- **Sistema de badges** para identificar modalidades (Online/Presencial)

### Sistema de Filtros
- **Filtro por especialidades**: Ansiedad, Depresión, Terapia de Pareja, etc.
- **Filtro por modalidades**: Online, Presencial o ambas
- **Búsqueda por texto** en nombres y especialidades
- **Filtros combinables** para búsquedas específicas

### Sistema de Reservas
- **Reserva directa** desde el perfil del psicólogo seleccionado
- **Selección de modalidad** (Online/Presencial) según disponibilidad
- **Persistencia local** de reservas usando LocalStorage

### Navegación por Pestañas
- **Psicólogos**: Listado, filtros y reserva de profesionales
- **Estadísticas**: Dashboard con métricas de la plataforma

## 📖 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación
````# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
````

### Scripts Disponibles
````npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
````

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

````
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales y tokens de diseño
│   ├── layout.tsx         # Layout principal con fuentes
│   ├── loading.tsx        # Componente de carga
│   └── page.tsx           # Página principal con navegación por pestañas
├── components/            # Componentes reutilizables
│   ├── booking-modal.tsx  # Modal de reserva con calendario
│   ├── psychologist-card.tsx    # Tarjeta de psicólogo
│   ├── psychologist-detail.tsx  # Vista detallada con reserva
│   ├── statistics-dashboard.tsx # Dashboard de estadísticas
│   ├── theme-provider.tsx # Proveedor de tema
│   └── ui/               # Componentes base de shadcn/ui
├── data/                  # Datos mockeados
│   └── psychologists.ts   # Dataset de psicólogos
├── hooks/                 # Custom hooks
│   ├── use-mobile.tsx     # Hook para detección móvil
│   └── use-toast.ts       # Hook para notificaciones
├── lib/                   # Utilidades
│   └── utils.ts           # Funciones de utilidad (cn, etc.)
├── types/                 # Definiciones de TypeScript
│   └── psychologist.ts    # Interfaces y tipos
└── public/               # Assets estáticos
````

## 🔮 Próximos Pasos

### Funcionalidades Planeadas
- **Autenticación de usuarios** con roles diferenciados
- **Dashboard para psicólogos** para gestionar perfil y disponibilidad
- **Sistema de notificaciones** por email
- **Integración con servicios de videollamada** para sesiones online
- **Base de datos persistente** (migración desde LocalStorage)
- **Sistema de pagos** para reserva de sesiones
