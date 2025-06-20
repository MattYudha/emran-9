// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Award,
  Activity,
  MessageSquare, 
  BarChart3,
  Eye, 
  PieChart as PieChartIcon // <-- Diperbaiki: Mengganti nama impor PieChart dari lucide-react
} from 'lucide-react';
import { 
  PieChart, // <-- Ini adalah PieChart dari recharts
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend 
} from 'recharts'; 

import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { supabase } from '../api/supabaseClient';
import ActivityLogger from '../components/ActivityLogger';
import ProgressChart from '../components/ProgressChart'; 
import { analyticsService } from '../services/analyticsService'; 

interface UserGoal {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  activity_type: string;
  description?: string;
  mood_score?: number;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  join_date: string;
  streak: number;
  completed_activities: number;
  risk_score_current: number;
  risk_score_previous: number;
  // role: string; 
}

// NEW: Interface untuk ringkasan analitik
interface DashboardAnalyticsSummary {
  totalChatbotInteractions: number;
  totalServicePageViews: number;
}

// NEW: Interface untuk data bagan
interface ActivityTypeData {
  name: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<DashboardAnalyticsSummary>({ 
    totalChatbotInteractions: 0,
    totalServicePageViews: 0,
  });
  // NEW: State untuk data bagan di dashboard user
  const [activityTypeDistribution, setActivityTypeDistribution] = useState<ActivityTypeData[]>([]);
  const [goalStatusDistribution, setGoalStatusDistribution] = useState<ActivityTypeData[]>([]);

  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_date: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user goals
      const { data: goalsData } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch recent activities
      const { data: activitiesData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10); // Ambil 10 aktivitas terbaru

      // Fetch ALL activities for distribution charts
      const { data: allActivitiesData } = await supabase
        .from('user_activities')
        .select('activity_type')
        .eq('user_id', user.id);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // Fetch dashboard analytics summary
      const dashboardAnalytics = await analyticsService.getDashboardAnalyticsSummaryForUser(user.id);

      setGoals(goalsData || []);
      setActivities(activitiesData || []);
      setProfile(profileData);
      setAnalyticsSummary(dashboardAnalytics); 

      // NEW: Proses data untuk distribusi jenis aktivitas
      const activityTypeCounts = (allActivitiesData || []).reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setActivityTypeDistribution(
        Object.entries(activityTypeCounts).map(([type, count]) => ({
          name: getActivityTypeLabel(type), // Gunakan label terjemahan
          value: count
        }))
      );

      // NEW: Proses data untuk distribusi status tujuan
      const goalStatusCountsMapped = goalsData?.reduce((acc, goal) => {
        acc[goal.status] = (acc[goal.status] || 0) + 1;
        return acc;
      }, {} as Record<UserGoal['status'], number>);

