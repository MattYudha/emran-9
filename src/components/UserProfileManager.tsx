// src/components/UserProfileManager.tsx
"use client";

import type React from "react";
import { useState, useEffect, Fragment } from "react";
import {
  User,
  Camera,
  Save,
  Edit3,
  Shield,
  Bell,
  Globe,
  Loader2,
  XCircle,
  Phone,
  Calendar,
  TrendingUp,
  Activity,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { supabase } from "../api/supabaseClient";
import { useToast } from "./ui/ToastContainer";

// Interface for UserProfile (sesuai yang Anda berikan)
interface UserProfile {
  id: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string; // Dapat berupa string atau undefined
  join_date: string;
  streak: number;
  completed_activities: number;
  risk_score_current: number;
  risk_score_previous: number;
}

// Interface for NotificationSettings (sesuai tabel SQL Anda)
interface NotificationSettings {
  notify_activity_reminders: boolean;
  notify_progress_updates: boolean;
  notify_risk_alerts: boolean;
  notify_weekly_summary: boolean;
}

// =================================================================
// Sub-Komponen untuk Setiap Bagian Pengaturan
// =================================================================

interface NotificationSettingsSectionProps {
  currentSettings: NotificationSettings;
  onUpdate: (key: keyof NotificationSettings, value: boolean) => void;
  loading: boolean;
  language: string;
  translations: any;
}

// Komponen Notifikasi (tetap ada di sini, tapi tidak akan dirender kecuali dipanggil)
const NotificationSettingsSection: React.FC<
  NotificationSettingsSectionProps
> = ({ currentSettings, onUpdate, loading, language, translations: t }) => (
  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 shadow-inner">
    <h4 className="font-semibold text-gray-900 dark:text-white text-md mb-3 flex items-center">
      <Bell className="h-5 w-5 mr-2 text-yellow-600" />
      {t.notifications || "Notifications"}
    </h4>
    <div className="space-y-2">
      {Object.entries(currentSettings).map(([key, value]) => (
        <label
          key={key}
          className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          <span>
            {t[key] ||
              key
                .replace(/_/g, " ")
                .replace("notify", "")
                .trim()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) =>
              onUpdate(key as keyof NotificationSettings, e.target.checked)
            }
            disabled={loading}
            className="h-4 w-4 text-yellow-600 rounded border-gray-300 dark:border-gray-600 focus:ring-yellow-500 transition-colors"
          />
        </label>
      ))}
      {loading && (
        <div className="flex items-center justify-center pt-2">
          <Loader2 className="animate-spin h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {t.saving || "Saving..."}
          </span>
        </div>
      )}
    </div>
  </div>
);

interface SecuritySettingsSectionProps {
  language: string;
  translations: any;
  showToast: (toast: any) => void;
}

