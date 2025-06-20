// src/components/NotificationCenter.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, XCircle, Settings, Loader2 } from "lucide-react" // Impor Loader2
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../utils/translations"
import { supabase } from "../api/supabaseClient"
import { useToast } from "./ui/ToastContainer" // Impor useToast

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  is_read: boolean
  created_at: string
}

interface NotificationSettings {
  notify_activity_reminders: boolean
  notify_progress_updates: boolean
  notify_risk_alerts: boolean
  notify_weekly_summary: boolean
}

const NotificationCenter: React.FC = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const { showToast } = useToast(); // Inisialisasi useToast

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_activity_reminders: true,
    notify_progress_updates: true,
    notify_risk_alerts: true,
    notify_weekly_summary: true,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false) // Untuk pengaturan

  useEffect(() => {
    fetchNotifications()
    fetchNotificationSettings()
  }, [])

  useEffect(() => {
    // Pastikan ini berjalan hanya setelah pengguna masuk dan tidak ada masalah autentikasi
    const setupRealtime = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Jangan setup jika tidak ada user

        if (isOpen) {
            // Fetch awal saat dibuka
            fetchNotifications();

            // Set up real-time subscription for notifications
            const channel = supabase
                .channel(`notifications_for_user_${user.id}`) // Nama channel unik per user
                .on(
                    "postgres_changes",
                    {
                        event: "*", // * berarti INSERT, UPDATE, DELETE
                        schema: "public",
                        table: "notifications",
                        filter: `user_id=eq.${user.id}`, // Hanya notifikasi untuk user ini
                    },
                    (payload) => {
                        console.log("Notification change received!", payload);
                        // Periksa apakah notifikasi baru dan belum ada di state
                        if (payload.eventType === 'INSERT') {
                            const newNotif = payload.new as Notification;
                            setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)]);
                            // Tampilkan toast untuk notifikasi baru (opsional)
                            showToast({
                                title: newNotif.title,
                                message: newNotif.message,
                                type: newNotif.type,
                                duration: 5000 // Tampilkan selama 5 detik
                            });
                        } else if (payload.eventType === 'UPDATE') {
                            const updatedNotif = payload.new as Notification;
                             setNotifications(prev => prev.map(n => n.id === updatedNotif.id ? updatedNotif : n));
                        } else if (payload.eventType === 'DELETE') {
                            const deletedNotif = payload.old.id;
                            setNotifications(prev => prev.filter(n => n.id !== deletedNotif));
                        }
                    },
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            // Saat panel ditutup, hapus channel
            const existingChannels = supabase.getChannels();
            existingChannels.forEach(channel => {
                if (channel.topic.startsWith('realtime:notifications_for_user_')) {
                    supabase.removeChannel(channel);
                }
            });
        }
    };

    setupRealtime(); // Panggil fungsi setup realtime

    // Cleanup jika komponen unmount
    return () => {
        supabase.getChannels().forEach(channel => {
            if (channel.topic.startsWith('realtime:notifications_for_user_')) {
                supabase.removeChannel(channel);
            }
        });
    };
  }, [isOpen]); // Dependensi pada isOpen untuk mengaktifkan/menonaktifkan langganan

  const fetchNotifications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20) // Ambil 20 notifikasi terbaru

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const fetchNotificationSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("notification_settings").select("*").eq("user_id", user.id).single()

      if (error && error.code !== "PGRST116") throw error // PGRST116 berarti tidak ada baris ditemukan (pengaturan belum ada)
      if (data) {
        setSettings({
          notify_activity_reminders: data.notify_activity_reminders,
          notify_progress_updates: data.notify_progress_updates,
          notify_risk_alerts: data.notify_risk_alerts,
          notify_weekly_summary: data.notify_weekly_summary,
        })
      } else {
        // Jika pengaturan tidak ada, buat entri default
        const { error: insertError } = await supabase.from("notification_settings").insert([
            { user_id: user.id }
        ]);
        if (insertError) throw insertError;
        // Setelah insert, ambil lagi untuk memastikan state settings terisi
        fetchNotificationSettings();
      }
    } catch (error) {
      console.error("Error fetching/creating notification settings:", error)
      showToast({
        title: "Error",
        message: "Gagal memuat pengaturan notifikasi.",
        type: "error"
      });
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      showToast({
        title: "Error",
        message: "Gagal menandai notifikasi sebagai sudah dibaca.",
        type: "error"
      });
    }
  }

  const markAllAsRead = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
      showToast({
        title: "Berhasil!",
        message: "Semua notifikasi telah ditandai sebagai sudah dibaca.",
        type: "success"
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      showToast({
        title: "Error",
        message: "Gagal menandai semua notifikasi sebagai sudah dibaca.",
        type: "error"
      });
    }
  }

  const updateNotificationSettings = async (newSettings: NotificationSettings) => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        showToast({
          title: "Error",
          message: "Anda perlu masuk untuk menyimpan pengaturan.",
          type: "error"
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("notification_settings").upsert({
        user_id: user.id, // Pastikan user_id disertakan untuk upsert
        ...newSettings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }); // Gunakan onConflict untuk memastikan upsert bekerja dengan baik

      if (error) throw error

      setSettings(newSettings)
      showToast({
        title: "Berhasil!",
        message: "Pengaturan notifikasi berhasil diperbarui.",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating notification settings:", error)
      showToast({
        title: "Error",
        message: `Gagal memperbarui pengaturan: ${error instanceof Error ? error.message : String(error)}`,
        type: "error"
      });
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors mt-2"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notification Preferences</h4>
                    {Object.entries(settings).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {key
                            .replace("notify_", "")
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            updateNotificationSettings({
                              ...settings,
                              [key]: e.target.checked,
                            })
                          }
                          disabled={loading}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        {loading && <Loader2 className="animate-spin h-4 w-4 text-green-500 ml-2" />}
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.is_read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.is_read
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCenter