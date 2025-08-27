import type { Booking, Statistics } from "@/types/psychologist"
import { simulatedSessions } from "@/data/psychologists"

export const SYSTEM_TIMEZONE = "America/Argentina/Buenos_Aires" // Zona horaria base del consultorio

export const getBookingsFromStorage = (): Booking[] => {
  if (typeof window === "undefined") return []
  const bookings = localStorage.getItem("psychology-bookings")
  return bookings ? JSON.parse(bookings) : []
}

export const saveBookingToStorage = (booking: Booking): void => {
  if (typeof window === "undefined") return
  const bookings = getBookingsFromStorage()
  bookings.push(booking)
  localStorage.setItem("psychology-bookings", JSON.stringify(bookings))
}

export const getBookings = getBookingsFromStorage
export const saveBooking = saveBookingToStorage

export const removeBookingFromStorage = (bookingId: string): void => {
  if (typeof window === "undefined") return
  const bookings = getBookingsFromStorage()
  const filteredBookings = bookings.filter((b) => b.id !== bookingId)
  localStorage.setItem("psychology-bookings", JSON.stringify(filteredBookings))
}

export const isTimeSlotBooked = (
  psychologistId: string,
  date: string,
  time: string,
  modality: "online" | "presencial",
): boolean => {
  const bookings = getBookingsFromStorage()
  return bookings.some(
    (booking) =>
      booking.psychologistId === psychologistId &&
      booking.date === date &&
      booking.time === time &&
      booking.modality === modality &&
      booking.status !== "cancelled",
  )
}

export const generateBookingId = (): string => {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const calculateStatistics = (): Statistics => {
  const allSessions = [...simulatedSessions, ...getBookingsFromStorage()]

  // Most consulted specialty
  const specialtyCount: { [key: string]: number } = {}
  allSessions.forEach((session) => {
    specialtyCount[session.specialty] = (specialtyCount[session.specialty] || 0) + 1
  })

  const mostConsultedSpecialty = Object.entries(specialtyCount).reduce(
    (max, [specialty, count]) => (count > max.count ? { specialty, count } : max),
    { specialty: "", count: 0 },
  )

  // Busiest day
  const dayCount: { [key: string]: number } = {}
  allSessions.forEach((session) => {
    const date = new Date(session.date)
    const dayName = date.toLocaleDateString("es-ES", { weekday: "long" })
    dayCount[dayName] = (dayCount[dayName] || 0) + 1
  })

  const busiestDay = Object.entries(dayCount).reduce(
    (max, [day, count]) => (count > max.count ? { day, count } : max),
    { day: "", count: 0 },
  )

  // Most used modality
  const modalityCount: { [key: string]: number } = {}
  allSessions.forEach((session) => {
    modalityCount[session.modality] = (modalityCount[session.modality] || 0) + 1
  })

  const mostUsedModality = Object.entries(modalityCount).reduce(
    (max, [modality, count]) => (count > max.count ? { modality, count } : max),
    { modality: "", count: 0 },
  )

  return {
    mostConsultedSpecialty,
    busiestDay,
    mostUsedModality,
    totalSessions: allSessions.length,
    totalPsychologists: new Set(allSessions.map((s) => s.psychologistId)).size,
  }
}

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const formatTimeForTimezone = (time: string, targetTimezone: string = getUserTimezone()): string => {
  const [hours, minutes] = time.split(":")

  // Crear fecha en la zona horaria del sistema (consultorio)
  const today = new Date()
  const systemDate = new Date(today.toLocaleDateString("en-CA")) // YYYY-MM-DD format
  systemDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

  // Convertir a la zona horaria del usuario
  return systemDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: targetTimezone,
    hour12: false,
  })
}

export const convertTimeToUserTimezone = (
  time: string,
  date: string,
  userTimezone: string = getUserTimezone(),
): { time: string; date: string; isNextDay: boolean; isPrevDay: boolean } => {
  const [hours, minutes] = time.split(":")

  // Crear fecha completa en la zona horaria del sistema
  const systemDateTime = new Date(`${date}T${time}:00`)

  // Obtener el offset de la zona horaria del sistema
  const systemOffset = getTimezoneOffset(SYSTEM_TIMEZONE, systemDateTime)
  const userOffset = getTimezoneOffset(userTimezone, systemDateTime)

  // Calcular la diferencia en minutos
  const offsetDiff = userOffset - systemOffset

  // Aplicar la diferencia
  const userDateTime = new Date(systemDateTime.getTime() + offsetDiff * 60000)

  const userTime = userDateTime.toTimeString().slice(0, 5)
  const userDate = userDateTime.toISOString().split("T")[0]

  const isNextDay = userDate > date
  const isPrevDay = userDate < date

  return {
    time: userTime,
    date: userDate,
    isNextDay,
    isPrevDay,
  }
}

const getTimezoneOffset = (timezone: string, date: Date): number => {
  const utc1 = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const utc2 = new Date(date.toLocaleString("en-US", { timeZone: timezone }))
  return (utc2.getTime() - utc1.getTime()) / (1000 * 60)
}

export const getUserTimezoneInfo = (): { timezone: string; offset: string; name: string } => {
  const timezone = getUserTimezone()
  const now = new Date()

  // Obtener el offset UTC en formato +/-HH:MM
  const utcOffset = -now.getTimezoneOffset()
  const hours = Math.floor(Math.abs(utcOffset) / 60)
  const minutes = Math.abs(utcOffset) % 60
  const sign = utcOffset >= 0 ? "+" : "-"
  const utcOffsetString = `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

  // Intentar obtener la abreviación de zona horaria
  let shortName = ""
  try {
    const formatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: timezone,
      timeZoneName: "short",
    })
    const parts = formatter.formatToParts(now)
    const timeZonePart = parts.find((part) => part.type === "timeZoneName")
    shortName = timeZonePart?.value || ""
  } catch (error) {
    // Fallback si falla la obtención del nombre corto
    shortName = utcOffsetString
  }

  // Usar el nombre corto si está disponible, sino usar el offset UTC
  const offset = shortName && shortName !== timezone ? shortName : utcOffsetString

  const name = timezone.split("/").pop()?.replace("_", " ") || timezone

  return {
    timezone,
    offset,
    name,
  }
}
