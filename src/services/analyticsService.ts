// src/services/analyticsService.ts
import { supabase } from '../api/supabaseClient'; //
import { ANALYTICS_EVENTS } from '../utils/constants'; //
import { generateSessionId, getDeviceInfo } from '../utils/helpers'; //

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
      await this.trackEvent(ANALYTICS_EVENTS.CHATBOT_MESSAGE_SENT, { //
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
      await this.trackEvent(ANALYTICS_EVENTS.IMAGE_ANALYZED, { //
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
      await this.trackEvent(ANALYTICS_EVENTS.SUGGESTION_CLICKED, { //
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
      await this.trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, { //
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
      await this.trackEvent(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED, { //
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
      await this.trackEvent(ANALYTICS_EVENTS.SERVICE_PAGE_VISITED, { //
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
      await this.trackEvent(ANALYTICS_EVENTS.PROACTIVE_MESSAGE_SHOWN, { //
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
      // Dapatkan user ID dari sesi yang sedang aktif
      const { data: { user } } = await supabase.auth.getUser(); //

      const { error } = await supabase //
        .from('analytics_events') //
        .insert([
          {
            event_type: eventType, //
            event_data: eventData, //
            session_id: this.sessionId, //
            timestamp: new Date().toISOString(), //
            user_id: user?.id || null, // Tambahkan user_id jika ada
            user_agent: navigator.userAgent, //
            ip_address: null // Will be populated by server if needed
          }
        ]); //

      if (error) { //
        console.error('Error inserting analytics event:', error); //
      }
    } catch (error) {
      console.error('Error in trackEvent:', error);
    }
  }

  /**
   * NEW: Mengambil ringkasan analitik untuk pengguna tertentu.
   */
  async getDashboardAnalyticsSummaryForUser(userId: string): Promise<{
    totalChatbotInteractions: number;
    totalServicePageViews: number;
  }> {
    try {
      // Total Interaksi Chatbot
      const { count: chatbotInteractionsCount, error: chatbotError } = await supabase //
        .from('analytics_events') //
        .select('*', { count: 'exact', head: true }) //
        .eq('user_id', userId) //
        .eq('event_type', ANALYTICS_EVENTS.CHATBOT_MESSAGE_SENT); //

      if (chatbotError) throw chatbotError; //

      // Total Kunjungan Halaman Layanan
      const { count: servicePageViewsCount, error: pageViewError } = await supabase //
        .from('analytics_events') //
        .select('*', { count: 'exact', head: true }) //
        .eq('user_id', userId) //
        .eq('event_type', ANALYTICS_EVENTS.SERVICE_PAGE_VISITED); //

      if (pageViewError) throw pageViewError; //

      return {
        totalChatbotInteractions: chatbotInteractionsCount || 0, //
        totalServicePageViews: servicePageViewsCount || 0, //
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics summary:', error); //
      return {
        totalChatbotInteractions: 0, //
        totalServicePageViews: 0, //
      };
    }
  }

  /**
   * Get session analytics summary
   */
  async getSessionSummary(): Promise<any> {
    try {
      const { data, error } = await supabase //
        .from('analytics_events') //
        .select('*') //
        .eq('session_id', this.sessionId) //
        .order('timestamp', { ascending: true }); //

      if (error) { //
        console.error('Error fetching session summary:', error); //
        return null;
      }

      return {
        sessionId: this.sessionId, //
        events: data, //
        totalEvents: data?.length || 0, //
        sessionStart: data?.[0]?.timestamp, //
        sessionEnd: data?.[data.length - 1]?.timestamp //
      };
    } catch (error) {
      console.error('Error in getSessionSummary:', error);
      return null;
    }
  }

  /**
   * NEW: Fetch monthly website traffic (example for Bar Chart)
   * Aggregates page_view events by month.
   */
  async getMonthlyWebsiteTraffic(): Promise<Array<{ month: string; visitors: number; year: number }>> {
    try {
      // Use a custom SQL query or RPC for more efficient aggregation
      // For simplicity, we'll fetch all page views and aggregate in JS
      const { data, error } = await supabase //
        .from('analytics_events') //
        .select('timestamp') //
        .eq('event_type', ANALYTICS_EVENTS.PAGE_VIEW) //
        .order('timestamp', { ascending: true }); //

      if (error) throw error; //

      const monthlyDataMap = new Map<string, { visitors: number, year: number }>(); //

      data.forEach(event => { //
        const date = new Date(event.timestamp); //
        const year = date.getFullYear(); //
        const month = date.toLocaleString('default', { month: 'short' }); //
        const key = `${month}-${year}`; //

        if (!monthlyDataMap.has(key)) { //
          monthlyDataMap.set(key, { visitors: 0, year }); //
        }
        monthlyDataMap.get(key)!.visitors++; //
      }); //

      // Convert map to array and sort by year and month
      const result = Array.from(monthlyDataMap.entries()) //
        .map(([key, value]) => ({ month: key.split('-')[0], visitors: value.visitors, year: value.year })) //
        .sort((a, b) => { //
          if (a.year !== b.year) return a.year - b.year; //
          const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; //
          return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month); //
        }); //

      return result; //
    } catch (error) {
      console.error('Error fetching monthly website traffic:', error); //
      return []; //
    }
  }

  /**
   * NEW: Fetch daily website traffic for histogram (example for Histogram)
   * Aggregates page_view events by day.
   */
  async getDailyWebsiteTraffic(): Promise<Array<{ date: string; visitors: number }>> {
    try {
      const { data, error } = await supabase //
        .from('analytics_events') //
        .select('timestamp') //
        .eq('event_type', ANALYTICS_EVENTS.PAGE_VIEW); //

      if (error) throw error; //

      const dailyDataMap = new Map<string, number>(); // date string -> visitor count

      data.forEach(event => { //
        const date = new Date(event.timestamp).toISOString().split('T')[0]; //YYYY-MM-DD
        dailyDataMap.set(date, (dailyDataMap.get(date) || 0) + 1); //
      }); //

      const result = Array.from(dailyDataMap.entries()) //
        .map(([date, visitors]) => ({ date, visitors })) //
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); //

      return result; //
    } catch (error) {
      console.error('Error fetching daily website traffic:', error); //
      return []; //
    }
  }

  /**
   * NEW: Fetch data for Year-over-Year Growth (example for second Histogram/Bar chart)
   * Requires more complex aggregation, potentially needs a Supabase SQL view.
   * For simplicity, we'll mock this or show how to structure it.
   */
  async getYearOverYearGrowth(): Promise<Array<{ year: number; month: string; growth: number }>> {
    // This is a more complex aggregation. For real data, you'd likely:
    // 1. Fetch all page views.
    // 2. Group by month and year.
    // 3. Calculate growth based on previous year's same month.
    // This often involves SQL views or functions for performance.
    
    // For demonstration, let's return some mock data or a simplified aggregation based on `getMonthlyWebsiteTraffic`
    const monthlyTraffic = await this.getMonthlyWebsiteTraffic(); //
    const yearlyData: { [year: number]: { [month: string]: number } } = {}; //

    monthlyTraffic.forEach(item => { //
      if (!yearlyData[item.year]) yearlyData[item.year] = {}; //
      yearlyData[item.year][item.month] = item.visitors; //
    }); //

    const growthData: Array<{ year: number; month: string; growth: number }> = []; //
    const sortedYears = Object.keys(yearlyData).map(Number).sort(); //

    for (let i = 1; i < sortedYears.length; i++) { //
      const currentYear = sortedYears[i]; //
      const previousYear = sortedYears[i - 1]; //

      for (const month of ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']) { //
        const currentMonthVisitors = yearlyData[currentYear]?.[month] || 0; //
        const previousMonthVisitors = yearlyData[previousYear]?.[month] || 0; //

        let growth = 0; //
        if (previousMonthVisitors > 0) { //
          growth = ((currentMonthVisitors - previousMonthVisitors) / previousMonthVisitors) * 100; //
        } else if (currentMonthVisitors > 0) { //
          growth = 100; // Infinite growth from zero base
        }
        growthData.push({ year: currentYear, month, growth: parseFloat(growth.toFixed(1)) }); //
      }
    }

    return growthData; //
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();