"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, Calendar, Clock, Monitor, MapPin } from "lucide-react"
import type { Psychologist } from "@/types/psychologist"

interface PsychologistDetailProps {
  psychologist: Psychologist
  onBack: () => void
  onBookSession: (psychologist: Psychologist) => void
}

export function PsychologistDetail({ psychologist, onBack, onBookSession }: PsychologistDetailProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4 p-0 h-auto font-normal">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al listado
      </Button>

      <Card>
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4">
            <img
              src={psychologist.photo || "/placeholder.svg"}
              alt={psychologist.name}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
            {psychologist.isHighDemand && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">Alta demanda</Badge>
            )}
          </div>

          <CardTitle className="text-2xl font-serif">{psychologist.name}</CardTitle>

          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{psychologist.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{psychologist.experience} de experiencia</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Modalidades disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {psychologist.modalities.map((modality) => (
                <Badge key={modality} variant="outline" className="flex items-center gap-2 px-3 py-1">
                  {modality === "Online" ? <Monitor className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  {modality}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Sobre mí</h3>
            <p className="text-muted-foreground leading-relaxed">{psychologist.description}</p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">Disponibilidad por modalidad</span>
            </div>

            {psychologist.availability.online && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="w-3 h-3 text-primary" />
                  <span className="text-sm font-medium">Online</span>
                </div>
                {psychologist.availability.online.map((schedule, index) => (
                  <p key={index} className="text-sm text-muted-foreground ml-5">
                    {schedule}
                  </p>
                ))}
              </div>
            )}

            {psychologist.availability.presencial && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-sm font-medium">Presencial</span>
                </div>
                {psychologist.availability.presencial.map((schedule, index) => (
                  <p key={index} className="text-sm text-muted-foreground ml-5">
                    {schedule}
                  </p>
                ))}
              </div>
            )}
          </div>

          <Button onClick={() => onBookSession(psychologist)} className="w-full" size="lg">
            <Clock className="w-4 h-4 mr-2" />
            Reservar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
