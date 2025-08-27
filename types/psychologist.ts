export interface Psychologist {
  id: string
  name: string
  photo: string
  specialties: string[]
  modalities: string[]
  availability: {
    online?: string[]
    presencial?: string[]
  }
  description: string
  experience: string
  rating: number
  isHighDemand?: boolean
}

export interface Booking {
  id: string
  psychologistId: string
  psychologistName: string
  patientName: string
  patientEmail: string
  date: string
  time: string
  specialty: string
  modality: "online" | "presencial"
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
  patientTimezone?: string
  systemTimezone?: string
}

export interface Session {
  id: string
  psychologistId: string
  psychologistName: string
  patientName: string
  specialty: string
  date: string
  time: string
  modality: "online" | "presencial"
  status: "completed" | "scheduled" | "cancelled"
  createdAt: string
}

export interface TimeSlot {
  time: string
  available: boolean
  bookedBy?: string
}

export interface WeeklyAvailability {
  [key: string]: {
    // day of week (monday, tuesday, etc.)
    online: TimeSlot[]
    presencial: TimeSlot[]
  }
}

export interface Statistics {
  mostConsultedSpecialty: {
    specialty: string
    count: number
  }
  busiestDay: {
    day: string
    count: number
  }
  mostUsedModality: {
    modality: string
    count: number
  }
  totalSessions: number
  totalPsychologists: number
}
