"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Calendar, Users, Brain, Monitor, MapPin, Clock, Star, Activity } from "lucide-react"
import type { Statistics } from "@/types/psychologist"
import { calculateStatistics } from "@/utils/booking"
import { simulatedSessions } from "@/data/psychologists"

export function StatisticsDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [modalityData, setModalityData] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    const statistics = calculateStatistics()
    setStats(statistics)

    // Prepare chart data for specialties
    const specialtyCount: { [key: string]: number } = {}
    simulatedSessions.forEach((session) => {
      specialtyCount[session.specialty] = (specialtyCount[session.specialty] || 0) + 1
    })

    const chartDataArray = Object.entries(specialtyCount)
      .map(([specialty, count]) => ({
        specialty: specialty.length > 15 ? specialty.substring(0, 15) + "..." : specialty,
        fullSpecialty: specialty,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    setChartData(chartDataArray)

    // Prepare modality data for pie chart
    const modalityCount: { [key: string]: number } = {}
    simulatedSessions.forEach((session) => {
      modalityCount[session.modality] = (modalityCount[session.modality] || 0) + 1
    })

    const modalityDataArray = Object.entries(modalityCount).map(([modality, count]) => ({
      name: modality === "online" ? "Online" : "Presencial",
      value: count,
      color: modality === "online" ? "#8475b3" : "#a855f7",
    }))

    setModalityData(modalityDataArray)

    // Prepare weekly data
    const dayCount: { [key: string]: number } = {}
    simulatedSessions.forEach((session) => {
      const date = new Date(session.date)
      const dayName = date.toLocaleDateString("es-ES", { weekday: "long" })
      dayCount[dayName] = (dayCount[dayName] || 0) + 1
    })

    const weeklyDataArray = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"].map((day) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      sessions: dayCount[day] || 0,
    }))

    setWeeklyData(weeklyDataArray)
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Dashboard de Estadísticas</h2>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sesiones</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Psicólogos Activos</p>
                <p className="text-2xl font-bold">{stats.totalPsychologists}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Especialidad Top</p>
                <p className="text-lg font-bold">{stats.mostConsultedSpecialty.specialty}</p>
                <p className="text-sm text-muted-foreground">{stats.mostConsultedSpecialty.count} sesiones</p>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Día Más Activo</p>
                <p className="text-lg font-bold">{stats.busiestDay.day}</p>
                <p className="text-sm text-muted-foreground">{stats.busiestDay.count} sesiones</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialties Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Especialidades Más Consultadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="specialty" angle={-45} textAnchor="end" height={80} fontSize={12} interval={0} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [`${value} sesiones`, props.payload?.fullSpecialty || name]}
                  />
                  <Bar dataKey="count" fill="#8475b3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Modality Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Distribución por Modalidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modalityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {modalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sesiones`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#8475b3]" />
                <span className="text-sm">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a855f7]" />
                <span className="text-sm">Presencial</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Actividad Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} sesiones`, "Sesiones"]} />
                <Bar dataKey="sessions" fill="#8475b3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Modalidad Preferida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {stats.mostUsedModality.modality === "online" ? (
                    <Monitor className="w-6 h-6 text-primary" />
                  ) : (
                    <MapPin className="w-6 h-6 text-primary" />
                  )}
                  {stats.mostUsedModality.modality === "online" ? "Online" : "Presencial"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.mostUsedModality.count} sesiones (
                  {((stats.mostUsedModality.count / stats.totalSessions) * 100).toFixed(1)}%)
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                #{1}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Promedio Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{(stats.totalSessions / 7).toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">sesiones por día</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Basado en</p>
                <p className="text-sm text-muted-foreground">{stats.totalSessions} sesiones totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
