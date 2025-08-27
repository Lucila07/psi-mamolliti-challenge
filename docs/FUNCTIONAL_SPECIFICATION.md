# Especificación Funcional - Sistema de Reservas de Psicólogos

## Resumen Ejecutivo

El Sistema de Reservas de Psicólogos es una aplicación web que permite a los pacientes buscar, filtrar y reservar sesiones con psicólogos. La aplicación incluye adaptación automática de zona horaria y sistema de reservas local,

## 1. Funcionalidades Principales

### 1.1 Búsqueda y Filtrado de Psicólogos

**¿Qué se puede hacer?**
- Buscar psicólogos por nombre
- Filtrar por especialidad (Ansiedad, Depresión, Terapia de Pareja, etc.)
- Filtrar por modalidad (Presencial, Virtual, Ambas)
- Filtrar por rango de precios
- Ver información detallada de cada profesional

**¿Cómo funciona?**
1. El usuario accede a la pestaña "Psicólogos" (vista principal)
2. Utiliza la barra de búsqueda para encontrar por nombre
3. Aplica filtros usando los controles laterales
4. Los resultados se actualizan en tiempo real
5. Hace clic en "Ver Perfil" para más detalles

**Flujos cubiertos:**
- ✅ Búsqueda por texto libre
- ✅ Filtrado múltiple combinado
- ✅ Vista de tarjetas responsiva
- ✅ Navegación a perfil detallado

### 1.2 Sistema de Reservas con Adaptación de Zona Horaria

**¿Qué se puede hacer?**
- Reservar sesiones con horarios adaptados a la zona horaria local
- Ver disponibilidad en tiempo real
- Confirmar reservas con información completa
- Recibir confirmación visual de la reserva

**¿Cómo funciona?**
1. Desde el perfil del psicólogo, clic en "Reservar Sesión"
2. El sistema detecta automáticamente la zona horaria del usuario
3. Se muestran horarios disponibles convertidos a la zona horaria local
4. Se indica cuando hay cambio de día debido a diferencias horarias
5. El usuario selecciona fecha y hora preferida
6. Confirma la reserva con todos los detalles
7. La reserva se almacena localmente

**Flujos cubiertos:**
- ✅ Detección automática de zona horaria del usuario
- ✅ Validación de disponibilidad en tiempo real
- ✅ Almacenamiento local de reservas
- ✅ Confirmación visual con detalles completos
- ✅ Integración completa en el flujo de selección de psicólogo

### 1.3 Panel de Estadísticas

**¿Qué se puede hacer?**
- Ver métricas generales del sistema
- Consultar estadísticas de uso
- Analizar patrones de reservas

**¿Cómo funciona?**
1. Acceder a la pestaña "Estadísticas"
2. Ver dashboard con métricas clave
3. Información actualizada en tiempo real

**Flujos cubiertos:**
- ✅ Dashboard de métricas
- ✅ Visualización de estadísticas generales

## 2. Especificaciones Técnicas

### 2.1 Manejo de Zona Horaria

**Zona Horaria Base del Sistema:** `America/Buenos Aires`

**Funcionalidades:**
- Detección automática de zona horaria del usuario usando `Intl.DateTimeFormat`
- Conversión entre zona base y zona del usuario

**Algoritmo de Conversión:**
\`\`\`
1. Horario base (consultorio) → UTC
2. UTC → Zona horaria del usuario
3. Detección de cambio de fecha
4. Formateo con indicadores visuales
\`\`\`

### 2.2 Almacenamiento de Datos

**Método:** LocalStorage del navegador
**Estructura de Datos:**
\`\`\`json
{
  "id": "uuid",
  "psychologistId": "string",
  "psychologistName": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "userTimezone": "timezone_string",
  "modality": "presencial|virtual",
  "price": "number",
  "createdAt": "ISO_string"
}
\`\`\`

## 2. Flujos de Usuario Completos

### 2.1 Flujo Principal: Reservar una Sesión

\`\`\`
1. Usuario accede a la aplicación
2. Navega por lista de psicólogos
3. Aplica filtros según necesidades
4. Selecciona un psicólogo de interés
5. Ve perfil detallado
6. Hace clic en "Reservar Sesión"
7. Sistema detecta zona horaria automáticamente
8. Ve horarios disponibles en su zona horaria local
9. Selecciona fecha y hora preferida
10. Confirma reserva
11. Recibe confirmación visual
12. Reserva se guarda en el sistema
\`\`\`

### 2.2 Flujo de Búsqueda y Filtrado

\`\`\`
1. Usuario utiliza barra de búsqueda
2. Aplica filtros de especialidad
3. Ajusta filtros de modalidad
5. Resultados se actualizan dinámicamente
6. Puede limpiar filtros para nueva búsqueda
\`\`\`

## 4. Casos de Uso Especiales

### 4.1 Diferencias de Zona Horaria 

**Escenario:** Usuario en zona horaria con +12 horas de diferencia
**Comportamiento:** 
- Sistema muestra horario local correctamente
- Indica cambio de fecha cuando aplica
- Mantiene referencia al horario original del consultorio

## 3. Limitaciones Conocidas

### 3.1 Almacenamiento Local
- Las reservas se almacenan solo en el navegador local
- Limpiar datos del navegador elimina las reservas
- No hay interfaz dedicada para gestión de reservas 

### 3.2 Validación de Disponibilidad
- No hay verificación en tiempo real con backend
- Posible conflicto si múltiples usuarios reservan simultáneamente
- Basado en disponibilidad estática predefinida

### 3.3 Zona Horaria
- Depende de configuración correcta del sistema del usuario
