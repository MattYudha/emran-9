// src/components/UserProfileManager.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, Camera, Save, Edit3, Shield, Bell, Globe } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../utils/translations"
import { supabase } from "../api/supabaseClient"
import { useToast } from "./ui/ToastContainer" // Import useToast

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
  const { showToast } = useToast(); // Inisialisasi hook useToast

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone_number: "",
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") throw error 

      if (data) {
        setProfile(data)
        setEditForm({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
        })
      } else {
        // Buat profil jika tidak ditemukan
        const newProfile = {
          id: user.id,
          full_name: user.email?.split("@")[0] || "User",
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
      showToast({ // Mengganti alert()
        title: "Error",
        message: "Failed to fetch profile data.",
        type: "error"
      });
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
      showToast({ // Mengganti alert()
        title: "Profile Updated",
        message: "Your profile has been saved successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast({ // Mengganti alert()
        title: "Error",
        message: "Failed to save profile changes. Please try again.",
        type: "error"
      });
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) {
      showToast({
        title: "Upload Error",
        message: "No file selected or profile not loaded.",
        type: "error"
      });
      return
    }

    const maxSize = 5 * 1024 * 1024 
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
      showToast({ // Mengganti alert()
        title: "Invalid File Type",
        message: "Please select a valid image file (JPG, PNG, or WebP).",
        type: "error"
      });
      return
    }

    if (file.size > maxSize) {
      showToast({ // Mengganti alert()
        title: "File Too Large",
        message: "File size must be less than 5MB.",
        type: "error"
      });
      return
    }

    setUploadingAvatar(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
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

      showToast({ // Mengganti alert()
        title: "Avatar Updated",
        message: "Your profile picture has been updated successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error uploading avatar:", error)
      showToast({ // Mengganti alert()
        title: "Upload Failed",
        message: `Failed to upload avatar. ${error instanceof Error ? error.message : String(error)}`,
        type: "error"
      });
    } finally {
      setUploadingAvatar(false)
      event.target.value = ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header Bagian Atas Profil */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            {/* Bagian Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              {/* Tombol Unggah Avatar */}
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar} 
                />
              </label>
              {/* Indikator Loading untuk Unggahan Avatar */}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Informasi Utama Profil */}
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-green-100 mt-1">Member since {new Date(profile.join_date).toLocaleDateString()}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="text-center">
                  <div className="text-xl font-bold">{profile.streak}</div>
                  <div className="text-xs text-green-100">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{profile.completed_activities}</div>
                  <div className="text-xs text-green-100">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{profile.risk_score_current.toFixed(1)}</div>
                  <div className="text-xs text-green-100">Risk Score</div>
                </div>
              </div>
            </div>

            {/* Tombol Edit Profil */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Detail Profil */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Pribadi */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-green-500" />
                Personal Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profile.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profile.phone_number || "Not provided"}</p>
                  )}
                </div>
              </div>

              {/* Tombol Simpan/Batal saat dalam mode edit */}
              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      // Reset form jika dibatalkan
                      setEditForm({
                        full_name: profile.full_name,
                        phone_number: profile.phone_number || "",
                      })
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Pengaturan Akun */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Account Settings
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">Manage</button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {language === "id" ? "Indonesian" : "English"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Privacy</span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">Settings</button>
                </div>
              </div>
            </div>
          </div>

          {/* Ikhtisar Kemajuan */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">{profile.completed_activities}</div>
                <div className="text-blue-100">Total Activities</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">{profile.streak}</div>
                <div className="text-green-100">Current Streak</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">{profile.risk_score_current.toFixed(1)}</div>
                <div className="text-purple-100">Risk Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileManager