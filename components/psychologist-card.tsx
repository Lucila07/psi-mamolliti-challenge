"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Monitor, MapPin } from "lucide-react"
import type { Psychologist } from "@/types/psychologist"

interface PsychologistCardProps {
  psychologist: Psychologist
  onViewDetails: (psychologist: Psychologist) => void
}

export function PsychologistCard({ psychologist, onViewDetails }: PsychologistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={psychologist.photo || "/placeholder.svg"}
            alt={psychologist.name}
            className="w-full h-48 object-cover"
          />
          {psychologist.isHighDemand && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">Alta demanda</Badge>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 font-serif">{psychologist.name}</h3>

          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{psychologist.rating}</span>
            <span className="text-sm text-muted-foreground">• {psychologist.experience}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {psychologist.modalities.map((modality) => (
              <Badge key={modality} variant="outline" className="text-xs flex items-center gap-1">
                {modality === "Online" ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {modality}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {psychologist.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {psychologist.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{psychologist.specialties.length - 2} más
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{psychologist.description}</p>

          <Button onClick={() => onViewDetails(psychologist)} className="w-full">
            Ver perfil y reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