const SecuritySettingsSection: React.FC<SecuritySettingsSectionProps> = ({
  language,
  translations: t,
  showToast,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteConfirmationPassword, setDeleteConfirmationPassword] =
    useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast({
        title: t.error || "Error",
        message:
          t.passwordMinLength || "New password must be at least 6 characters.",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast({
        title: t.error || "Error",
        message: t.passwordsDoNotMatch || "New passwords do not match.",
        type: "error",
      });
      return;
    }

    setChangePasswordLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("password not correct")
        ) {
          showToast({
            title: t.error || "Error",
            message:
              t.invalidCurrentPassword ||
              "Invalid current password. Please re-login or try again.",
            type: "error",
          });
        } else if (error.message.includes("Email link sent")) {
          showToast({
            title: t.success || "Success",
            message:
              t.passwordChangeEmailSent ||
              "Password change confirmation sent to your email. Please check your inbox.",
            type: "info",
          });
        } else {
          throw error;
        }
      } else {
        showToast({
          title: t.success || "Success",
          message:
            t.passwordUpdated || "Password has been updated successfully!",
          type: "success",
        });
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      showToast({
        title: t.error || "Error",
        message:
          error.message ||
          t.failedToChangePassword ||
          "Failed to change password. Please try again.",
        type: "error",
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      showToast({
        title: t.error || "Error",
        message: t.notLoggedIn || "You are not logged in.",
        type: "error",
      });
      return;
    }

    setDeleteAccountLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.data.user.email!,
        password: deleteConfirmationPassword,
      });

      if (signInError) {
        throw new Error(
          t.invalidPasswordForDeletion ||
            "Incorrect password. Account deletion failed."
        );
      }

      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
        user.data.user.id
      );

      if (deleteUserError) {
        throw deleteUserError;
      }

      showToast({
        title: t.accountDeleted || "Account Deleted",
        message:
          t.accountDeletionSuccess ||
          "Your account has been successfully deleted.",
        type: "success",
      });
      setShowDeleteModal(false);
      setDeleteConfirmationPassword("");
      window.location.href = "/";
    } catch (error: any) {
      console.error("Error deleting account:", error);
      showToast({
        title: t.error || "Error",
        message:
          error.message ||
          t.failedToDeleteAccount ||
          "Failed to delete account. Please try again.",
        type: "error",
      });
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 shadow-inner">
      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="space-y-4">
        <h5 className="font-semibold text-gray-900 dark:text-white text-md mb-2 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-blue-600" />
          {t.changePassword || "Change Password"}
        </h5>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.newPassword || "New Password"}
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={t.enterNewPassword || "Enter new password"}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.confirmNewPassword || "Confirm New Password"}
          </label>
          <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={t.confirmNewPassword || "Confirm new password"}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <motion.button
          type="submit"
          disabled={changePasswordLoading}
          className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {changePasswordLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              {t.saving || "Saving..."}
            </>
          ) : (
            t.updatePassword || "Update Password"
          )}
        </motion.button>
      </form>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Delete Account */}
      <h5 className="font-semibold text-red-500 dark:text-red-400 text-md mb-2 flex items-center">
        <Trash2 className="h-5 w-5 mr-2 text-red-600" />
        {t.deleteAccount || "Delete Account"}
      </h5>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {t.deleteAccountWarning ||
          "Permanently delete your account and all associated data. This action cannot be undone."}
      </p>
      <motion.button
        onClick={() => setShowDeleteModal(true)}
        disabled={deleteAccountLoading}
        className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {deleteAccountLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            {t.deleting || "Deleting..."}
          </>
        ) : (
          t.deleteAccount || "Delete Account"
        )}
      </motion.button>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2" />
                {t.confirmDelete || "Confirm Account Deletion"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t.deleteConfirmationPrompt ||
                  "To confirm, please enter your password."}
              </p>
              <input
                type="password"
                value={deleteConfirmationPassword}
                onChange={(e) => setDeleteConfirmationPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white mb-6"
                placeholder={t.yourPassword || "Your password"}
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  {t.cancel || "Cancel"}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteAccountLoading || !deleteConfirmationPassword.trim()
                  }
                  className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                >
                  {deleteAccountLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      {t.delete || "Delete"}
                    </>
                  ) : (
                    t.delete || "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface LanguageSettingsSectionProps {
  language: string;
  translations: any;
}

const LanguageSettingsSection: React.FC<LanguageSettingsSectionProps> = ({
  language,
  translations: t,
}) => (
  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 shadow-inner">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-xl mr-4">
          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-md">
            {t.language || "Language"}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t.choosePreferredLanguage || "Choose your preferred language"}
          </p>
        </div>
      </div>
      <div className="flex items-center bg-blue-100 dark:bg-blue-800/50 px-4 py-2 rounded-xl">
        <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
          {language === "id"
            ? "Indonesian"
            : language === "en"
            ? "English"
            : language === "ja"
            ? "日本語"
            : language === "zh"
            ? "中文"
            : language === "ar"
            ? "العربية"
            : "English"}
        </span>
      </div>
    </div>
  </div> // <--- Tag penutup ini sudah ada dan benar sekarang.
);

interface DataSettingsSectionProps {
  language: string;
  translations: any;
  showToast: (toast: any) => void;
}

