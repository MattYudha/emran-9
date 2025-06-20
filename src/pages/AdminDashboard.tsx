// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  FileText,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Bell,
  Target,
  Activity,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Cell
} from 'recharts'; // Import Recharts components
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { supabase } from '../api/supabaseClient';
import { analyticsService } from '../services/analyticsService'; // Import analyticsService

// Import types from your d.ts files
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
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description?: string;
  mood_score?: number;
  created_at: string;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface AIConfig {
  id: string;
  parameter_name: string;
  parameter_value: number;
  parameter_type: 'number' | 'string' | 'boolean';
  description?: string;
  min_value?: number;
  max_value?: number;
  is_active: boolean;
  last_updated_by?: string;
  created_at: string;
  updated_at: string;
}

interface AIFeedback {
  id: string;
  image_url?: string;
  user_query: string;
  ai_response: string;
  user_feedback?: 'positive' | 'negative' | 'neutral';
  correct_response?: string;
  feedback_notes?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reviewer_id?: string;
  session_id?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data: Record<string, any>;
  user_id?: string;
  session_id: string;
  timestamp: string;
  user_agent?: string;
  ip_address?: string;
}

interface DashboardStats {
  totalContacts: number;
  totalRFQs: number;
  pendingRFQs: number;
  totalUsers: number;
  todayContacts: number;
  todayRFQs: number;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  lang?: string;
  source_ip?: string;
  user_agent?: string;
  created_at: string;
}

