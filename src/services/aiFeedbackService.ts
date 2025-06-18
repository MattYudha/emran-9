import { supabase } from '../api/supabaseClient';
import { AIFeedback } from '../types/rfq';

export class AIFeedbackService {
  private static instance: AIFeedbackService;
  
  public static getInstance(): AIFeedbackService {
    if (!AIFeedbackService.instance) {
      AIFeedbackService.instance = new AIFeedbackService();
    }
    return AIFeedbackService.instance;
  }

  /**
   * Submit user feedback for AI response
   */
  async submitFeedback(feedback: {
    imageUrl?: string;
    userQuery: string;
    aiResponse: string;
    userFeedback: 'positive' | 'negative' | 'neutral';
    feedbackNotes?: string;
    sessionId?: string;
    language?: string;
  }): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('ai_feedback_queue')
        .insert([
          {
            image_url: feedback.imageUrl,
            user_query: feedback.userQuery,
            ai_response: feedback.aiResponse,
            user_feedback: feedback.userFeedback,
            feedback_notes: feedback.feedbackNotes,
            session_id: feedback.sessionId,
            language: feedback.language || 'id',
            status: 'pending'
          }
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Error submitting AI feedback:', error);
        throw new Error('Failed to submit feedback');
      }

      return data.id;
    } catch (error: any) {
      console.error('Error in submitFeedback:', error);
      throw error;
    }
  }

  /**
   * Get pending feedback items (admin only)
   */
  async getPendingFeedback(limit: number = 50, offset: number = 0): Promise<AIFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('ai_feedback_queue')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching pending feedback:', error);
        throw new Error('Failed to fetch pending feedback');
      }

      return data.map(this.mapDatabaseToAIFeedback);
    } catch (error: any) {
      console.error('Error in getPendingFeedback:', error);
      throw error;
    }
  }

  /**
   * Update feedback with correct response (admin only)
   */
  async updateFeedback(
    feedbackId: string, 
    updates: {
      correctResponse?: string;
      status?: 'pending' | 'reviewed' | 'resolved';
      reviewerId?: string;
      feedbackNotes?: string;
    }
  ): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.correctResponse) updateData.correct_response = updates.correctResponse;
      if (updates.status) updateData.status = updates.status;
      if (updates.reviewerId) updateData.reviewer_id = updates.reviewerId;
      if (updates.feedbackNotes) updateData.feedback_notes = updates.feedbackNotes;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('ai_feedback_queue')
        .update(updateData)
        .eq('id', feedbackId);

      if (error) {
        console.error('Error updating feedback:', error);
        throw new Error('Failed to update feedback');
      }
    } catch (error: any) {
      console.error('Error in updateFeedback:', error);
      throw error;
    }
  }

  /**
   * Get feedback statistics (admin only)
   */
  async getFeedbackStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    resolved: number;
    positiveRatio: number;
    negativeRatio: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('ai_feedback_queue')
        .select('status, user_feedback');

      if (error) {
        console.error('Error fetching feedback stats:', error);
        throw new Error('Failed to fetch feedback statistics');
      }

      const total = data.length;
      const pending = data.filter(item => item.status === 'pending').length;
      const reviewed = data.filter(item => item.status === 'reviewed').length;
      const resolved = data.filter(item => item.status === 'resolved').length;
      
      const positive = data.filter(item => item.user_feedback === 'positive').length;
      const negative = data.filter(item => item.user_feedback === 'negative').length;
      
      const positiveRatio = total > 0 ? positive / total : 0;
      const negativeRatio = total > 0 ? negative / total : 0;

      return {
        total,
        pending,
        reviewed,
        resolved,
        positiveRatio,
        negativeRatio
      };
    } catch (error: any) {
      console.error('Error in getFeedbackStats:', error);
      throw error;
    }
  }

  /**
   * Delete feedback item (admin only)
   */
  async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_feedback_queue')
        .delete()
        .eq('id', feedbackId);

      if (error) {
        console.error('Error deleting feedback:', error);
        throw new Error('Failed to delete feedback');
      }
    } catch (error: any) {
      console.error('Error in deleteFeedback:', error);
      throw error;
    }
  }

  /**
   * Map database record to AIFeedback type
   */
  private mapDatabaseToAIFeedback(data: any): AIFeedback {
    return {
      id: data.id,
      imageUrl: data.image_url,
      userQuery: data.user_query,
      aiResponse: data.ai_response,
      userFeedback: data.user_feedback,
      correctResponse: data.correct_response,
      feedbackNotes: data.feedback_notes,
      status: data.status,
      reviewerId: data.reviewer_id,
      sessionId: data.session_id,
      language: data.language,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// Export singleton instance
export const aiFeedbackService = AIFeedbackService.getInstance();
