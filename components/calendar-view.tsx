"use client"

import { useState } from "react"
import { WeeklyCalendar } from "./weekly-calendar"
import { BookingModal } from "./booking-modal"
import type { Psychologist } from "@/types/psychologist"

export function CalendarView() {
  const [selectedBooking, setSelectedBooking] = useState<{
    psychologist: Psychologist
    date: string
    time: string
    modality: "online" | "presencial"
  } | null>(null)

  const handleTimeSlotClick = (
    psychologist: Psychologist,
    date: string,
    time: string,
    modality: "online" | "presencial",
  ) => {
    setSelectedBooking({ psychologist, date, time, modality })
  }

  const handleCloseModal = () => {
    setSelectedBooking(null)
  }

  return (
    <div>
      <WeeklyCalendar onTimeSlotClick={handleTimeSlotClick} />

      <BookingModal
        isOpen={!!selectedBooking}
        onClose={handleCloseModal}
        psychologist={selectedBooking?.psychologist || null}
        preselectedDate={selectedBooking?.date}
        preselectedTime={selectedBooking?.time}
        preselectedModality={selectedBooking?.modality}
      />
    </div>
  )
}
