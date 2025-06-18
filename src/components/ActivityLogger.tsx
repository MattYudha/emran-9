import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Activity, 
  Calendar, 
  Clock, 
  Smile, 
  Meh, 
  Frown,
  Save,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { supabase } from '../api/supabaseClient';

interface ActivityLoggerProps {
  onActivityLogged: () => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onActivityLogged }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: '',
    description: '',
    mood_score: 5
  });

  const activityTypes = [
    { value: 'printing_project', label: language === 'id' ? 'Proyek Cetak' : 'Printing Project' },
    { value: 'design_work', label: language === 'id' ? 'Pekerjaan Desain' : 'Design Work' },
    { value: 'client_meeting', label: language === 'id' ? 'Pertemuan Klien' : 'Client Meeting' },
    { value: 'quality_check', label: language === 'id' ? 'Pemeriksaan Kualitas' : 'Quality Check' },
    { value: 'learning', label: language === 'id' ? 'Pembelajaran' : 'Learning' },
    { value: 'planning', label: language === 'id' ? 'Perencanaan' : 'Planning' }
  ];

  const moodEmojis = [
    { score: 1, emoji: '😢', label: 'Very Bad' },
    { score: 2, emoji: '😞', label: 'Bad' },
    { score: 3, emoji: '😐', label: 'Neutral' },
    { score: 4, emoji: '😊', label: 'Good' },
    { score: 5, emoji: '😄', label: 'Great' },
    { score: 6, emoji: '🤩', label: 'Amazing' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity_type || !formData.description) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_activities')
        .insert([
          {
            user_id: user.id,
            activity_type: formData.activity_type,
            description: formData.description,
            mood_score: formData.mood_score
          }
        ]);

      if (error) throw error;

      // Update user profile completed activities count
      const { error: profileError } = await supabase.rpc('increment_completed_activities', {
        user_id: user.id
      });

      if (profileError) console.error('Error updating profile:', profileError);

      setFormData({ activity_type: '', description: '', mood_score: 5 });
      setIsOpen(false);
      onActivityLogged();
    } catch (error) {
      console.error('Error logging activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        {language === 'id' ? 'Log Aktivitas' : 'Log Activity'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-500" />
                  {language === 'id' ? 'Log Aktivitas Baru' : 'Log New Activity'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'id' ? 'Jenis Aktivitas' : 'Activity Type'}
                  </label>
                  <select
                    value={formData.activity_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, activity_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">{language === 'id' ? 'Pilih jenis aktivitas' : 'Select activity type'}</option>
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'id' ? 'Deskripsi' : 'Description'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder={language === 'id' ? 'Jelaskan aktivitas Anda...' : 'Describe your activity...'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'id' ? 'Mood Score (1-6)' : 'Mood Score (1-6)'}
                  </label>
                  <div className="flex justify-between items-center">
                    {moodEmojis.map((mood) => (
                      <button
                        key={mood.score}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mood_score: mood.score }))}
                        className={`p-2 rounded-lg transition-all ${
                          formData.mood_score === mood.score
                            ? 'bg-green-100 dark:bg-green-900 scale-110'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {language === 'id' ? 'Pilih mood Anda saat ini' : 'Select your current mood'}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.activity_type || !formData.description}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {loading 
                      ? (language === 'id' ? 'Menyimpan...' : 'Saving...') 
                      : (language === 'id' ? 'Simpan' : 'Save')
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActivityLogger;
