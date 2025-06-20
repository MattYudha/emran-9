// src/components/UserProfileManager.tsx
"use client"

import type React from "react"
import { useState, useEffect, Fragment } from "react"
import { 
  User, 
  Camera, 
  Save, 
  Edit3, 
  Shield, 
  Bell, 
  Globe, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Settings,
  Mail,
  MapPin,
  Activity
} from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion" 
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../utils/translations"
import { supabase } from "../api/supabaseClient"
import { useToast } from "./ui/ToastContainer" 

interface UserProfile {
  id: string
  full_name: string
  phone_number?: string
  avatar_url?: string
  join_date: string
  streak: number
  completed_activities: number
  risk_score_current: number
  risk_score_previous: number
}

const UserProfileManager: React.FC = () => {
  const { language } = useLanguage()
  const t = translations[language]
  const { showToast } = useToast()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone_number: "",
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [isAvatarHovered, setIsAvatarHovered] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        showToast({ 
          title: "Akses Ditolak",
          message: "Anda harus masuk untuk melihat profil.",
          type: "error"
        })
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") { 
        throw error
      }

      if (data) {
        setProfile(data)
        setEditForm({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
        })
      } else {
        const newProfile = {
          id: user.id,
          full_name: user.email?.split("@")[0] || (language === 'id' ? "Pengguna" : "User"), 
          phone_number: "",
          avatar_url: null,
          join_date: new Date().toISOString(),
          streak: 0,
          completed_activities: 0,
          risk_score_current: 0,
          risk_score_previous: 0,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError
        setProfile(createdProfile)
        setEditForm({
          full_name: createdProfile.full_name,
          phone_number: createdProfile.phone_number || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      showToast({ 
        title: "Error",
        message: "Gagal memuat data profil.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone_number: editForm.phone_number,
          updated_at: new Date().toISOString(), 
        })
        .eq("id", profile.id)

      if (error) throw error

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editForm.full_name,
              phone_number: editForm.phone_number,
            }
          : null,
      )

      setIsEditing(false) 
      showToast({ 
        title: "Profil Diperbarui",
        message: "Profil Anda telah berhasil disimpan!",
        type: "success"
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast({ 
        title: "Error",
        message: "Gagal menyimpan perubahan profil. Silakan coba lagi.",
        type: "error"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) {
      showToast({
        title: "Error Upload",
        message: "Tidak ada file terpilih atau profil belum dimuat.",
        type: "error"
      })
      return
    }

    const maxSize = 5 * 1024 * 1024 
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      showToast({ 
        title: "Tipe File Tidak Valid",
        message: "Mohon pilih file gambar yang valid (JPG, PNG, atau WebP).",
        type: "error"
      })
      return
    }

    if (file.size > maxSize) {
      showToast({ 
        title: "Ukuran File Terlalu Besar",
        message: "Ukuran file harus kurang dari 5MB.",
        type: "error"
      })
      return
    }

    setUploadingAvatar(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop()
        if (oldFileName) {
          const oldFilePath = `avatars/${oldFileName}`
          const { error: deleteError } = await supabase.storage.from("avatars").remove([oldFilePath])
          if (deleteError) {
            console.warn("Gagal menghapus avatar lama:", deleteError.message)
          }
        }
      }

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, 
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (updateError) throw updateError

      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : null))

      showToast({ 
        title: "Avatar Diperbarui",
        message: "Foto profil Anda telah berhasil diperbarui!",
        type: "success"
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      showToast({ 
        title: "Gagal Upload",
        message: `Gagal mengunggah avatar. ${error instanceof Error ? error.message : String(error)}`,
        type: "error"
      })
    } finally {
      setUploadingAvatar(false)
      event.target.value = "" 
    }
  }

  const avatarLabelOpacity = isAvatarHovered || uploadingAvatar ? 1 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"> 
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {language === 'id' ? 'Memuat profil...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-4">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {language === 'id' ? 'Profil Tidak Ditemukan' : 'Profile Not Found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'id' ? "Profil tidak ditemukan atau tidak dapat dimuat." : "Profile not found or could not be loaded."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'id' ? 'Profil Pengguna' : 'User Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {language === 'id' ? 'Kelola informasi dan pengaturan akun Anda' : 'Manage your account information and settings'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Profile Card - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              
              {/* Profile Header with Gradient */}
              <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 px-8 py-12">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-900/20 backdrop-blur-sm"></div>
                
                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                  title={language === 'id' ? 'Edit Profil' : 'Edit Profile'}
                >
                  <Edit3 className="h-5 w-5" />
                </button>

                <div className="relative text-center">
                  {/* Avatar Section */}
                  <div 
                    className="relative inline-block mb-6"
                    onMouseEnter={() => setIsAvatarHovered(true)}
                    onMouseLeave={() => setIsAvatarHovered(false)}
                  >
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-2xl">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-white/80" />
                      )}
                    </div>
                    
                    {/* Avatar Upload Overlay */}
                    <motion.label 
                      htmlFor="avatar-upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: avatarLabelOpacity }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
                    >
                      <Fragment>
                        {uploadingAvatar ? (
                          <Loader2 className="animate-spin h-8 w-8 text-white" />
                        ) : (
                          <div className="text-center">
                            <Camera className="h-8 w-8 text-white mx-auto mb-1" />
                            <span className="text-xs text-white font-medium">
                              {language === 'id' ? 'Ubah' : 'Change'}
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </Fragment>
                    </motion.label>
                  </div>

                  {/* Profile Info */}
                  <h2 className="text-2xl font-bold text-white mb-2">{profile.full_name}</h2>
                  <div className="flex items-center justify-center text-emerald-100 mb-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {language === 'id' ? 'Bergabung' : 'Member since'} {new Date(profile.join_date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-8">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          {language === 'id' ? 'Streak Harian' : 'Daily Streak'}
                        </p>
                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{profile.streak}</p>
                      </div>
                      <Activity className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {language === 'id' ? 'Aktivitas Selesai' : 'Completed Activities'}
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{profile.completed_activities}</p>
                      </div>
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          {language === 'id' ? 'Skor Risiko' : 'Risk Score'}
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{profile.risk_score_current.toFixed(1)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-8 space-y-8"
          >
            
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-8 py-6">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {language === 'id' ? 'Informasi Pribadi' : 'Personal Information'}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Full Name Field */}
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 bg-gray-50 dark:bg-gray-700/50"
                        placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-900 dark:text-white font-medium text-lg">{profile.full_name}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {language === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 bg-gray-50 dark:bg-gray-700/50"
                        placeholder={language === 'id' ? "Masukkan nomor telepon" : "Enter phone number"}
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-900 dark:text-white font-medium text-lg">
                          {profile.phone_number || (
                            <span className="text-gray-500 italic">
                              {language === 'id' ? "Belum disediakan" : "Not provided"}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons for Edit Mode */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700"
                    >
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            {language === 'id' ? "Menyimpan..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            {language === 'id' ? "Simpan Perubahan" : "Save Changes"}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditForm({
                            full_name: profile.full_name,
                            phone_number: profile.phone_number || "",
                          })
                        }}
                        className="flex items-center justify-center px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        {language === 'id' ? "Batal" : "Cancel"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Account Settings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-8 py-6">
                <div className="flex items-center">
                  <Settings className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {language === 'id' ? 'Pengaturan Akun' : 'Account Settings'}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  
                  {/* Notification Settings */}
                  <div className="group p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-800/50 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                          <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {language === 'id' ? 'Notifikasi' : 'Notifications'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'id' ? 'Kelola preferensi notifikasi Anda' : 'Manage your notification preferences'}
                          </p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        {language === 'id' ? 'Kelola' : 'Manage'}
                      </button>
                    </div>
                  </div>

                  {/* Language Settings */}
                  <div className="group p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {language === 'id' ? 'Bahasa' : 'Language'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'id' ? 'Pilih bahasa yang Anda sukai' : 'Choose your preferred language'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center bg-blue-100 dark:bg-blue-800/50 px-4 py-2 rounded-xl">
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                          {language === "id" ? "Indonesia" : language === "en" ? "English" : language}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="group p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {language === 'id' ? 'Privasi & Keamanan' : 'Privacy & Security'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'id' ? 'Kontrol privasi dan keamanan akun' : 'Control your account privacy and security'}
                          </p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        {language === 'id' ? 'Pengaturan' : 'Settings'}
                      </button>
                    </div>
                  </div>

                  {/* Account Data */}
                  <div className="group p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                          <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {language === 'id' ? 'Data Akun' : 'Account Data'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'id' ? 'Unduh atau hapus data akun Anda' : 'Download or delete your account data'}
                          </p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        {language === 'id' ? 'Kelola' : 'Manage'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Activity Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-8 py-6">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {language === 'id' ? 'Ringkasan Aktivitas' : 'Activity Summary'}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Current Risk Score */}
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                      {language === 'id' ? 'Skor Saat Ini' : 'Current Score'}
                    </h4>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {profile.risk_score_current.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'id' ? 'Skor risiko terkini' : 'Latest risk score'}
                    </p>
                  </div>

                  {/* Previous Score */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                      {language === 'id' ? 'Skor Sebelumnya' : 'Previous Score'}
                    </h4>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {profile.risk_score_previous.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'id' ? 'Skor periode lalu' : 'Last period score'}
                    </p>
                  </div>

                  {/* Score Change */}
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      {profile.risk_score_current >= profile.risk_score_previous ? (
                        <TrendingUp className="h-8 w-8 text-red-600 dark:text-red-400" />
                      ) : (
                        <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 transform rotate-180" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                      {language === 'id' ? 'Perubahan' : 'Change'}
                    </h4>
                    <p className={`text-3xl font-bold mb-1 ${
                      profile.risk_score_current >= profile.risk_score_previous 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {profile.risk_score_current >= profile.risk_score_previous ? '+' : ''}
                      {(profile.risk_score_current - profile.risk_score_previous).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'id' ? 'Dari periode lalu' : 'From last period'}
                    </p>
                  </div>

                </div>

                {/* Progress Insights */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                    {language === 'id' ? 'Wawasan Kemajuan' : 'Progress Insights'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === 'id' ? 
                          `${profile.completed_activities} aktivitas telah diselesaikan` : 
                          `${profile.completed_activities} activities completed`
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === 'id' ? 
                          `Streak ${profile.streak} hari berturut-turut` : 
                          `${profile.streak} days consecutive streak`
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === 'id' ? 
                          'Profil aktif dan terverifikasi' : 
                          'Active and verified profile'
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === 'id' ? 
                          'Data terenkripsi dan aman' : 
                          'Encrypted and secure data'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileManager