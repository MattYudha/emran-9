// src/components/ProgressChart.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Smile, Meh, Frown } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { supabase } from "../api/supabaseClient"
import {
  LineChart, // Impor LineChart
  Line,      // Impor Line
  BarChart,  // Impor BarChart
  Bar,       // Impor Bar
  XAxis,     // Impor XAxis
  YAxis,     // Impor YAxis
  CartesianGrid, // Impor CartesianGrid
  Tooltip,   // Impor Tooltip
  Legend,    // Impor Legend (opsional, untuk menunjukkan apa yang diwakili oleh garis/batang)
  ResponsiveContainer, // Impor ResponsiveContainer
} from 'recharts'; // Impor dari Recharts

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

      // Inisialisasi semua tanggal dalam rentang waktu dengan 0 aktivitas dan mood 0
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateString = d.toISOString().split("T")[0];
        groupedData[dateString] = { activities: 0, moods: [] };
      }


      data.forEach((activity) => {
        const date = new Date(activity.created_at).toISOString().split("T")[0]
        if (!groupedData[date]) {
          // Ini seharusnya tidak terjadi jika inisialisasi dilakukan dengan benar,
          // tetapi sebagai fallback untuk data di luar rentang awal
          groupedData[date] = { activities: 0, moods: [] }
        }
        groupedData[date].activities++
        if (activity.mood_score) {
          groupedData[date].moods.push(activity.mood_score)
        }
      })

      // Ubah data yang dikelompokkan menjadi format yang sesuai untuk bagan
      const chartData = Object.entries(groupedData)
        .map(([date, data]) => ({
          date,
          activities: data.activities,
          mood_avg: data.moods.length > 0 ? parseFloat((data.moods.reduce((sum, mood) => sum + mood, 0) / data.moods.length).toFixed(1)) : 0,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Pastikan data diurutkan berdasarkan tanggal

      setProgressData(chartData)
    } catch (error) {
      console.error("Error fetching progress data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate overall average mood for display
  const avgMoodOverall =
    progressData.length > 0 ? progressData.reduce((sum, d) => sum + d.mood_avg, 0) / progressData.length : 0

  const moodTrend =
    progressData.length >= 2 ? progressData[progressData.length - 1].mood_avg - progressData[0].mood_avg : 0

    // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const activityData = payload.find((p: any) => p.dataKey === 'activities');
      const moodData = payload.find((p: any) => p.dataKey === 'mood_avg');

      const dateObj = new Date(label);
      const formattedDate = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return (
        <div className="p-3 bg-gray-900/90 dark:bg-gray-700/90 text-white text-sm rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 dark:border-gray-600">
          <p className="font-semibold text-base mb-1">{formattedDate}</p>
          {activityData && <p className="text-green-300">{`Aktivitas: ${activityData.value}`}</p>}
          {moodData && moodData.value > 0 && <p className="text-blue-300">{`Mood Rata-rata: ${moodData.value.toFixed(1)}/6`}</p>}
        </div>
      );
    }
    return null;
  };

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
          {language === "id" ? "Progres Aktivitas" : "Activity Progress"}
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
                {language === "id" ? "Mood Rata-rata" : "Average Mood"}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{avgMoodOverall.toFixed(1)}/6</p>
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

      {/* Chart with Recharts */}
      <div className="h-48 mb-4"> {/* Increased height for better visualization */}
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={progressData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' })}
                angle={-45} // Rotate labels to avoid overlap
                textAnchor="end"
                height={50} // Give more space for rotated labels
                style={{ fontSize: '10px', fill: '#6B7280' }} // tailwind gray-500
              />
              <YAxis yAxisId="left" orientation="left" stroke="#4CAF50" // Green for activities
                label={{ value: (language === 'id' ? 'Aktivitas' : 'Activities'), angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#4CAF50' } }}
                style={{ fontSize: '10px', fill: '#6B7280' }}
              />
              <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" // Blue for mood
                label={{ value: (language === 'id' ? 'Mood' : 'Mood'), angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#3B82F6' } }}
                domain={[0, 6]} // Mood score from 1-6
                tickFormatter={(value) => value.toFixed(0)}
                style={{ fontSize: '10px', fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="activities" name={language === 'id' ? 'Jumlah Aktivitas' : 'Number of Activities'} fill="#4CAF50" barSize={10} />
              <Line yAxisId="right" type="monotone" dataKey="mood_avg" name={language === 'id' ? 'Mood Rata-rata' : 'Average Mood'} stroke="#3B82F6" dot={{ r: 3 }} activeDot={{ r: 5 }} strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
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

      {/* Date labels (optional, as Recharts XAxis handles it) */}
      {/* {progressData.length > 0 && (
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(progressData[0].date).toLocaleDateString()}</span>
          <span>{new Date(progressData[progressData.length - 1].date).toLocaleDateString()}</span>
        </div>
      )} */}
    </div>
  )
}

export default ProgressChart