"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Monitor, MapPin, Calendar, Clock, User, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { Psychologist, Booking } from "@/types/psychologist"
import { weeklyAvailability } from "@/data/psychologists"
import {
  saveBookingToStorage,
  generateBookingId,
  isTimeSlotBooked,
  getUserTimezoneInfo,
  convertTimeToUserTimezone,
} from "@/utils/booking"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  psychologist: Psychologist | null
  preselectedDate?: string
  preselectedTime?: string
  preselectedModality?: "online" | "presencial"
}

export function BookingModal({
  isOpen,
  onClose,
  psychologist,
  preselectedDate,
  preselectedTime,
  preselectedModality,
}: BookingModalProps) {
  const [selectedModality, setSelectedModality] = useState<"online" | "presencial" | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [patientName, setPatientName] = useState<string>("")
  const [patientEmail, setPatientEmail] = useState<string>("")
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (isOpen && preselectedDate && preselectedTime && preselectedModality) {
      setSelectedModality(preselectedModality)
      setSelectedDate(preselectedDate)
      setSelectedTime(preselectedTime)
    }
  }, [isOpen, preselectedDate, preselectedTime, preselectedModality])

  if (!psychologist) return null

  const handleModalChange = (open: boolean) => {
    if (!open) {
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setSelectedModality(null)
    setSelectedDate("")
    setSelectedTime("")
    setSelectedSpecialty("")
    setPatientName("")
    setPatientEmail("")
    setBookingStatus("idle")
    setErrorMessage("")
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

      // Check if psychologist has availability for this day and modality
      const dayAvailability = weeklyAvailability[psychologist.id]?.[dayName]
      if (selectedModality && dayAvailability?.[selectedModality]?.length > 0) {
        dates.push({
          value: date.toISOString().split("T")[0],
          label: date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        })
      }
    }
    return dates
  }

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !selectedModality || !psychologist) return []

    const date = new Date(selectedDate)
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const dayAvailability = weeklyAvailability[psychologist.id]?.[dayName]

    if (!dayAvailability?.[selectedModality]) return []

    const userTimezoneInfo = getUserTimezoneInfo()

    return dayAvailability[selectedModality]
      .filter((slot) => slot.available && !isTimeSlotBooked(psychologist.id, selectedDate, slot.time, selectedModality))
      .map((slot) => {
        const convertedTime = convertTimeToUserTimezone(slot.time, selectedDate, userTimezoneInfo.timezone)

        return {
          value: slot.time, // Mantener el horario original para el backend
          label: `${convertedTime.time}${convertedTime.isNextDay ? " (+1 día)" : convertedTime.isPrevDay ? " (-1 día)" : ""} (${userTimezoneInfo.offset})`,
          displayTime: convertedTime.time,
          originalTime: slot.time,
          dateAdjustment: convertedTime.isNextDay ? "+1" : convertedTime.isPrevDay ? "-1" : "0",
        }
      })
  }

  const handleBooking = () => {
    if (!selectedModality || !selectedDate || !selectedTime || !selectedSpecialty || !patientName || !patientEmail) {
      setErrorMessage("Por favor completa todos los campos")
      setBookingStatus("error")
      return
    }

    // Check if slot is still available
    if (isTimeSlotBooked(psychologist.id, selectedDate, selectedTime, selectedModality)) {
      setErrorMessage("Este horario ya no está disponible. Por favor selecciona otro.")
      setBookingStatus("error")
      return
    }

    const booking: Booking = {
      id: generateBookingId(),
      psychologistId: psychologist.id,
      psychologistName: psychologist.name,
      patientName,
      patientEmail,
      date: selectedDate,
      time: selectedTime,
      specialty: selectedSpecialty,
      modality: selectedModality,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    try {
      saveBookingToStorage(booking)
      setBookingStatus("success")

      // Close modal after 2 seconds
      setTimeout(() => {
        resetForm()
        onClose()
      }, 2000)
    } catch (error) {
      setErrorMessage("Error al guardar la reserva. Inténtalo de nuevo.")
      setBookingStatus("error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Reservar sesión con {psychologist.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {bookingStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Reserva confirmada! Recibirás un email de confirmación en breve.
              </AlertDescription>
            </Alert>
          )}

          {bookingStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {bookingStatus !== "success" && (
            <>
              {/* Modality Selection */}
              {psychologist.modalities.length > 1 && !selectedModality && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Selecciona la modalidad de tu sesión
                  </h3>
                  <div className="grid gap-3">
                    {psychologist.modalities.map((modality) => (
                      <div
                        key={modality}
                        className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedModality(modality.toLowerCase() as "online" | "presencial")}
                      >
                        <div className="flex items-center gap-3">
                          {modality === "Online" ? (
                            <Monitor className="w-5 h-5 text-primary" />
                          ) : (
                            <MapPin className="w-5 h-5 text-primary" />
                          )}
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">
                              {modality}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {psychologist.availability[
                                modality.toLowerCase() as keyof typeof psychologist.availability
                              ]?.map((schedule, index) => (
                                <div key={index}>{schedule}</div>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Seleccionar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto-select modality if only one available */}
              {psychologist.modalities.length === 1 && !selectedModality && (
                <div className="hidden">
                  {setSelectedModality(psychologist.modalities[0].toLowerCase() as "online" | "presencial")}
                </div>
              )}

              {/* Booking Form */}
              {(selectedModality || psychologist.modalities.length === 1) && (
                <div className="space-y-4">
                  {selectedModality && psychologist.modalities.length > 1 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="flex items-center gap-2">
                        {selectedModality === "online" ? (
                          <Monitor className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        Modalidad: {selectedModality === "online" ? "Online" : "Presencial"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedModality(null)}>
                        Cambiar modalidad
                      </Button>
                    </div>
                  )}

                  {/* Patient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nombre completo
                      </Label>
                      <Input
                        id="patientName"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientEmail" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  {/* Specialty Selection */}
                  <div className="space-y-2">
                    <Label>Especialidad</Label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {psychologist.specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha
                    </Label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableDates().map((date) => (
                          <SelectItem key={date.value} value={date.value}>
                            {date.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Horarios disponibles
                      </Label>
                      <div className="text-xs text-muted-foreground mb-2">
                        Tu zona horaria: {getUserTimezoneInfo().name} ({getUserTimezoneInfo().offset})
                      </div>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un horario" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableTimeSlots().map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {selectedDate && selectedTime && selectedSpecialty && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <h4 className="font-semibold">Resumen de tu reserva:</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Psicólogo:</strong> {psychologist.name}
                        </p>
                        <p>
                          <strong>Especialidad:</strong> {selectedSpecialty}
                        </p>
                        <p>
                          <strong>Modalidad:</strong> {selectedModality === "online" ? "Online" : "Presencial"}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {new Date(selectedDate).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          <strong>Horario:</strong> {(() => {
                            const userTimezoneInfo = getUserTimezoneInfo()
                            const convertedTime = convertTimeToUserTimezone(
                              selectedTime,
                              selectedDate,
                              userTimezoneInfo.timezone,
                            )
                            return `${convertedTime.time}${convertedTime.isNextDay ? " (+1 día)" : convertedTime.isPrevDay ? " (-1 día)" : ""}`
                          })()} en tu zona horaria
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Horario del consultorio: {selectedTime} (Buenos Aires)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleBooking}
                    className="w-full"
                    disabled={!selectedDate || !selectedTime || !selectedSpecialty || !patientName || !patientEmail}
                  >
                    Confirmar Reserva
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
