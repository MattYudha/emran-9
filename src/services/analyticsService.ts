import { supabase } from '../api/supabaseClient';
import { AnalyticsEvent } from '../types/content';
import { ANALYTICS_EVENTS } from '../utils/constants';
import { generateSessionId, getDeviceInfo } from '../utils/helpers';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private constructor() {
    this.sessionId = generateSessionId();
  }

  /**
   * Track chatbot interaction
   */
  async trackChatbotInteraction(eventData: {
    messageType: 'text' | 'image';
    userMessage: string;
    botResponse: string;
    hasImageAnalysis?: boolean;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.CHATBOT_MESSAGE_SENT, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking chatbot interaction:', error);
    }
  }

  /**
   * Track image upload and analysis
   */
  async trackImageUploadAnalysis(eventData: {
    fileName: string;
    fileSize: number;
    fileType: string;
    analysisResult?: any;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.IMAGE_ANALYZED, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking image analysis:', error);
    }
  }

  /**
   * Track suggestion click
   */
  async trackSuggestionClick(eventData: {
    suggestionText: string;
    category: string;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.SUGGESTION_CLICKED, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking suggestion click:', error);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(eventData: {
    pageName: string;
    pageUrl: string;
    referrer?: string;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        deviceInfo: getDeviceInfo()
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  /**
   * Track contact form submission
   */
  async trackContactFormSubmission(eventData: {
    formData: any;
    success: boolean;
    errorMessage?: string;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking contact form submission:', error);
    }
  }

  /**
   * Track service page visit
   */
  async trackServicePageVisit(eventData: {
    serviceName: string;
    timeSpent?: number;
    scrollDepth?: number;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.SERVICE_PAGE_VISITED, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking service page visit:', error);
    }
  }

  /**
   * Track proactive message shown
   */
  async trackProactiveMessage(eventData: {
    triggerType: string;
    pageName: string;
    messageContent: string;
    language: string;
  }): Promise<void> {
    try {
      await this.trackEvent(ANALYTICS_EVENTS.PROACTIVE_MESSAGE_SHOWN, {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking proactive message:', error);
    }
  }

  /**
   * Generic event tracking method
   */
  private async trackEvent(eventType: string, eventData: Record<string, any>): Promise<void> {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([
          {
            event_type: eventType,
            event_data: eventData,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: null // Will be populated by server if needed
          }
        ]);

      if (error) {
        console.error('Error inserting analytics event:', error);
      }
    } catch (error) {
      console.error('Error in trackEvent:', error);
    }
  }

  /**
   * Get session analytics summary
   */
  async getSessionSummary(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching session summary:', error);
        return null;
      }

      return {
        sessionId: this.sessionId,
        events: data,
        totalEvents: data?.length || 0,
        sessionStart: data?.[0]?.timestamp,
        sessionEnd: data?.[data.length - 1]?.timestamp
      };
    } catch (error) {
      console.error('Error in getSessionSummary:', error);
      return null;
    }
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