interface RFQSubmission {
  id: string;
  user_name: string;
  user_email: string;
  project_name: string;
  product_category?: string;
  size_specifications?: string;
  quantity: number;
  deadline?: string;
  design_file_urls?: string[];
  additional_notes?: string;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  currency?: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'completed' | 'cancelled';
  source_ip?: string;
  user_agent?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

interface MonthlyTrafficData {
  month: string;
  visitors: number;
  year: number;
}

interface DailyTrafficData {
  date: string;
  visitors: number;
}

interface YoYGrowthData {
  year: number;
  month: string;
  growth: number;
}

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalRFQs: 0,
    pendingRFQs: 0,
    totalUsers: 0,
    todayContacts: 0,
    todayRFQs: 0
  });
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [rfqs, setRFQs] = useState<RFQSubmission[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [aiConfigs, setAiConfigs] = useState<AIConfig[]>([]);
  const [aiFeedbacks, setAiFeedbacks] = useState<AIFeedback[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  // NEW: State for chart data
  const [monthlyTraffic, setMonthlyTraffic] = useState<MonthlyTrafficData[]>([]);
  const [dailyTraffic, setDailyTraffic] = useState<DailyTrafficData[]>([]);
  const [yoyGrowth, setYoYGrowth] = useState<YoYGrowthData[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // For RFQ and Feedback status filter

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await fetchDashboardStats();
        if (activeTab === 'overview') {
          await Promise.all([
            fetchContacts(),
            fetchRFQs(),
            fetchMonthlyTraffic(), // Fetch data for charts
            fetchDailyTraffic(),
            fetchYoYGrowth()
          ]);
        } else if (activeTab === 'contacts') {
          await fetchContacts();
        } else if (activeTab === 'rfqs') {
          await fetchRFQs();
        } else if (activeTab === 'users') {
          await fetchUsers();
        } else if (activeTab === 'goals') {
          await fetchGoals();
        } else if (activeTab === 'activities') {
          await fetchActivities();
        } else if (activeTab === 'notifications_admin') {
          await fetchNotifications();
        } else if (activeTab === 'ai_config') {
          await fetchAiConfigs();
        } else if (activeTab === 'ai_feedback') {
          await fetchAiFeedbacks();
        } else if (activeTab === 'analytics') {
          await fetchAnalyticsEvents();
        }
      } catch (error) {
        console.error('Error fetching data for tab:', activeTab, error);
        // Handle error display
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, searchTerm, filterStatus]); // Re-fetch when tab or filters change

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        window.location.href = '/'; // Redirect if not admin
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      window.location.href = '/';
    }
  };

  const fetchDashboardStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { count: contactsCount, data: contactsDataToday, error: contactsError } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' });
    const { count: rfqsCount, data: rfqsDataToday, error: rfqsError } = await supabase
      .from('rfq_submissions')
      .select('*', { count: 'exact' });
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (contactsError) throw contactsError;
    if (rfqsError) throw rfqsError;
    if (usersError) throw usersError;

    const todayContacts = contactsDataToday?.filter(c => c.created_at.startsWith(today)).length || 0;
    const todayRFQs = rfqsDataToday?.filter(r => r.created_at.startsWith(today)).length || 0;
    const pendingRFQs = rfqsDataToday?.filter(r => r.status === 'pending').length || 0;

    setStats({
      totalContacts: contactsCount || 0,
      totalRFQs: rfqsCount || 0,
      pendingRFQs,
      totalUsers: usersCount || 0,
      todayContacts,
      todayRFQs
    });
  };

  // NEW: Functions to fetch chart data
  const fetchMonthlyTraffic = async () => {
    try {
      const data = await analyticsService.getMonthlyWebsiteTraffic();
      setMonthlyTraffic(data);
    } catch (error) {
      console.error('Error fetching monthly traffic:', error);
    }
  };

  const fetchDailyTraffic = async () => {
    try {
      const data = await analyticsService.getDailyWebsiteTraffic();
      setDailyTraffic(data);
    } catch (error) {
      console.error('Error fetching daily traffic:', error);
    }
  };

  const fetchYoYGrowth = async () => {
    try {
      const data = await analyticsService.getYearOverYearGrowth();
      setYoYGrowth(data);
    } catch (error) {
      console.error('Error fetching YoY growth:', error);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(activeTab === 'overview' ? 5 : 50); // Limit for overview tab

    if (error) throw error;
    setContacts(data || []);
  };

  const fetchRFQs = async () => {
    let query = supabase
      .from('rfq_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeTab === 'overview') {
      query = query.limit(5); // Limit for overview tab
    } else {
      query = query.limit(50);
    }

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }
    if (searchTerm) {
        query = query.or(`user_name.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%,project_name.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    setRFQs(data || []);
  };

  const fetchUsers = async () => {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching users:', error);
    else setUsers(data || []);
  };

  const fetchGoals = async () => {
    let query = supabase.from('user_goals').select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') { // Reuse filterStatus for goals
      query = query.eq('status', filterStatus);
    }
    if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching goals:', error);
    else setGoals(data || []);
  };

  const fetchActivities = async () => {
    let query = supabase.from('user_activities').select('*').order('created_at', { ascending: false });
     if (searchTerm) {
        query = query.or(`activity_type.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching activities:', error);
    else setActivities(data || []);
  };

  const fetchNotifications = async () => {
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') { // Reuse filterStatus for notification type
        query = query.eq('type', filterStatus);
    }
    if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching notifications:', error);
    else setNotifications(data || []);
  };

  const fetchAiConfigs = async () => {
    let query = supabase.from('ai_config').select('*').order('parameter_name', { ascending: true });
     if (searchTerm) {
        query = query.or(`parameter_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching AI Configs:', error);
    else setAiConfigs(data || []);
  };

  const fetchAiFeedbacks = async () => {
    let query = supabase.from('ai_feedback_queue').select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') { // Reuse filterStatus for feedback status
        query = query.eq('status', filterStatus);
    }
    if (searchTerm) {
        query = query.or(`user_query.ilike.%${searchTerm}%,ai_response.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching AI Feedbacks:', error);
    else setAiFeedbacks(data || []);
  };

  const fetchAnalyticsEvents = async () => {
    let query = supabase.from('analytics_events').select('*').order('timestamp', { ascending: false });
    if (filterStatus !== 'all') { // Reuse filterStatus for event type
        query = query.eq('event_type', filterStatus);
    }
    if (searchTerm) {
        query = query.or(`event_type.ilike.%${searchTerm}%,session_id.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) console.error('Error fetching Analytics Events:', error);
    else setAnalyticsEvents(data || []);
  };


  const updateRFQStatus = async (rfqId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('rfq_submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rfqId);

      if (error) throw error;
      setRFQs(prev => prev.map(rfq => rfq.id === rfqId ? { ...rfq, status: newStatus } : rfq));
    } catch (error) {
      console.error('Error updating RFQ status:', error);
    }
  };

  const updateAIConfigParameter = async (id: string, value: number | string | boolean) => {
    try {
      const { error } = await supabase
        .from('ai_config')
        .update({ parameter_value: value, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setAiConfigs(prev => prev.map(config => config.id === id ? { ...config, parameter_value: value as number } : config));
    } catch (error) {
      console.error('Error updating AI config:', error);
    }
  };

  const updateAIFeedbackStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('ai_feedback_queue')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setAiFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: newStatus as 'pending' | 'reviewed' | 'resolved' } : fb));
    } catch (error) {
      console.error('Error updating AI feedback status:', error);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this item from ${table}?`)) {
      return;
    }
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      // Re-fetch data for the active tab
      if (table === 'profiles') fetchUsers();
      else if (table === 'user_goals') fetchGoals();
      else if (table === 'user_activities') fetchActivities();
      else if (table === 'notifications') fetchNotifications();
      else if (table === 'ai_feedback_queue') fetchAiFeedbacks();
      else if (table === 'analytics_events') fetchAnalyticsEvents();
      console.log(`Deleted item from ${table}: ${id}`);
    } catch (error) {
      console.error(`Error deleting item from ${table}:`, error);
    }
  };

  const exportData = (type: string, data: any[]) => {
    let headers: string[] = [];
    let csvContent: string = '';

    if (type === 'contacts') {
      headers = ['Name', 'Email', 'Subject', 'Message', 'Language', 'Source IP', 'User Agent', 'Date'];
      csvContent = [
        headers.join(','),
        ...data.map((item: ContactSubmission) =>
          [
            item.name,
            item.email,
            item.subject,
            `"${item.message.replace(/"/g, '""')}"`,
            item.lang || '',
            item.source_ip || '',
            `"${item.user_agent?.replace(/"/g, '""') || ''}"`,
            new Date(item.created_at).toLocaleDateString()
          ].join(',')
        )
      ].join('\n');
    } else if (type === 'rfqs') {
      headers = ['User Name', 'User Email', 'Project Name', 'Category', 'Size Specs', 'Quantity', 'Deadline', 'Design Files', 'Notes', 'Min Cost', 'Max Cost', 'Currency', 'Status', 'Source IP', 'User Agent', 'Language', 'Created At'];
      csvContent = [
        headers.join(','),
        ...data.map((item: RFQSubmission) =>
          [
            item.user_name,
            item.user_email,
            item.project_name,
            item.product_category || '',
            item.size_specifications || '',
            item.quantity,
            item.deadline || '',
            `"${item.design_file_urls?.join('; ').replace(/"/g, '""') || ''}"`,
            `"${item.additional_notes?.replace(/"/g, '""') || ''}"`,
            item.estimated_cost_min || '',
            item.estimated_cost_max || '',
            item.currency || 'IDR',
            item.status,
            item.source_ip || '',
            `"${item.user_agent?.replace(/"/g, '""') || ''}"`,
            item.language || '',
            new Date(item.created_at).toLocaleDateString()
          ].join(',')
        )
      ].join('\n');
    } else if (type === 'users') {
        headers = ['ID', 'Full Name', 'Phone Number', 'Role', 'Join Date', 'Streak', 'Activities Done', 'Current Risk Score'];
        csvContent = [
            headers.join(','),
            ...data.map((item: UserProfile) => [
                item.id, item.full_name, item.phone_number || '', item.role,
                new Date(item.join_date).toLocaleDateString(), item.streak,
                item.completed_activities, item.risk_score_current
            ].join(','))
        ].join('\n');
    } else if (type === 'goals') {
        headers = ['ID', 'User ID', 'Title', 'Description', 'Target Date', 'Status', 'Created At'];
        csvContent = [
            headers.join(','),
            ...data.map((item: UserGoal) => [
                item.id, item.user_id, item.title, `"${item.description?.replace(/"/g, '""') || ''}"`,
                item.target_date || '', item.status, new Date(item.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');
    } else if (type === 'activities') {
        headers = ['ID', 'User ID', 'Activity Type', 'Description', 'Mood Score', 'Created At'];
        csvContent = [
            headers.join(','),
            ...data.map((item: UserActivity) => [
                item.id, item.user_id, item.activity_type, `"${item.description?.replace(/"/g, '""') || ''}"`,
                item.mood_score || '', new Date(item.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');
    } else if (type === 'notifications') {
        headers = ['ID', 'User ID', 'Title', 'Message', 'Type', 'Read', 'Created At'];
        csvContent = [
            headers.join(','),
            ...data.map((item: Notification) => [
                item.id, item.user_id, item.title, `"${item.message.replace(/"/g, '""')}"`,
                item.type, item.is_read ? 'true' : 'false', new Date(item.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');
    } else if (type === 'ai_configs') {
        headers = ['ID', 'Parameter Name', 'Value', 'Type', 'Description', 'Min Value', 'Max Value', 'Active'];
        csvContent = [
            headers.join(','),
            ...data.map((item: AIConfig) => [
                item.id, item.parameter_name, item.parameter_value, item.parameter_type,
                `"${item.description?.replace(/"/g, '""') || ''}"`, item.min_value || '', item.max_value || '', item.is_active ? 'true' : 'false'
            ].join(','))
        ].join('\n');
    } else if (type === 'ai_feedbacks') {
        headers = ['ID', 'Image URL', 'User Query', 'AI Response', 'User Feedback', 'Correct Response', 'Notes', 'Status', 'Session ID', 'Language', 'Created At'];
        csvContent = [
            headers.join(','),
            ...data.map((item: AIFeedback) => [
                item.id, item.image_url || '', `"${item.user_query.replace(/"/g, '""')}"`,
                `"${item.ai_response.replace(/"/g, '""')}"`, item.user_feedback || '',
                `"${item.correct_response?.replace(/"/g, '""') || ''}"`, `"${item.feedback_notes?.replace(/"/g, '""') || ''}"`,
                item.status, item.session_id || '', item.language || '', new Date(item.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');
    } else if (type === 'analytics_events') {
        headers = ['ID', 'Event Type', 'Event Data', 'User ID', 'Session ID', 'Timestamp', 'User Agent'];
        csvContent = [
            headers.join(','),
            ...data.map((item: AnalyticsEvent) => [
                item.id, item.event_type, `"${JSON.stringify(item.event_data).replace(/"/g, '""')}"`,
                item.user_id || '', item.session_id, new Date(item.timestamp).toLocaleString(),
                `"${item.user_agent?.replace(/"/g, '""') || ''}"`
            ].join(','))
        ].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'quoted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const StatCard = ({ icon, title, value, change, color }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    change?: number;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+{change} today</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const tabList = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'rfqs', label: 'RFQs', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'notifications_admin', label: 'Notifications', icon: Bell },
    { id: 'ai_config', label: 'AI Config', icon: Settings },
    { id: 'ai_feedback', label: 'AI Feedback', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your business operations and monitor performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Mail className="h-6 w-6 text-white" />}
            title="Total Contacts"
            value={stats.totalContacts}
            change={stats.todayContacts}
            color="bg-blue-500"
          />
          <StatCard
            icon={<FileText className="h-6 w-6 text-white" />}
            title="Total RFQs"
            value={stats.totalRFQs}
            change={stats.todayRFQs}
            color="bg-green-500"
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-white" />}
            title="Pending RFQs"
            value={stats.pendingRFQs}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<Users className="h-6 w-6 text-white" />}
            title="Total Users"
            value={stats.totalUsers}
            color="bg-purple-500"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6 overflow-x-auto pb-2">
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(''); setFilterStatus('all'); }} // Reset filters on tab change
                  className={`flex-shrink-0 flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Website Traffic Chart */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-80">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Monthly Website Traffic (Visitors)
                      </h3>
                      <ResponsiveContainer width="100%" height="80%">
                        <BarChart
                          data={monthlyTraffic}
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                          <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                          <YAxis style={{ fontSize: '12px' }} />
                          <Tooltip cursor={{ fill: 'transparent' }} />
                          <Bar dataKey="visitors" fill="#4CAF50" /> {/* Green color */}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Daily Website Traffic Histogram */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-80">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Distribution of Daily Website Traffic
                      </h3>
                      <ResponsiveContainer width="100%" height="80%">
                         {/* Recharts doesn't have a direct "histogram" component, but you can simulate it with a BarChart where bins are pre-calculated or simply use the raw data if it represents daily counts */}
                        <BarChart
                          data={dailyTraffic}
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                          <XAxis dataKey="visitors" type="number" domain={['auto', 'auto']}
                            tickFormatter={(value) => `${Math.floor(value/1000)}k`}
                            label={{ value: 'Daily Visitors', position: 'insideBottom', offset: 0, fill: 'gray' }}
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis dataKey="count"
                             label={{ value: 'Number of Days', angle: -90, position: 'insideLeft', fill: 'gray' }}
                             style={{ fontSize: '12px' }}
                          />
                          <Tooltip formatter={(value: number) => [value, 'Days']} />
                           {/* You would need to pre-process dailyTraffic into bins if you want a true histogram.
                            For now, this treats each unique daily visitor count as a bar. */}
                          <Bar dataKey="visitors" fill="#82ca9d" /> {/* Light green */}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Monthly Comparison (2022 vs 2023) */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-80">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Monthly Traffic Comparison (Current vs Previous Year)
                      </h3>
                      <ResponsiveContainer width="100%" height="80%">
                        <BarChart
                          data={monthlyTraffic} // Use monthly traffic, but ensure it has data for multiple years
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                          <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                          <YAxis style={{ fontSize: '12px' }} />
                          <Tooltip />
                          {/* To compare years, you'd need to restructure data like:
                          [{ month: 'Jan', '2022': 10000, '2023': 12000 }, ...]
                          For this example, we'll just show monthly traffic and mention comparison concept.*/}
                          <Bar dataKey="visitors" fill="#8884d8" name="Current Year" />
                           {/* You'd add another Bar for previous year's data if structured */}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Histogram: Distribution of YoY Growth */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-80">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Distribution of Year-over-Year Growth (%)
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart
                                data={yoyGrowth}
                                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis dataKey="growth" type="number" 
                                    tickFormatter={(value) => `${value}%`}
                                    label={{ value: 'Year-over-Year Growth (%)', position: 'insideBottom', offset: 0, fill: 'gray' }}
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis dataKey="count"
                                    label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: 'gray' }}
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip formatter={(value: number) => [`${value}%`, 'Frequency']} />
                                {/* For a true histogram, yoyGrowth data should be binned by growth percentages.
                                    Here, we'll display growth per month as bars. */}
                                <Bar dataKey="growth" fill="#ff7f0e"> {/* Orange color */}
                                    {/* You can add custom styling per bar here */}
                                    {yoyGrowth.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.growth > 0 ? '#ff7f0e' : '#e74c3c'} />
                                    ))}
                                </Bar>
                                {/* Example of a mean reference line */}
                                <ReferenceLine x={41.2} stroke="red" strokeDasharray="3 3" label="Mean: 41.2%" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Contacts */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 lg:col-span-1"> {/* Adjusted span */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Contacts
                      </h3>
                      <div className="space-y-3">
                        {contacts.slice(0, 5).map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{contact.subject}</p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(contact.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent RFQs */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 lg:col-span-1"> {/* Adjusted span */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent RFQs
                      </h3>
                      <div className="space-y-3">
                        {rfqs.slice(0, 5).map((rfq) => (
                          <div key={rfq.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{rfq.project_name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{rfq.user_name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
                              {rfq.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contacts' && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search contacts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={fetchContacts} // Changed to fetchContacts specific to tab
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </button>
                    </div>
                    <button
                      onClick={() => exportData('contacts', contacts)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>

                  {/* Contacts Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {contacts.filter(contact =>
                          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {contact.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {contact.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {contact.subject}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {contact.message}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(contact.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                <Eye className="h-4 w-4" />
                              </button>
                              <a
                                href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => handleDelete('contact_submissions', contact.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rfqs' && (
                <motion.div
                  key="rfqs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search RFQs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="quoted">Quoted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => exportData('rfqs', rfqs)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>

                  {/* RFQs Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {rfqs.map((rfq) => (
                          <tr key={rfq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {rfq.project_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {rfq.product_category}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {rfq.user_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {rfq.user_email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {rfq.quantity.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={rfq.status}
                                onChange={(e) => updateRFQStatus(rfq.id, e.target.value)}
                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-green-500 ${getStatusColor(rfq.status)}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="quoted">Quoted</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(rfq.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                <Eye className="h-4 w-4" />
                              </button>
                              <a
                                href={`mailto:${rfq.user_email}?subject=Re: ${rfq.project_name} RFQ`}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => handleDelete('rfq_submissions', rfq.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                    <button
                      onClick={() => exportData('users', users)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Join Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.phone_number || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(user.join_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('profiles', user.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search goals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={fetchGoals}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                    <button
                      onClick={() => exportData('goals', goals)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Target Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {goals.map((goal) => (
                          <tr key={goal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{goal.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{goal.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{goal.user_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{goal.target_date ? new Date(goal.target_date).toLocaleDateString() : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={goal.status}
                                    onChange={(e) => { /* Implement update goal status logic */ }}
                                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-green-500 ${getStatusColor(goal.status)}`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('user_goals', goal.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <motion.div
                  key="activities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={fetchActivities}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                    <button
                      onClick={() => exportData('activities', activities)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activity Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mood</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {activities.map((activity) => (
                          <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{activity.activity_type}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs">{activity.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{activity.mood_score || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{activity.user_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(activity.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('user_activities', activity.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab (Admin View) */}
              {activeTab === 'notifications_admin' && (
                <motion.div
                  key="notifications_admin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                    </select>
                    <button
                        onClick={fetchNotifications}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                    <button
                      onClick={() => exportData('notifications', notifications)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Read</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map((notif) => (
                          <tr key={notif.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{notif.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs">{notif.message}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{notif.user_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notif.type)}`}>
                                    {notif.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{notif.is_read ? 'Yes' : 'No'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(notif.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('notifications', notif.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai_config' && (
                <motion.div
                  key="ai_config"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search parameters..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={fetchAiConfigs}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                     <button
                      onClick={() => exportData('ai_configs', aiConfigs)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Parameter Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {aiConfigs.map((config) => (
                          <tr key={config.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{config.parameter_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <input
                                    type={config.parameter_type === 'number' ? 'number' : 'text'}
                                    value={config.parameter_value}
                                    onChange={(e) => updateAIConfigParameter(config.id, parseFloat(e.target.value))} // Ensure number parsing
                                    className="w-24 px-2 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">{config.parameter_type}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs">{config.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <input
                                    type="checkbox"
                                    checked={config.is_active}
                                    onChange={(e) => updateAIConfigParameter(config.id, e.target.checked)}
                                    className="rounded text-green-600 focus:ring-green-500"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Edit className="h-4 w-4" />
                                </button>
                                {/* Deletion for AI config might not be desired, but included for completeness */}
                                {/* <button
                                    onClick={() => handleDelete('ai_config', config.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* AI Feedback Tab */}
              {activeTab === 'ai_feedback' && (
                <motion.div
                  key="ai_feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <button
                        onClick={fetchAiFeedbacks}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                    <button
                      onClick={() => exportData('ai_feedbacks', aiFeedbacks)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User Query</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AI Response</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feedback</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {aiFeedbacks.map((feedback) => (
                          <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs">{feedback.user_query}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs">{feedback.ai_response}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">{feedback.user_feedback || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <select
                                    value={feedback.status}
                                    onChange={(e) => updateAIFeedbackStatus(feedback.id, e.target.value)}
                                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-green-500 ${getStatusColor(feedback.status)}`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(feedback.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('ai_feedback_queue', feedback.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    {/* Filter for event type could be added here */}
                    <button
                        onClick={fetchAnalyticsEvents}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                    <button
                      onClick={() => exportData('analytics_events', analyticsEvents)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Session ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {analyticsEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{event.event_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{event.session_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{event.user_id || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(event.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete('analytics_events', event.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      System Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Advanced settings and configurations will be available here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;