      setGoalStatusDistribution(
        Object.entries(goalStatusCountsMapped || {}).map(([status, count]) => ({
          name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1), // Format "In progress"
          value: count
        }))
      );

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_goals')
        .insert([
          {
            user_id: user.id,
            title: newGoal.title,
            description: newGoal.description,
            target_date: newGoal.target_date || null,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      setNewGoal({ title: '', description: '', target_date: '' });
      setShowGoalForm(false);
      fetchUserData(); 
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoalStatus = async (goalId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', goalId);

      if (error) throw error;

      // Optimistic update, then re-fetch for full consistency
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, status: status as any } : goal
      ));
      await fetchUserData(); // Re-fetch all data to update charts and counts
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!window.confirm(language === 'id' ? 'Apakah Anda yakin ingin menghapus tujuan ini?' : 'Are you sure you want to delete this goal?')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      // Optimistic update, then re-fetch for full consistency
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      await fetchUserData(); // Re-fetch all data to update charts and counts
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: { [key: string]: { id: string; en: string } } = {
      'printing_project': { id: 'Proyek Cetak', en: 'Printing Project' },
      'design_work': { id: 'Pekerjaan Desain', en: 'Design Work' },
      'client_meeting': { id: 'Pertemuan Klien', en: 'Client Meeting' },
      'quality_check': { id: 'Pemeriksaan Kualitas', en: 'Quality Check' },
      'learning': { id: 'Pembelajaran', en: 'Learning' },
      'planning': { id: 'Perencanaan', en: 'Planning' }
    };
    return labels[type]?.[language] || type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1);
  };

  // Hitung rincian status tujuan (tidak berubah, digunakan untuk kartu statistik)
  const goalStatusCounts = goals.reduce((acc, goal) => {
    acc[goal.status] = (acc[goal.status] || 0) + 1;
    return acc;
  }, {} as Record<UserGoal['status'], number>);

  const totalGoals = goals.length;
  const completedGoals = goalStatusCounts.completed || 0;
  const goalCompletionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : '0.0';

  // Warna untuk Pie Chart
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3'];


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'id' ? 'Selamat datang kembali' : 'Welcome back'}, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {language === 'id' 
              ? 'Kelola tujuan cetak Anda dan pantau proyek' 
              : 'Track your printing goals and manage your projects'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"> 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'id' ? 'Streak Saat Ini' : 'Current Streak'}
                </p>
                <p className="text-2xl font-bold text-green-600">{profile?.streak || 0}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'id' ? 'Aktivitas Selesai' : 'Completed Activities'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{profile?.completed_activities || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'id' ? 'Tujuan Aktif' : 'Active Goals'}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {goals.filter(g => g.status === 'in_progress' || g.status === 'pending').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'id' ? 'Skor Risiko' : 'Risk Score'}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {profile?.risk_score_current?.toFixed(1) || '0.0'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>

          {/* NEW: Engagement Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.dashboardTotalChatbotInteractions}
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  {analyticsSummary.totalChatbotInteractions}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-teal-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.dashboardTotalPageViews}
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {analyticsSummary.totalServicePageViews}
                </p>
              </div>
              <Eye className="h-8 w-8 text-indigo-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.dashboardGoalCompletionRate}
                </p>
                <p className="text-2xl font-bold text-pink-600">
                  {goalCompletionRate}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-pink-500" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t.yourGoals}
                  </h2>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addYourFirstGoal}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence>
                  {goals.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {t.noGoalsYet}
                      </p>
                      <button
                        onClick={() => setShowGoalForm(true)}
                        className="text-green-600 hover:text-green-700 font-medium flex items-center mx-auto"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t.addYourFirstGoal}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Goal Status Breakdown - Pie Chart */}
                      <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                          {language === 'id' ? 'Distribusi Status Tujuan' : 'Goal Status Distribution'}
                        </h3>
                        {goalStatusDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={goalStatusDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {goalStatusDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => [value, language === 'id' ? 'Tujuan' : 'Goals']} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400 py-4">Tidak ada data tujuan untuk ditampilkan.</div>
                        )}
                      </div>

                      {/* Goal Status Counts - Simple visual text (already exists) */}
                      <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                          {t.dashboardGoalStatusBreakdown}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{goalStatusCounts.in_progress || 0}</p>
                            <p className="text-sm text-blue-800 dark:text-blue-300">{t.dashboardInProgressGoals}</p>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{goalStatusCounts.pending || 0}</p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">{t.dashboardPendingGoals}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{goalStatusCounts.completed || 0}</p>
                            <p className="text-sm text-green-800 dark:text-green-300">{t.dashboardCompletedGoals}</p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-red-600">{goalStatusCounts.cancelled || 0}</p>
                            <p className="text-sm text-red-800 dark:text-red-300">{t.dashboardCancelledGoals}</p>
                          </div>
                        </div>
                      </div>

                      {/* Goal List (already exists) */}
                      {goals.map((goal, index) => (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }} 
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mr-3">
                                  {goal.title}
                                </h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                                  {getStatusIcon(goal.status)}
                                  <span className="ml-1 capitalize">{goal.status.replace('_', ' ')}</span>
                                </span>
                              </div>
                              {goal.description && (
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                  {goal.description}
                                </p>
                              )}
                              {goal.target_date && (
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {language === 'id' ? 'Target: ' : 'Target: '}
                                  {new Date(goal.target_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {goal.status !== 'completed' && (
                                <button
                                  onClick={() => handleUpdateGoalStatus(goal.id, 'completed')}
                                  className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title={language === 'id' ? 'Tandai sebagai selesai' : 'Mark as completed'}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingGoal(goal)}
                                className={"p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"}
                                title={language === 'id' ? 'Edit tujuan' : 'Edit goal'}
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                className={"p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"}
                                title={language === 'id' ? 'Hapus tujuan' : 'Delete goal'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Chart (Uses Recharts now) */}
            <ProgressChart />

            {/* Activity Type Distribution Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        {language === 'id' ? 'Distribusi Jenis Aktivitas' : 'Activity Type Distribution'}
                    </h2>
                </div>
                <div className="p-6">
                    {activityTypeDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={activityTypeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {activityTypeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [value, language === 'id' ? 'Aktivitas' : 'Activities']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{language === 'id' ? 'Tidak ada data jenis aktivitas.' : 'No activity type data yet.'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t.noActivitiesYet || 'Aktivitas Terbaru'}
                  </h2>
                  {/* ActivityLogger button is always shown now, text changes */}
                  <ActivityLogger onActivityLogged={fetchUserData} buttonText={activities.length > 0 ? (language === 'id' ? 'Log Aktivitas Baru' : 'Log New Activity') : t.logFirstActivity} />
                </div>
              </div>
              <div className="p-6">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {t.noActivitiesYet}
                    </p>
                    {/* Button with dynamic text based on whether there are activities */}
                    <ActivityLogger onActivityLogged={fetchUserData} 
                      buttonText={t.logFirstActivity}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {getActivityTypeLabel(activity.activity_type)}
                          </p>
                          {activity.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {activity.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.mood_score && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {activity.mood_score}/6
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Goal Form Modal */}
        <AnimatePresence>
          {showGoalForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowGoalForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === 'id' ? 'Buat Tujuan Baru' : 'Create New Goal'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'id' ? 'Judul Tujuan' : 'Goal Title'}
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder={language === 'id' ? 'Masukkan judul tujuan' : 'Enter your goal title'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'id' ? 'Deskripsi (Opsional)' : 'Description (Optional)'}
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder={language === 'id' ? 'Jelaskan tujuan Anda' : 'Describe your goal'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'id' ? 'Tanggal Target (Opsional)' : 'Target Date (Optional)'}
                    </label>
                    <input
                      type="date"
                      value={newGoal.target_date}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowGoalForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleCreateGoal}
                    disabled={!newGoal.title.trim()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'id' ? 'Buat Tujuan' : 'Create Goal'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;