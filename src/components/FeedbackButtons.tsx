import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { aiFeedbackService } from '../services/aiFeedbackService';

interface FeedbackButtonsProps {
  messageId: string;
  userQuery: string;
  aiResponse: string;
  imageUrl?: string;
  sessionId?: string;
  onFeedbackSubmitted?: (feedback: 'positive' | 'negative' | 'neutral') => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  messageId,
  userQuery,
  aiResponse,
  imageUrl,
  sessionId,
  onFeedbackSubmitted
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (feedback: 'positive' | 'negative') => {
    if (feedbackGiven) return;
    
    setIsSubmitting(true);
    
    try {
      await aiFeedbackService.submitFeedback({
        imageUrl,
        userQuery,
        aiResponse,
        userFeedback: feedback,
        feedbackNotes: feedbackNotes || undefined,
        sessionId,
        language
      });
      
      setFeedbackGiven(feedback);
      onFeedbackSubmitted?.(feedback);
      
      if (feedback === 'negative') {
        setShowNotes(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitNotes = async () => {
    if (!feedbackNotes.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await aiFeedbackService.submitFeedback({
        imageUrl,
        userQuery,
        aiResponse,
        userFeedback: 'negative',
        feedbackNotes,
        sessionId,
        language
      });
      
      setShowNotes(false);
    } catch (error) {
      console.error('Error submitting feedback notes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackGiven && !showNotes) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2"
      >
        {feedbackGiven === 'positive' ? (
          <>
            <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
            {language === 'id' ? 'Terima kasih atas feedback Anda!' : 'Thank you for your feedback!'}
          </>
        ) : (
          <>
            <ThumbsDown className="h-3 w-3 mr-1 text-red-500" />
            {language === 'id' ? 'Feedback Anda membantu kami berkembang' : 'Your feedback helps us improve'}
          </>
        )}
      </motion.div>
    );
  }

  if (showNotes) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          {language === 'id' 
            ? 'Bantu kami memahami apa yang salah:' 
            : 'Help us understand what went wrong:'}
        </p>
        <textarea
          value={feedbackNotes}
          onChange={(e) => setFeedbackNotes(e.target.value)}
          placeholder={language === 'id' 
            ? 'Apa yang Anda harapkan dari respons ini?' 
            : 'What did you expect from this response?'}
          className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
          rows={2}
        />
        <div className="flex justify-end mt-2 space-x-2">
          <button
            onClick={() => setShowNotes(false)}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {language === 'id' ? 'Lewati' : 'Skip'}
          </button>
          <button
            onClick={submitNotes}
            disabled={isSubmitting || !feedbackNotes.trim()}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? (language === 'id' ? 'Mengirim...' : 'Sending...') 
              : (language === 'id' ? 'Kirim' : 'Send')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center space-x-2 mt-2"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {language === 'id' ? 'Apakah ini membantu?' : 'Was this helpful?'}
      </span>
      <button
        onClick={() => handleFeedback('positive')}
        disabled={isSubmitting || feedbackGiven !== null}
        className="p-1 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={language === 'id' ? 'Ya, membantu' : 'Yes, helpful'}
      >
        <ThumbsUp className="h-3 w-3" />
      </button>
      <button
        onClick={() => handleFeedback('negative')}
        disabled={isSubmitting || feedbackGiven !== null}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={language === 'id' ? 'Tidak membantu' : 'Not helpful'}
      >
        <ThumbsDown className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default FeedbackButtons;