const DataSettingsSection: React.FC<DataSettingsSectionProps> = ({
  language,
  translations: t,
  showToast,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadData = async () => {
    setDownloading(true);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) throw userError;

      const userId = userData.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (profileError) throw profileError;

      const { data: goalsData, error: goalsError } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", userId);
      if (goalsError) throw goalsError;

      const { data: activitiesData, error: activitiesError } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId);
      if (activitiesError) throw activitiesError;

      const { data: notificationsData, error: notificationsError } =
        await supabase.from("notifications").select("*").eq("user_id", userId);
      if (notificationsError) throw notificationsError;

      const { data: settingsData, error: settingsError } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (settingsError) throw settingsError;

      const allUserData = {
        profile: profileData,
        goals: goalsData,
        activities: activitiesData,
        notifications: notificationsData,
        notificationSettings: settingsData,
      };

      const jsonString = JSON.stringify(allUserData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_data_${userId}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast({
        title: t.success || "Success",
        message: t.dataDownloaded || "Your data has been downloaded.",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error downloading data:", error);
      showToast({
        title: t.error || "Error",
        message:
          error.message ||
          t.failedToDownloadData ||
          "Failed to download data. Please try again.",
        type: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-xl mr-4">
            <User className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-md">
              {t.accountData || "Account Data"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t.downloadOrDeleteData || "Download or delete your account data"}
            </p>
          </div>
        </div>
        <motion.button
          onClick={handleDownloadData}
          disabled={downloading}
          className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {downloading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              {t.downloading || "Downloading..."}
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {t.download || "Download"}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

// =================================================================
// Main UserProfileManager Component
// =================================================================
const UserProfileManager: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone_number: "",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  // State untuk pengaturan notifikasi (tetap dibutuhkan untuk fungsi fetch/update di sub-komponen)
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      notify_activity_reminders: true,
      notify_progress_updates: true,
      notify_risk_alerts: true,
      notify_weekly_summary: true,
    });
  const [loadingSettings, setLoadingSettings] = useState(false); // Untuk loading pengaturan
  const [showSettingsDetails, setShowSettingsDetails] = useState(false); // State untuk mengontrol tampilan detail settings

  const MAX_FILE_SIZE_MB = 5;

  useEffect(() => {
    fetchProfile();
    fetchNotificationSettings();
  }, []);

  // --- Fungsi Utama (Tidak Dirubah Logika Supabase-nya) ---
  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        showToast({
          title: t.accessDenied || "Access Denied",
          message:
            t.mustLoginToViewProfile ||
            "You must be logged in to view your profile.",
          type: "error",
        });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditForm({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
        });
      } else {
        const newProfile = {
          id: user.id,
          full_name:
            user.email?.split("@")[0] ||
            (language === "id" ? "Pengguna" : "User"),
          phone_number: "",
          avatar_url: null,
          join_date: new Date().toISOString(),
          streak: 0,
          completed_activities: 0,
          risk_score_current: 0,
          risk_score_previous: 0,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
        setEditForm({
          full_name: createdProfile.full_name,
          phone_number: createdProfile.phone_number || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showToast({
        title: t.error || "Error",
        message: t.failedToLoadProfileData || "Failed to load profile data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone_number: editForm.phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editForm.full_name,
              phone_number: editForm.phone_number,
            }
          : null
      );

      setIsEditing(false);
      showToast({
        title: t.profileUpdated || "Profile Updated",
        message:
          t.profileSavedSuccessfully ||
          "Your profile has been saved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast({
        title: t.error || "Error",
        message:
          t.failedToSaveProfileChanges ||
          "Failed to save profile changes. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // --- REVERTED TO PREVIOUS WORKING VERSION + CACHE BUSTING ---
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) {
      showToast({
        title: t.errorUpload || "Upload Error",
        message:
          t.noFileSelectedOrProfileNotLoaded ||
          "No file selected or profile not loaded.",
        type: "error",
      });
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast({
        title: t.invalidFileType || "Invalid File Type",
        message:
          t.pleaseSelectValidImage ||
          "Please select a valid image file (JPG, PNG, or WebP).",
        type: "error",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast({
        title: t.fileTooLarge || "File Too Large",
        message: `${t.fileSizeMustBeLessThan} ${MAX_FILE_SIZE_MB}MB.`,
        type: "error",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      // Always use a generic filename like 'avatar' in the user's folder
      // to ensure 'upsert' replaces the old one.
      const filePathInBucket = `${profile.id}/avatar.${fileExt}`; // Path in your 'avatars' bucket

      // --- DEBUGGING NOTE: PERHATIKAN RLS STORAGE DI SINI ---
      // Pastikan RLS di bucket 'avatars' mengizinkan operasi 'update' dan 'insert'
      // bagi pengguna terautentikasi (auth.uid() = folder id mereka).
      const { error: uploadError } = await supabase.storage
        .from("avatars") // NAMA BUCKET ANDA
        .upload(filePathInBucket, file, {
          cacheControl: "3600", // Cache for 1 hour
          upsert: true, // This will overwrite existing file with the same name
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        throw new Error(
          uploadError.message || "Failed to upload file to storage."
        );
      }

      const {
        data: { publicUrl },
        error: getUrlError,
      } = supabase.storage.from("avatars").getPublicUrl(filePathInBucket);

      if (getUrlError) {
        console.error("Supabase getPublicUrl Error:", getUrlError);
        throw new Error(getUrlError.message || "Failed to get public URL.");
      }

      // Add cache-busting parameter to the URL to force browser refresh
      const uniquePublicUrl = `${publicUrl}?v=${new Date().getTime()}`;

      // --- DEBUGGING NOTE: PERHATIKAN RLS TABLE 'PROFILES' DI SINI ---
      // Pastikan RLS di tabel 'profiles' mengizinkan operasi 'update'
      // bagi pengguna terautentikasi (auth.uid() = id profil).
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: uniquePublicUrl, // Update with cache-busted URL
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateProfileError) {
        console.error("Supabase Profile Update Error:", updateProfileError);
        throw new Error(
          updateProfileError.message || "Failed to update profile avatar URL."
        );
      }

      // Update local state to immediately reflect the new avatar
      setProfile((prev) =>
        prev ? { ...prev, avatar_url: uniquePublicUrl } : null
      );

      showToast({
        title: t.avatarUpdated || "Avatar Updated",
        message:
          t.profilePictureUpdatedSuccessfully ||
          "Your profile picture has been updated successfully!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error during avatar upload process:", error);
      showToast({
        title: t.uploadFailed || "Upload Failed",
        message: `${t.failedToUploadAvatar}. ${
          error.message || "Unknown error."
        }`,
        type: "error",
      });
    } finally {
      setUploadingAvatar(false);
      event.target.value = ""; // Clear the input field
    }
  };

  // --- Fitur Hapus Avatar (kembalikan ke versi stabil) ---
  const handleAvatarDelete = async () => {
    if (!profile || !profile.avatar_url) return;

    if (
      !window.confirm(
        t.confirmDeleteAvatar ||
          "Are you sure you want to delete your profile picture? This action cannot be undone."
      )
    ) {
      return;
    }

    setUploadingAvatar(true); // Re-use uploadingAvatar state for deletion loading
    try {
      // Extract the file path from the avatar_url
      const url = new URL(profile.avatar_url);
      const pathSegments = url.pathname.split("/");
      // The path inside the bucket starts after '/storage/v1/object/public/[BUCKET_NAME]/'
      const filePathInBucket = pathSegments
        .slice(pathSegments.indexOf("public") + 2)
        .join("/");

      if (!filePathInBucket) {
        console.error(
          "Could not extract file path for deletion:",
          profile.avatar_url
        );
        throw new Error("Invalid avatar URL format for deletion.");
      }

      // --- DEBUGGING NOTE: PERHATIKAN RLS STORAGE DI SINI ---
      // Pastikan RLS di bucket 'avatars' mengizinkan operasi 'delete'
      // bagi pengguna terautentikasi (auth.uid() = folder id mereka).
      const { error: deleteError } = await supabase.storage
        .from("avatars") // NAMA BUCKET ANDA
        .remove([filePathInBucket]);

      if (deleteError) {
        console.error("Supabase Storage Delete Error:", deleteError);
        throw new Error(
          deleteError.message || "Failed to delete file from storage."
        );
      }

      // Set avatar_url in 'profiles' table to null
      // --- DEBUGGING NOTE: PERHATIKAN RLS TABLE 'PROFILES' DI SINI ---
      // Pastikan RLS di tabel 'profiles' mengizinkan operasi 'update'
      // bagi pengguna terautentikasi (auth.uid() = id profil).
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", profile.id);

      if (updateError) {
        console.error(
          "Supabase Profile Update Error (nulling avatar_url):",
          updateError
        );
        throw new Error(
          updateError.message || "Failed to update profile avatar URL to null."
        );
      }

      // Update local state
      setProfile((prev) => (prev ? { ...prev, avatar_url: null } : null));

      showToast({
        title: t.avatarDeleted || "Avatar Deleted",
        message:
          t.profilePictureDeletedSuccessfully ||
          "Profile picture deleted successfully!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error during avatar deletion process:", error);
      showToast({
        title: t.deleteFailed || "Delete Failed",
        message: `${t.failedToDeleteAvatar}. ${
          error.message || "Unknown error."
        }`,
        type: "error",
      });
    } finally {
      setUploadingAvatar(false); // Reset loading state
    }
  };
  // --- Akhir Fitur Hapus Avatar ---

  // --- Fungsi untuk Mengelola Pengaturan Notifikasi (tetap ada untuk dipanggil dari main component) ---
  const fetchNotificationSettings = async () => {
    setLoadingSettings(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoadingSettings(false);
        return;
      }

      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setNotificationSettings(data);
      } else {
        const { data: insertedData, error: insertError } = await supabase
          .from("notification_settings")
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (insertError) throw insertError;
        setNotificationSettings(insertedData);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      showToast({
        title: t.error || "Error",
        message:
          t.failedToLoadNotificationSettings ||
          "Failed to load notification settings.",
        type: "error",
      });
    } finally {
      setLoadingSettings(false);
    }
  };

  const updateNotificationPreference = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    if (!profile) return;
    setLoadingSettings(true);
    try {
      const { error } = await supabase
        .from("notification_settings")
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq("user_id", profile.id);

      if (error) throw error;

      setNotificationSettings((prev) => ({ ...prev, [key]: value }));
      showToast({
        title: t.settingsUpdated || "Settings Updated",
        message:
          t.notificationPreferencesUpdated ||
          "Notification preferences updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating notification preference:", error);
      showToast({
        title: t.error || "Error",
        message:
          t.failedToUpdateNotificationPreferences ||
          "Failed to update notification preferences.",
        type: "error",
      });
    } finally {
      setLoadingSettings(false);
    }
  };

  const avatarLabelOpacity = isAvatarHovered || uploadingAvatar ? 1 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {language === "id" ? "Memuat profil..." : "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-4">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t.profileNotFound || "Profile Not Found"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t.profileNotFoundOrCouldNotBeLoaded ||
              "Profile not found or could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 p-4 font-sans antialiased text-gray-100">
      {/* Efek partikel/blob blur di latar belakang (simulasi liquid) */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700/10 via-emerald-600/10 to-green-700/10"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-blob-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-blob-fast"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500/15 rounded-full blur-3xl animate-blob-medium"></div>
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        <motion.div
          className="backdrop-blur-3xl bg-white/5 dark:bg-gray-800/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            backdropFilter: "blur(30px) saturate(200%)",
            WebkitBackdropFilter: "blur(30px) saturate(200%)",
          }}
        >
          {/* Header Section */}
          <div className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-700/70 via-emerald-600/70 to-green-700/70 opacity-90"></div>
            <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-r from-emerald-600/50 to-teal-700/50"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar Section */}
              <motion.div
                className="relative hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              >
                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-2xl">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white/70" />
                  )}
                </div>

                {/* Tombol Unggah Avatar */}
                <label className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-lg rounded-full p-3 shadow-xl cursor-pointer hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/10">
                  <Camera className="h-5 w-5 text-emerald-300" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>

                {/* Tombol Hapus Avatar (muncul hanya jika ada avatar_url) */}
                {profile.avatar_url && (
                  <motion.button
                    onClick={handleAvatarDelete}
                    disabled={uploadingAvatar} // Nonaktifkan saat sedang upload
                    className="absolute top-2 left-2 bg-red-600/50 backdrop-blur-lg rounded-full p-2 shadow-xl cursor-pointer hover:bg-red-700/70 transition-all duration-300 hover:scale-110 border border-white/10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    {uploadingAvatar ? ( // Re-use uploadingAvatar state for deletion loading indicator
                      <div className="animate-spin h-5 w-5 text-white flex items-center justify-center">
                        <span className="block h-3 w-3 rounded-full border-2 border-white border-t-transparent"></span>
                      </div>
                    ) : (
                      <Trash2 className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                )}

                {/* Indikator Loading untuk Unggahan Avatar */}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                  </div>
                )}
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left text-white">
                <motion.h1
                  className="text-3xl lg:text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {profile.full_name}
                </motion.h1>
                <motion.p
                  className="text-emerald-200 mb-6 text-lg font-light"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {t.memberSince || "Member since"}{" "}
                  {new Date(profile.join_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </motion.p>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: t.dayStreak || "Day Streak",
                      value: profile.streak,
                      icon: "🔥",
                    },
                    {
                      label: t.activities || "Activities",
                      value: profile.completed_activities,
                      icon: "⚡",
                    },
                    {
                      label: t.riskScore || "Risk Score",
                      value: profile.risk_score_current.toFixed(1),
                      icon: "🎯",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/10 shadow-xl hover:bg-white/15 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-2xl font-bold text-emerald-300">
                        {stat.value}
                      </div>
                      <div className="text-xs text-emerald-100 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className="backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white p-4 rounded-2xl transition-all duration-300 border border-white/10 shadow-xl hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 className="h-6 w-6 text-emerald-300" />
              </motion.button>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Personal Information Card */}
              <motion.div
                className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 rounded-2xl p-6 border border-white/10 shadow-xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              >
                <h3 className="text-xl font-bold text-emerald-200 flex items-center mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-xl mr-3">
                    <User className="h-6 w-6 text-emerald-400" />
                  </div>
                  {t.personalInformation || "Personal Information"}
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      {t.fullName || "Full Name"}
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
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 shadow-lg"
                        placeholder={t.enterFullName || "Enter full name"}
                      />
                    ) : (
                      <div className="backdrop-blur-xl bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-medium">
                        {profile.full_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      {t.phoneNumber || "Phone Number"}
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
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 shadow-lg"
                        placeholder={t.enterPhoneNumber || "Enter phone number"}
                      />
                    ) : (
                      <div className="backdrop-blur-xl bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-medium">
                        {profile.phone_number || (
                          <span className="text-gray-400 italic">
                            {t.notProvided || "Not provided"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Simpan/Batal saat dalam mode edit */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      className="flex flex-wrap gap-4 pt-6"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            {t.saving || "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            {t.saveChanges || "Save Changes"}
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            full_name: profile.full_name,
                            phone_number: profile.phone_number || "",
                          });
                        }}
                        className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        {t.cancel || "Cancel"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Account Settings Card (New Structure) */}
              <motion.div
                className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 rounded-2xl p-6 border border-white/10 shadow-xl"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              >
                {/* Header Utama "Account Settings" yang bisa di-toggle */}
                <button
                  onClick={() => setShowSettingsDetails(!showSettingsDetails)}
                  className="w-full flex items-center justify-between p-2 rounded-xl transition-colors duration-300 hover:bg-white/5 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-500/20 rounded-xl mr-3">
                      <Settings className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-200">
                      {t.accountSettings || "Account Settings"}
                    </h3>
                  </div>
                  {showSettingsDetails ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Detail Pengaturan yang Ter-collapse/Expand */}
                <AnimatePresence>
                  {showSettingsDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Bagian Keamanan (Password & Delete) */}
                      <SecuritySettingsSection
                        language={language}
                        translations={t}
                        showToast={showToast}
                      />

                      {/* Bagian Bahasa */}
                      <LanguageSettingsSection
                        language={language}
                        translations={t}
                      />

                      {/* Bagian Data Akun */}
                      <DataSettingsSection
                        language={language}
                        translations={t}
                        showToast={showToast}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Activity Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 rounded-2xl p-6 border border-white/10 shadow-xl"
            >
              <h3 className="text-xl font-bold text-emerald-200 flex items-center mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-xl mr-3">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                {t.activitySummary || "Activity Summary"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Risk Score */}
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    {t.currentScore || "Current Score"}
                  </h4>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    {profile.risk_score_current.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.latestRiskScore || "Latest risk score"}
                  </p>
                </div>

                {/* Previous Score */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    {t.previousScore || "Previous Score"}
                  </h4>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {profile.risk_score_previous.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.lastPeriodScore || "Last period score"}
                  </p>
                </div>

                {/* Score Change */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {profile.risk_score_current >=
                    profile.risk_score_previous ? (
                      <TrendingUp className="h-8 w-8 text-red-600 dark:text-red-400" />
                    ) : (
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400 transform rotate-180" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    {t.change || "Change"}
                  </h4>
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      profile.risk_score_current >= profile.risk_score_previous
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {profile.risk_score_current >= profile.risk_score_previous
                      ? "+"
                      : ""}
                    {(
                      profile.risk_score_current - profile.risk_score_previous
                    ).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.fromLastPeriod || "From last period"}
                  </p>
                </div>
              </div>

              {/* Progress Insights */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                  {t.progressInsights || "Progress Insights"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === "id"
                        ? `${profile.completed_activities} aktivitas telah diselesaikan`
                        : `${profile.completed_activities} activities completed`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === "id"
                        ? `Streak ${profile.streak} hari berturut-turut`
                        : `${profile.streak} days consecutive streak`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === "id"
                        ? "Profil aktif dan terverifikasi"
                        : "Active and verified profile"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {language === "id"
                        ? "Data terenkripsi dan aman"
                        : "Encrypted and secure data"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfileManager;
