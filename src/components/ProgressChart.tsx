"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { supabase } from "../api/supabaseClient"

interface ProgressData {
  date: string
  activities: number
  mood_avg: number
}

const ProgressChart: React.FC = () => {
  const { language } = useLanguage()
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    fetchProgressData()
  }, [timeRange])

  const fetchProgressData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from("user_activities")
        .select("created_at, mood_score")
        .eq("user_id", user.id)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true })

      if (error) throw error

      // Group by date and calculate averages
      const groupedData: { [key: string]: { activities: number; moods: number[] } } = {}

      data.forEach((activity) => {
        const date = new Date(activity.created_at).toISOString().split("T")[0]
        if (!groupedData[date]) {
          groupedData[date] = { activities: 0, moods: [] }
        }
        groupedData[date].activities++
        if (activity.mood_score) {
          groupedData[date].moods.push(activity.mood_score)
        }
      })

      const chartData = Object.entries(groupedData).map(([date, data]) => ({
        date,
        activities: data.activities,
        mood_avg: data.moods.length > 0 ? data.moods.reduce((sum, mood) => sum + mood, 0) / data.moods.length : 0,
      }))

      setProgressData(chartData)
    } catch (error) {
      console.error("Error fetching progress data:", error)
    } finally {
      setLoading(false)
    }
  }

  const maxActivities = Math.max(...progressData.map((d) => d.activities), 1)
  const avgMood =
    progressData.length > 0 ? progressData.reduce((sum, d) => sum + d.mood_avg, 0) / progressData.length : 0

  const moodTrend =
    progressData.length >= 2 ? progressData[progressData.length - 1].mood_avg - progressData[0].mood_avg : 0

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
          {language === "id" ? "Progress Aktivitas" : "Activity Progress"}
        </h3>
        <div className="flex space-x-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-green-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "id" ? "Rata-rata Mood" : "Average Mood"}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{avgMood.toFixed(1)}/6</p>
            </div>
            <div
              className={`p-2 rounded-lg ${moodTrend >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {moodTrend >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "id" ? "Total Aktivitas" : "Total Activities"}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {progressData.reduce((sum, d) => sum + d.activities, 0)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-32">
        {progressData.length > 0 ? (
          <div className="flex items-end justify-between h-full space-x-1">
            {progressData.map((data, index) => {
              const height = Math.max((data.activities / maxActivities) * 100, 2)
              return (
                <motion.div
                  key={data.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm relative group cursor-pointer"
                  style={{ minHeight: "4px" }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                    <div className="text-center">
                      <div>{new Date(data.date).toLocaleDateString()}</div>
                      <div>
                        {data.activities} {language === "id" ? "aktivitas" : "activities"}
                      </div>
                      {data.mood_avg > 0 && <div>Mood: {data.mood_avg.toFixed(1)}/6</div>}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{language === "id" ? "Belum ada data aktivitas" : "No activity data yet"}</p>
              <p className="text-xs mt-1">
                {language === "id"
                  ? "Mulai log aktivitas untuk melihat progress"
                  : "Start logging activities to see progress"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Date labels */}
      {progressData.length > 0 && (
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(progressData[0].date).toLocaleDateString()}</span>
          <span>{new Date(progressData[progressData.length - 1].date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )
}

export default ProgressChart
