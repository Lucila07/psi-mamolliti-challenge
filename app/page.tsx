"use client"

import { useState, useMemo } from "react"
import { Search, Filter, BarChart3, Home } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PsychologistCard } from "@/components/psychologist-card"
import { PsychologistDetail } from "@/components/psychologist-detail"
import { BookingModal } from "@/components/booking-modal"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import { psychologists, specialties, modalities } from "@/data/psychologists"
import type { Psychologist } from "@/types/psychologist"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedModalities, setSelectedModalities] = useState<string[]>([])
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingPsychologist, setBookingPsychologist] = useState<Psychologist | null>(null)
  const [activeTab, setActiveTab] = useState("psychologists")

  const handleBookSession = (psychologist: Psychologist) => {
    setBookingPsychologist(psychologist)
    setIsBookingModalOpen(true)
  }

  const filteredPsychologists = useMemo(() => {
    return psychologists.filter((psychologist) => {
      const matchesSearch =
        psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psychologist.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSpecialties =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((specialty) => psychologist.specialties.includes(specialty))

      const matchesModalities =
        selectedModalities.length === 0 ||
        selectedModalities.some((modality) => psychologist.modalities.includes(modality))

      return matchesSearch && matchesSpecialties && matchesModalities
    })
  }, [searchTerm, selectedSpecialties, selectedModalities])

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const toggleModality = (modality: string) => {
    setSelectedModalities((prev) =>
      prev.includes(modality) ? prev.filter((m) => m !== modality) : [...prev, modality],
    )
  }

  const handleViewDetails = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist)
  }

  const handleBackToList = () => {
    setSelectedPsychologist(null)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSpecialties([])
    setSelectedModalities([])
  }

  if (selectedPsychologist) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary font-serif">MindConnect</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <PsychologistDetail
            psychologist={selectedPsychologist}
            onBack={handleBackToList}
            onBookSession={handleBookSession}
          />
        </main>

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          psychologist={bookingPsychologist}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary font-serif">MindConnect</h1>
          </div>

          <p className="text-muted-foreground mb-6">
            Plataforma completa de gestión de sesiones psicológicas - Encuentra, reserva y gestiona tus citas
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="psychologists" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Psicólogos</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="psychologists" className="space-y-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h2>
                {(selectedSpecialties.length > 0 || selectedModalities.length > 0 || searchTerm) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Modalidad</h3>
                <div className="flex flex-wrap gap-2">
                  {modalities.map((modality) => (
                    <Badge
                      key={modality}
                      variant={selectedModalities.includes(modality) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleModality(modality)}
                    >
                      {modality}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Especialidad</h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSpecialty(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredPsychologists.length} psicólogo{filteredPsychologists.length !== 1 ? "s" : ""}
                {selectedSpecialties.length > 0 || selectedModalities.length > 0 || searchTerm
                  ? " encontrado" + (filteredPsychologists.length !== 1 ? "s" : "")
                  : " disponible" + (filteredPsychologists.length !== 1 ? "s" : "")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPsychologists.map((psychologist) => (
                <PsychologistCard key={psychologist.id} psychologist={psychologist} onViewDetails={handleViewDetails} />
              ))}
            </div>

            {filteredPsychologists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No se encontraron psicólogos que coincidan con tu búsqueda</p>
                <Button variant="outline" onClick={clearFilters}>
                  Ver todos los psicólogos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsDashboard />
          </TabsContent>
        </Tabs>
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        psychologist={bookingPsychologist}
      />
    </div>
  )
}
