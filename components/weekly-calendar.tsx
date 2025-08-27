"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Clock, Monitor, MapPin } from "lucide-react"
import type { Psychologist } from "@/types/psychologist"
import { psychologists, weeklyAvailability } from "@/data/psychologists"
import { isTimeSlotBooked, getUserTimezoneInfo, convertTimeToUserTimezone } from "@/utils/booking"

interface WeeklyCalendarProps {
  selectedPsychologist?: Psychologist | null
  onTimeSlotClick?: (psychologist: Psychologist, date: string, time: string, modality: "online" | "presencial") => void
}

export function WeeklyCalendar({ selectedPsychologist, onTimeSlotClick }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedPsychologistId, setSelectedPsychologistId] = useState<string>(
    selectedPsychologist?.id || psychologists[0].id,
  )
  const [selectedModality, setSelectedModality] = useState<"online" | "presencial">("online")

  const psychologist = psychologists.find((p) => p.id === selectedPsychologistId) || psychologists[0]

  // Get the start of the current week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  const weekStart = getWeekStart(currentWeek)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  }

  const getTimeSlots = (date: Date) => {
    const dayName = getDayName(date)
    const availability = weeklyAvailability[psychologist.id]?.[dayName]

    if (!availability?.[selectedModality]) return []

    const dateString = date.toISOString().split("T")[0]
    const userTimezoneInfo = getUserTimezoneInfo()

    return availability[selectedModality].map((slot) => {
      const convertedTime = convertTimeToUserTimezone(slot.time, dateString, userTimezoneInfo.timezone)

      return {
        ...slot,
        displayTime: convertedTime.time,
        originalTime: slot.time,
        isBooked: isTimeSlotBooked(psychologist.id, dateString, slot.time, selectedModality),
        isPast:
          date < new Date() ||
          (date.toDateString() === new Date().toDateString() && slot.time < new Date().toTimeString().slice(0, 5)),
        dateAdjustment: convertedTime.isNextDay ? "+1" : convertedTime.isPrevDay ? "-1" : "0",
      }
    })
  }

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (onTimeSlotClick) {
      const dateString = date.toISOString().split("T")[0]
      onTimeSlotClick(psychologist, dateString, time, selectedModality)
    }
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const availableModalities = psychologist.modalities.map((m) => m.toLowerCase() as "online" | "presencial")

  // Update selected modality if current one is not available for this psychologist
  useEffect(() => {
    if (!availableModalities.includes(selectedModality)) {
      setSelectedModality(availableModalities[0])
    }
  }, [selectedPsychologistId])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendario Semanal
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Psychologist Selector */}
            <Select value={selectedPsychologistId} onValueChange={setSelectedPsychologistId}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {psychologists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Modality Selector */}
            <Select
              value={selectedModality}
              onValueChange={(value) => setSelectedModality(value as "online" | "presencial")}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableModalities.map((modality) => (
                  <SelectItem key={modality} value={modality}>
                    <div className="flex items-center gap-2">
                      {modality === "online" ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {modality === "online" ? "Online" : "Presencial"}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Horarios mostrados en tu zona horaria: {getUserTimezoneInfo().name} ({getUserTimezoneInfo().offset})
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="text-sm font-medium">
            {weekStart.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </div>

          <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((date, dayIndex) => {
            const timeSlots = getTimeSlots(date)
            const hasSlots = timeSlots.length > 0

            return (
              <div key={dayIndex} className="space-y-2">
                {/* Day Header */}
                <div className="text-center">
                  <div className={`text-sm font-medium ${isToday(date) ? "text-primary" : "text-muted-foreground"}`}>
                    {date.toLocaleDateString("es-ES", { weekday: "short" })}
                  </div>
                  <div className={`text-lg font-semibold ${isToday(date) ? "text-primary" : ""}`}>{date.getDate()}</div>
                </div>

                {/* Time Slots */}
                <div className="space-y-1">
                  {!hasSlots ? (
                    <div className="text-xs text-muted-foreground text-center py-4">Sin disponibilidad</div>
                  ) : (
                    timeSlots.map((slot) => {
                      const isAvailable = slot.available && !slot.isBooked && !slot.isPast

                      return (
                        <Button
                          key={slot.time}
                          variant={isAvailable ? "outline" : "ghost"}
                          size="sm"
                          className={`w-full text-xs h-8 ${
                            isAvailable
                              ? "hover:bg-primary hover:text-primary-foreground cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          } ${
                            slot.isBooked
                              ? "bg-red-50 text-red-700 border-red-200"
                              : slot.isPast
                                ? "bg-gray-50 text-gray-400"
                                : ""
                          }`}
                          disabled={!isAvailable}
                          onClick={() => isAvailable && handleTimeSlotClick(date, slot.originalTime)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {slot.displayTime}
                            </div>
                            {slot.dateAdjustment !== "0" && (
                              <span className="text-[10px] text-muted-foreground">
                                {slot.dateAdjustment === "+1" ? "+1d" : "-1d"}
                              </span>
                            )}
                          </div>
                        </Button>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-gray-300 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
              <span>Pasado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
