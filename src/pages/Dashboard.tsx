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
  PieChart 
} from 'lucide-react';
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
        .limit(10);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // NEW: Fetch dashboard analytics summary
      const dashboardAnalytics = await analyticsService.getDashboardAnalyticsSummaryForUser(user.id);

      setGoals(goalsData || []);
      setActivities(activitiesData || []);
      setProfile(profileData);
      setAnalyticsSummary(dashboardAnalytics); 
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

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, status: status as any } : goal
      ));
      fetchUserData(); 
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      fetchUserData(); 
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
    return labels[type]?.[language] || type;
  };

  // NEW: Hitung rincian status tujuan
  const goalStatusCounts = goals.reduce((acc, goal) => {
    acc[goal.status] = (acc[goal.status] || 0) + 1;
    return acc;
  }, {} as Record<UserGoal['status'], number>);

  const totalGoals = goals.length;
  const completedGoals = goalStatusCounts.completed || 0;
  const goalCompletionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : '0.0';


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
                      {/* NEW: Goal Status Breakdown - Simple visual text */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
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
                              {/* BARIS YANG DIMODIFIKASI UNTUK PERBAIKAN SINTAKS */}
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
            {/* Progress Chart */}
            <ProgressChart />

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t.noActivitiesYet || 'Aktivitas Terbaru'}
                  </h2>
                  {activities.length > 0 && <ActivityLogger onActivityLogged={fetchUserData} />}
                </div>
              </div>
              <div className="p-6">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      {t.noActivitiesYet}
                    </p>
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